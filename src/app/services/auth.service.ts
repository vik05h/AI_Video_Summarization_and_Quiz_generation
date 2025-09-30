// src/app/services/auth.service.ts

import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  
  // Using a signal to hold thet current session and user sate
  _session = signal<Session | null>(null);
  _user = signal<User | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Listen to auth state changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session);

      // Set the session and user signals
      this._session.set(session);
      this._user.set(session?.user ?? null);

      // Optional: Redirect on login/logout
      if (event === 'SIGNED_IN') {
        // You can redirect the user to a dashboard or home page after login
        this.router.navigate(['/']); 
      }
    });
  }

  // Getter for the current user signal (read-only)
  get currentUser() {
    return this._user.asReadonly();
  }

  // Sign in with Google
  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      // Handle the error (e.g., show a notification to the user)
    }
  }

  // Sign out
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      // Redirect to signup or home page after successful sign out
      this.router.navigate(['/home']);
    }
  }
}