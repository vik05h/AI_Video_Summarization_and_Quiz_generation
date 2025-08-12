import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Dashboard } from "./body/dashboard/dashboard";
import { Header } from "./header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Dashboard, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'AI_Video_Summarization';
}
