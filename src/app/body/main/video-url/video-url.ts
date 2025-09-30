import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Api, VideoProcessingResponse } from '../../../services/api';
import { Quiz } from "../quiz/quiz";
import { DatabaseService } from '../../../services/database';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-video-url',
  standalone: true,
  imports: [CommonModule, FormsModule, Quiz],
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
        animate('0.3s ease-out',)
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

  private authService = inject(AuthService);
  private databaseService = inject(DatabaseService);
  currentUser = this.authService.currentUser;
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
        
        this.saveSummaryToHistory(res, videoUrl);
      },
      error: (error) => {
        console.error('Error processing video:', error);
        this.isLoading = false;
        this.api.summary = 'Error processing video. Please try again.';
      }
    }
  );

  }

  private async saveSummaryToHistory(summaryResponse: VideoProcessingResponse, url: string) {
    const user = this.currentUser();
    // Only proceed if a user is logged in
    if (!user) {
      console.log('No user logged in, skipping history save.');
      return;
    }

    const videoId = this.extractVideoId(url);
    if (!videoId) {
      console.error('Could not extract video ID, cannot save to history.');
      return;
    }

    // Prepare the data payload for the database service
    const summaryPayload = {
      videoId: videoId,
      title: url, // We use the full URL as a title for now
      summaryText: summaryResponse.summary
    };

    try {
      // Call the database service to save the data
      console.log('Saving summary to user history...');
      await this.databaseService.addSummaryToHistory(user.id, summaryPayload);
      console.log('History saved successfully!');
    } catch (error) {
      console.error('Failed to save summary to history:', error);
    }
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