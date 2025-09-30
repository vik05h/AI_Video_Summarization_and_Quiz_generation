import { Component, inject } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  // 2. Create a method that will be called when the button is clicked
  async handleGoogleLogin() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Login failed', error);
    }
  }
  onImageError(event: any) {
  console.log('Image failed to load:', event.target.src);
  event.target.src = 'assets/default-avatar.png';
  }
  // Add a method for signing out
  async handleSignOut() {
    await this.authService.signOut();
  }
}
