import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Home } from "./body/home/home";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AI_Video_Summarization';
}
