// Teams Component
// Imports
import { Component, OnInit } from '@angular/core';
import { Team } from '../team';
import { TeamsService } from '../teams.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  // Array to hold teams data
  teams: Team[] = [];

  constructor(private teamsService: TeamsService) {}

  ngOnInit() {
    // Fetch teams data on component initialization
    this.getTeams();
  }

  // Method to fetch teams data
  getTeams(): void {
    // Subscribe to teams data
    this.teamsService.getTeams().subscribe((data: Team[]) => {
      // Sort teams by name
      this.teams = data.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
}
