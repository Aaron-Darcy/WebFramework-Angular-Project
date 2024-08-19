// Nav Component
// Imports
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  constructor(private router: Router) {}
  isLoggedIn = false;

ngOnInit(): void {
  this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
}


  login(email: string, password: string): void {
    //placeholder for actual login logic
    if (email === 'admin@example.com' && password === 'admin') {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
    }
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/']).then(() => {
      // refresh the page after the navigation has completed.
      window.location.reload(); 
    });
  }

}