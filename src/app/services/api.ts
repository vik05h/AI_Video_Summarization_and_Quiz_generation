import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


export interface VideoProcessingResponse {
  status: string;
  fileName: string;
  title: string;
  transcript: string;
  summary: string;
}

export interface FileUploadResponse {
  fileName: string;
  title: string;
  transcript: string;
  summary: string;
}

export interface QuizResponse {
  quiz_structure: {
    question: string;
    options: string[];
    answer: string;
  }[]
}


@Injectable({
  providedIn: 'root'
})


export class Api {
  private baseUrl = 'http://127.0.0.1:8000'

  summary: string = '';
  transcript: string = '';

  constructor(private http: HttpClient) { }

  //  public urlSummary(videoUrl: string){
  //   this.transcriptReady.next(false); // Reset the transcript ready state
  //   this.http.get<VideoProcessingResponse>(`${this.baseUrl}/process-from-url/?url=${videoUrl}`,).subscribe((response: VideoProcessingResponse)=> {
  //     console.log('Response:', response.transcript);
  //     this.transcript = response.transcript;
  //     this.summary = response.summary;
  //     this.transcriptReady.next(true); // Notify that the transcript is ready
      
  //   })
  //   return this.transcriptReady;
  //   };


  public urlSummary(videoUrl: string): Observable<VideoProcessingResponse> {
    return this.http.get<VideoProcessingResponse>(`${this.baseUrl}/process-from-url/?url=${videoUrl}`);
  }

  // public generateQuize() {
  //   const body = { transcript: this.transcript };
  //   return this.http.post<QuizResponse>(`${this.baseUrl}/generate-quiz`, body).subscribe((res: QuizResponse) => {
  //     console.log("quiz", res);
  //     // let {quize_structure} = res; 
  //     const { question, options, answer } = res.quiz_structure[0]; //Destructuring the response
  //     console.log("question", question);
  //     console.log("Options:");
  //     options.forEach(option => console.log(`- ${option}`));
  //     console.log("answer", answer);
  //   })
  // };

  public generateQuize(transcript: string): Observable<QuizResponse> {
    let body =  { transcript: transcript };
    return this.http.post<QuizResponse>(`${this.baseUrl}/generate-quiz`,body);
  }
}
