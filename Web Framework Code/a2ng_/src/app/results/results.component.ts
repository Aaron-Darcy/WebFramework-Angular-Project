// Results Component
// Imports
import { Component, OnInit } from '@angular/core';
import { Player, Team, Result } from '../team';
import { TeamsService } from '../teams.service'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  // Arrays & Variables
  fullResults: Result[] = [];  
  filteredResults: Result[] = []; 
  totalRounds = 7; 
  currentRound = 1; 
  results: Result[] = []; 
  teams: Team[] = [];
  selectedTeam = ''; 

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    // Fetch results for the current round and teams data on component initialization
    this.getResultsForRound(this.currentRound);
    this.getTeams();
  }

  // Getter for the previous round
  get prevRound(): number {
    return this.currentRound > 1 ? this.currentRound - 1 : this.totalRounds;
  }

  // Getter for the next round
  get nextRound(): number {
    return this.currentRound < this.totalRounds ? this.currentRound + 1 : 1;
  }

  // Method to fetch results for a specific round
  getResultsForRound(round: number): void {
    this.teamsService.getResultsByRound(round).subscribe(data => {
      // Store the full data set
      this.fullResults = data; 
      // Apply filtering 
      this.applyTeamFilter(); 
    });
  }

  // Method to fetch teams data
  getTeams(): void {
    this.teamsService.getTeams().subscribe(data => {
      this.teams = data;
    });
  }

  // Method to filter results by team
  filterByTeam(teamName: string): void {
    this.selectedTeam = teamName;
    this.applyTeamFilter();
  }

  // Method to apply team filter to results
  applyTeamFilter(): void {
    if (this.selectedTeam) {
      // Filter results based on the selected team
      this.filteredResults = this.fullResults.filter(result =>
        result.team1 === this.selectedTeam || result.team2 === this.selectedTeam
      );
    } else {
      // If no team is selected, show all results
      this.filteredResults = [...this.fullResults];
    }
  }

  // Method to navigate to the previous round
  goToPreviousRound(): void {
    this.currentRound = this.prevRound;
    this.getResultsForRound(this.currentRound);
  }

  // Method to navigate to the next round
  goToNextRound(): void {
    this.currentRound = this.nextRound;
    this.getResultsForRound(this.currentRound);
  }
}
