import { Component, OnInit } from '@angular/core';
import { Api,QuizResponse } from '../../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz implements OnInit{
  constructor(public api: Api) { }
  transcript: string = '';
  quiz: QuizResponse['quiz_structure'] = [];

  ngOnInit(): void {
    this.getQuiz();
  }

  getQuiz(){
    this.transcript = this.api.transcript;
    if(!this.transcript){
      console.error('Transcript is not available');
      return;
    }

    this.api.generateQuize(this.transcript).subscribe((res: QuizResponse) => {
      console.log('Quiz received in component:', res);
      this.quiz = res.quiz_structure;
      console.log("All quiz QnA", this.quiz)
    })
  } 
}
