import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust path if needed

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  // Assuming you are using standalone components. If not, remove 'standalone: true'.
  standalone: true, 
  imports: [], // Add CommonModule if you use *ngIf, etc.
})
export class SignupComponent {
  private authService = inject(AuthService);

  // This method will be called when the button is clicked
  async handleGoogleLogin() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}