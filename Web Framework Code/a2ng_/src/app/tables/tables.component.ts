// Tables Component
// Imports
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Team, Result, Standings } from '../team';
import { TeamsService } from '../teams.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css'],
})
export class TablesComponent implements OnInit {
  teams: Team[] = [];
  results: Result[] = [];
  standings: Standings[] = [];

  constructor(private teamsService: TeamsService) {}

  ngOnInit(): void {
    // Combine requests for teams and results using forkJoin to ensure both complete before calculating standings
    forkJoin({
      teams: this.teamsService.getTeams(),
      results: this.teamsService.getResults(),
    }).subscribe(({ teams, results }) => {
      this.teams = teams;
      // Since division is a string in the results, compare with a string "1"
      this.results = results.filter((result) => result.division === '1');
      // Calculate standings once the teams and results are loaded
      this.calculateStandings();
    });
  }

  calculateStandings() {
    // create a set of team IDs that are in Division 1 based on the results.
    const division1TeamIds = new Set(
      this.results.map((result) => Number(result.team1ID))
    );
    this.results.forEach((result) =>
      division1TeamIds.add(Number(result.team2ID))
    );

    // Filter the teams array to only include teams that are in Division 1.
    const division1Teams = this.teams.filter((team) =>
      division1TeamIds.has(Number(team.id))
    );

    // create the standings map only for Division 1 teams.
    const standingsMap = new Map<number, Standings>();
    division1Teams.forEach((team) =>
      standingsMap.set(Number(team.id), {
        teamID: Number(team.id),
        teamName: team.name,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        diff: 0,
        points: 0,
      })
    );

    // Iterate through each game result to update team standings
    this.results.forEach((result: Result) => {
      const homeTeam = standingsMap.get(Number(result.team1ID));
      const awayTeam = standingsMap.get(Number(result.team2ID));

      if (!homeTeam || !awayTeam) {
        console.error(
          'One of the teams in the result set does not exist in the teams data.'
        );
        return;
      }

      const homeScore = result.team1Goals * 3 + result.team1Points;
      const awayScore = result.team2Goals * 3 + result.team2Points;

      homeTeam.played++;
      awayTeam.played++;

      homeTeam.pointsFor += homeScore;
      awayTeam.pointsFor += awayScore;

      homeTeam.pointsAgainst += awayScore;
      awayTeam.pointsAgainst += homeScore;

      if (homeScore > awayScore) {
        homeTeam.wins++;
        homeTeam.points += 2;
        awayTeam.losses++;
      } else if (homeScore < awayScore) {
        awayTeam.wins++;
        awayTeam.points += 2;
        homeTeam.losses++;
      } else {
        homeTeam.draws++;
        awayTeam.draws++;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }

      // Calculate the point difference
      homeTeam.diff = homeTeam.pointsFor - homeTeam.pointsAgainst;
      awayTeam.diff = awayTeam.pointsFor - awayTeam.pointsAgainst;
    });

    // After processing results, remove any teams from the map that didn't play in Division 1
    for (let teamID of standingsMap.keys()) {
      if (!division1TeamIds.has(teamID)) {
        standingsMap.delete(teamID);
      }
    }

    // Convert the standings map to an array after removal of non-Division 1 teams
    this.standings = Array.from(standingsMap.values()).sort(
      (a, b) => b.points - a.points || b.diff - a.diff
    );

    // Sort the standings by points, then by point difference
    this.standings.sort((a, b) => b.points - a.points || b.diff - a.diff);
  }
}
