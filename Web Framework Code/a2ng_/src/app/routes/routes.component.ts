// Routes Component
// Imports
import { Component } from '@angular/core';
import { TeamsService } from '../teams.service'; 
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {
  // Variable to store JSON data
  jsonData: any; 

  constructor(private teamsService: TeamsService) {}

  // Implement the ngOnInit lifecycle hook
  ngOnInit(): void {
    // Load round 1 results by default
    this.getResultsByRound(1);
  }

  // Method to fetch teams data
  getTeams() {
    this.teamsService.getTeams().subscribe(data => {
      // Assign fetched data to jsonData
      this.jsonData = data; 
    });
  }

  // Method to fetch players data
  getPlayers() {
    this.teamsService.getPlayers().subscribe(data => {
      // Assign fetched data to jsonData
      this.jsonData = data; 
    });
  }

  // Method to fetch all results data
  getResults() {
    this.teamsService.getResults().subscribe(data => {
      // Assign fetched data to jsonData
      this.jsonData = data; 
    });
  }

  // Method to fetch results data for a specific round
  getResultsByRound(round: number) {
    this.teamsService.getResultsByRound(round).subscribe(data => {
      // Assign fetched data to jsonData
      this.jsonData = data; 
    });
  }
}
