import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api, VideoProcessingResponse } from '../../../services/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-video-url',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './video-url.html',
  styleUrl: './video-url.css'
})
export class VideoUrl {
  videoUrl: string = '';
  summary: string = '';
  transcript: string = '';
  
  constructor(public api: Api) { }

  // submitUrl(){
  //   this.api.urlSummary(this.videoUrl);
  //   this.api.summary = 'Processing...'; // Reset summary while processing
  // }

  submitUrl(videoUrl: string) {
      this.api.urlSummary(videoUrl).subscribe((res: VideoProcessingResponse) => {
      this.api.summary = res.summary;
      this.api.transcript = res.transcript;
      this.summary = "Processing...";
      console.log("testing", res);
      console.log("test", this.summary)
      console.log("Transcript:", this.api.transcript);
      console.log("Summary:", this.api.summary);
    })
  }
}
