// Playrs Compoent
// Imports
import { Component, OnInit } from '@angular/core';
import { Player, Team } from '../team';
import { TeamsService } from '../teams.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css'],
})
export class PlayersComponent implements OnInit {
  
  // Properties to hold the data
  players: Player[] = [];
  private allPlayers: Player[] = [];
  teams: Team[] = [];
  teamMap: Record<string, string> = {}; 
  selectedTeam: string = 'All'; 

  // Constructor to inject the TeamsService
  constructor(private teamsService: TeamsService) {}

  ngOnInit() {
    this.getTeams();  // Fetch teams
    this.getPlayers(); // Fetch players
  }

  // Method to fetch players from the service
  getPlayers(): void {
    // Fetch players from the service
    this.teamsService.getPlayers().subscribe((data: Player[]) => {
      this.allPlayers = data;
      this.sortPlayers(); // Sort the fetched players
      this.players = [...this.allPlayers];
    });
  }
  
  //  method to sort players by team name then by player name
  sortPlayers(): void {
    this.allPlayers.sort((a, b) => {
      const teamNameA = this.getTeamName(a.teamID);
      const teamNameB = this.getTeamName(b.teamID);
      return teamNameA.localeCompare(teamNameB) || a.name.localeCompare(b.name);
    });
  }
  
  // Method to fetch teams from the service
  getTeams(): void {
    this.teamsService.getTeams().subscribe((data: Team[]) => {
      // Sort the fetched teams by name before assigning them
      this.teams = data.sort((a, b) => a.name.localeCompare(b.name));
      // Create a map of team IDs to team names
      this.createTeamMap(); 
      // Fetch players after fetching teams
      this.getPlayers();
    });
  }

  // Method to create a map from team IDs to team names
  createTeamMap(): void {
    this.teamMap = this.teams.reduce((map, team) => {
      map[team.id] = team.name;
      return map;
    }, {} as Record<string, string>);
  }

  // Method to get the team name from the team ID using the teamMap
  getTeamName(teamID: string): string {
    // Get the team name using the teamMap
    return this.teamMap[teamID];
  }

  // Method to filter the players by the selected team on dropdown
  filterByTeam(event: Event): void {

    // Get the selected team ID from the dropdown
    const selectElement = event.target as HTMLSelectElement;
    const teamID = selectElement.value;
    
    // Update the selected team
    this.selectedTeam = teamID; 
  
    // Filter players based on the selected team
    if (teamID === 'All') {
      // Show all players if All is selected
      this.players = [...this.allPlayers]; 
    } else {
      // Filter players by team
      this.players = this.allPlayers.filter(player => player.teamID === teamID); 
    }
    // Sort the filtered list of players
    this.sortPlayers(); 
  }
  
}  
