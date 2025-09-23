// video-url.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Api, VideoProcessingResponse } from '../../../services/api';
import { RouterLink } from '@angular/router';
import { Quiz } from "../quiz/quiz";

@Component({
  selector: 'app-video-url',
  imports: [CommonModule, FormsModule, RouterLink, Quiz],
  templateUrl: './video-url.html',
  styleUrl: './video-url.css',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('expandIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scaleY(0)', transformOrigin: 'top' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'scaleY(1)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class VideoUrl {
  videoUrl: string = '';
  summary: string = '';
  transcript: string = '';
  isLoading: boolean = false;
  showQuiz: boolean = false;
  isGeneratingQuiz: boolean = false;
  
  constructor(public api: Api) { }

  submitUrl(videoUrl: string) {
    if (!videoUrl.trim()) return;
    
    this.isLoading = true;
    this.showQuiz = false; // Hide quiz when starting new processing
    this.api.summary = ''; // Clear previous summary
    
    this.api.urlSummary(videoUrl).subscribe({
      next: (res: VideoProcessingResponse) => {
        this.api.summary = res.summary;
        
        this.api.transcript = res.transcript;
        this.isLoading = false;
        
        console.log("Processing complete", res);
        console.log("Transcript:", this.api.transcript);
        console.log("Summary:", this.api.summary);
      },
      error: (error) => {
        console.error('Error processing video:', error);
        this.isLoading = false;
        this.api.summary = 'Error processing video. Please try again.';
      }
    });
  }
  
  // Method to validate YouTube URL (optional enhancement)
  isValidYouTubeUrl(url: string): boolean {
    const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  }

  // Method to extract video ID (optional enhancement)
  extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}