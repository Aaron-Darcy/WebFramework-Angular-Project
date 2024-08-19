// Admin Component
// Imports
import { Component, OnInit } from '@angular/core';
import { Result } from '../team';
import { TeamsService } from '../teams.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {
  results: Result[] = []; // Store results of the selected round
  totalRounds = 7;
  currentRound = 1;

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    // Fetch results for the initial round on component initialization
    this.getResultsForRound(this.currentRound);
  }

  // Method to fetch results for a specific round
  getResultsForRound(round: number): void {
    this.teamsService.getResultsByRound(round).subscribe(data => {
      this.results = data;
    });
  }

  // Method triggered when round selection changes
  onRoundChange(): void {
    // Fetch results for the newly selected round
    this.getResultsForRound(this.currentRound);
  }

  // Admin Methods

  // Method to update a result
  updateResult(result: Result): void {
    this.teamsService.updateResult(result).subscribe(response => {
      console.log(response); // Log the response from the service
    });
  }

  // Method to delete a result
  deleteResult(id: number): void {
    this.teamsService.deleteResult(id).subscribe(response => {
      console.log(response); // Log the response from the service
      // Remove the deleted result from the results array
      this.results = this.results.filter(result => result.id !== id);
    });
  }
}
