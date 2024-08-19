// Login Component
// Imports
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../teams.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected property name to 'styleUrls'
})

export class LoginComponent {
  email = '';
  password = '';

  constructor(private teamsService: TeamsService, private router: Router) {}

  onSubmit(): void {
    // Attempt login using the provided credentials
    this.teamsService.login(this.email, this.password).subscribe(success => {
      if (success) {
        // If login is successful, perform the following actions
        console.log('Login successful');

        // Set 'isLoggedIn' flag to 'true' in local storage to indicate user is logged in
        localStorage.setItem('isLoggedIn', 'true');

        // Navigate to the admin page after successful login
        this.router.navigate(['/admin']).then(() => {
          // Refresh the page to reflect the new login state across the app.
          window.location.reload();
        });
      } else {
        // If login fails, log the failure
        console.log('Login failed');
      }
    });
  }
}
