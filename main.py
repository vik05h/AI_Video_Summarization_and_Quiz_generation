
import torch ,json, re, whisper, ffmpeg , os, shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pytubefix import YouTube
from openai import OpenAI

app = FastAPI()

# --- CORS Configuration ---
origins = [
    "http://localhost:4200",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Directory Setup ---
UPLOAD_DIRECTORY = "./uploads"
DOWNLOAD_DIRECTORY = "./downloads"
AUDIO_DIRECTORY = "./audio"

os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
os.makedirs(DOWNLOAD_DIRECTORY, exist_ok=True)
os.makedirs(AUDIO_DIRECTORY, exist_ok=True)


device = "cuda" if torch.cuda.is_available() else "cpu"

whisper_model = whisper.load_model("base", device=device)


class QuizRequest(BaseModel):
    transcript: str


def transcribe_audio(audio_path: str):
    """
    Transcribes audio file to text using OpenAI Whisper.
    """
    try:
        print(f"Transcribing audio: {audio_path}")
        result = whisper_model.transcribe(audio_path)
        transcript = result["text"]
        print(f"Transcription completed. Length: {len(transcript)} characters")
        return transcript
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    
client = OpenAI(
    api_key="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",
    base_url="https://openrouter.ai/api/v1",
)

def summarize_text(transcript: str):
    """
    Summarizes text using OpenRouter (which provides access to various models).
    """
    try:
        response = client.chat.completions.create(
            model="openai/gpt-4.1-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates concise summaries of video transcripts."},
                {"role": "user", "content": f"Please summarize the following transcript in 5-10 key points:\n\n{transcript}"}
            ],
            max_tokens=500,
            temperature=0.7
        )
        summary = response.choices[0].message.content
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")
# --- Helper Function for Audio Extraction ---
def extract_audio(video_path: str, audio_path: str):
    """
    Extracts audio from a video file using ffmpeg-python.
    """
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, format='wav', acodec='pcm_s16le', ac=1, ar='16000')
            .overwrite_output()
            .run(capture_stdout=True, capture_stderr=True)
        )
    except ffmpeg.Error as e:
        error_details = e.stderr.decode() if e.stderr else "Unknown ffmpeg error"
        raise HTTPException(status_code=500, detail=f"FFmpeg error: {error_details}")

# --- API Endpoints ---
@app.put("/upload-video/")
async def create_upload_video(video: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIRECTORY, video.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)
    
    audio_filename = f"{os.path.splitext(video.filename)[0]}.wav"
    audio_path = os.path.join(AUDIO_DIRECTORY, audio_filename)
    
    extract_audio(file_path, audio_path)
    transcript = transcribe_audio(audio_path)

    return {
        "filename": video.filename, 
        "video_path": file_path, 
        "audio_path": audio_path,
        "transcript": transcript
        }

@app.post("/generate-quiz/")
async def generate_quiz(req: QuizRequest):
    prompt = (
        "Generate 5 multiple-choice quiz questions from this text. "
        "For each question, respond in this JSON structure: "
        '{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"} '
        "IMPORTANT: Respond ONLY with a valid JSON array of objects and nothing else. Do not add any extra text or formatting before or after the array."
        "Text:\n" + req.transcript
    )
    try:
        response = client.chat.completions.create(
            model="deepseek/deepseek-chat", # Changed to the chat model which often follows instructions better
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000 # Increased slightly just in case
        )
        content = response.choices[0].message.content

        quiz = None # Default to None
        try:
            match = re.search(r'\[.*\]', content, re.DOTALL)
            if match:
                json_string = match.group(0)
                quiz = json.loads(json_string)
            # --- FIX ENDS HERE ---
        except Exception as e:
            # This will catch errors if the extracted string is still not valid JSON
            print(f"Failed to parse cleaned JSON: {e}")
            quiz = None

        return {
            "quiz_structure": quiz
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")
    

@app.get("/process-from-url/")
async def process_video_from_url(url: str):
    try:
        yt = YouTube(url)
        stream = yt.streams.get_highest_resolution()
        
        video_path = stream.download(output_path=DOWNLOAD_DIRECTORY)
        filename = os.path.basename(video_path)
        
        audio_filename = f"{os.path.splitext(filename)[0]}.wav"
        audio_path = os.path.join(AUDIO_DIRECTORY, audio_filename)
        
        extract_audio(video_path, audio_path)
        transcript = transcribe_audio(audio_path)

        summary = summarize_text(transcript)
        return {
            "status": "Processing Successful",
            "filename": filename,
            "video_path": video_path,
            "title": yt.title,
            "audio_path": audio_path,
            "transcript": transcript,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error downloading or processing video: {str(e)}")

