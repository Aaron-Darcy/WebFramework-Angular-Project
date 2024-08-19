// Stats Component
// Imports
import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../teams.service';
import * as d3 from 'd3'; // Import D3 library
import { CommonModule } from '@angular/common';
import { Result, Team, TeamScore } from '../team';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
  // Variables & Arrays etc
  teams: any[] = [];
  selectedTeam: string = '';
  selectedTeamName: string = '';
  selectedTeamResults: Result[] = [];
  results: Result[] = [];
  constructor(private teamsService: TeamsService) {}

  // Call method to fetch teams on component initialization
  ngOnInit(): void {
    this.getTeams();
  }

  // Method to fetch teams from the service
  getTeams(): void {
    this.teamsService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.teams = teams; // Store fetched teams in the component
        console.log('Teams fetched:', this.teams); // Log fetched teams for verification
      },
      error: (error) => {
        console.error('Error fetching teams:', error); // Log error if fetching teams fails
      },
    });
  }

  // Method triggered when a team is selected
  onTeamSelect(teamId: string): void {
    this.selectedTeam = teamId; // Set the selected team ID
    this.teamsService.getResults().subscribe((results) => {
      this.results = results; // Store fetched results in the component
      const teamResults = this.processResultsForTeam(
        // Process results for the selected team
        this.selectedTeam,
        results
      );
      this.drawChart(teamResults); // Draw chart based on processed results
      this.drawScatterPlot(teamResults); // Draw scatter plot based on processed results
    });
  }

  // Method to parse score string to number
  parseScore(score: string | undefined): number {
    if (!score) {
      return 0; // If score is undefined or empty, return 0
    }
    const [goals, points] = score.split('-').map(Number);
    return goals * 3 + points; // Calculate total score based on goals and points
  }

  // Method to process results for the selected team
  processResultsForTeam(teamId: string, results: Result[]): TeamScore[] {
    console.log('Processing results for team ID:', teamId);
    const processedResults: TeamScore[] = []; // Initialize array to store processed results
    const trimmedTeamId = String(teamId).trim(); // Trim and ensure team ID is a string

    // Iterate through each result and process for the selected team
    results.forEach((result) => {
      const resultTeam1ID = String(result.team1ID).trim();
      const resultTeam2ID = String(result.team2ID).trim();
      const isTeam1Involved = resultTeam1ID === trimmedTeamId;

      if (isTeam1Involved || resultTeam2ID === trimmedTeamId) {
        const teamGoals = isTeam1Involved
          ? result.team1Goals
          : result.team2Goals;
        const teamPoints = isTeam1Involved
          ? result.team1Points
          : result.team2Points;
        const opponentGoals = isTeam1Involved
          ? result.team2Goals
          : result.team1Goals;
        const opponentPoints = isTeam1Involved
          ? result.team2Points
          : result.team1Points;

        const teamTotalPoints = teamGoals * 3 + teamPoints;
        const opponentTotalPoints = opponentGoals * 3 + opponentPoints;

        let roundResult = 'draw'; // Default to draw
        if (teamTotalPoints > opponentTotalPoints) roundResult = 'win';
        else if (teamTotalPoints < opponentTotalPoints) roundResult = 'loss';

        const opponentName = isTeam1Involved ? result.team2 : result.team1;

        processedResults.push({
          round: `Rd ${result.round} v ${opponentName}`,
          teamScore: `${teamGoals}-${teamPoints}`,
          opponentScore: `${opponentGoals}-${opponentPoints}`,
          opponentName: opponentName,
          roundResult: roundResult,
        });
      }
    });

    console.log('Processed results:', processedResults);
    return processedResults;
  }

  // Method to update the selected team's name
  updateSelectedTeamName(): void {
    const selectedTeamObj = this.teams.find(
      (team) => team.id === this.selectedTeam
    ); // Find selected team object
    this.selectedTeamName = selectedTeamObj
      ? selectedTeamObj.name
      : 'Default Name'; // Set default name if not found
  }

  // Method to fetch and draw chart for the selected team
  fetchAndDrawChart(teamId: string): void {
    console.log('Selected Team ID:', teamId);
    this.teamsService.getResults().subscribe(
      (allResults) => {
        const teamResults = allResults.filter(
          (result) => result.team1ID === teamId || result.team2ID === teamId
        ); // Filter results for selected team
        if (teamResults.length === 0) {
          console.log('No results found for the selected team.');
          return;
        }
        this.drawChart(teamResults); // Draw chart based on filtered results
      },
      (error) => {
        console.error('Error fetching results: ', error); // Log error if fetching results fails
      }
    );
  }

  // Method to draw the bar chart
  drawChart(data: any[]): void {
    console.log('Data passed to drawChart:', data);
    d3.select('#bar-chart').selectAll('svg').remove(); // Remove any existing SVG elements
    const margin = { top: 20, right: 30, bottom: 80, left: 90 }, //  chart margin
      width = 600 - margin.left - margin.right, //  chart width
      height = 500 - margin.top - margin.bottom; //  chart height
    const svg = d3 // SVG element
      .select('#bar-chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3 // Define X scale
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.round))
      .padding(0.2);
    svg
      .append('g') // X axis
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(30,0)')
      .style('text-anchor', 'end');
    const y = d3
      .scaleLinear() // Y scale
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(
            this.parseScore(d.teamScore),
            this.parseScore(d.opponentScore)
          )
        ) || 0,
      ])
      .range([height, 0]);
    svg.append('g').call(d3.axisLeft(y)); // Append Y axis
    const barPadding = 5; // Padding between bars and labels
    const getBarHeight = (score: string) => height - y(this.parseScore(score)); // Function to calculate bar height
    const roundGroup = svg // Create a group for each round
      .selectAll('.round-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'round-group')
      .attr('transform', (d) => `translate(${x(d.round)},0)`);
    roundGroup // Add team score bars
      .append('rect')
      .attr('x', 0)
      .attr('y', (d) => y(this.parseScore(d.teamScore)))
      .attr('width', x.bandwidth() / 2 - barPadding)
      .attr('height', (d) => getBarHeight(d.teamScore))
      .attr('fill', '#69b3a2');
    roundGroup // Add opponent score bars
      .append('rect')
      .attr('x', x.bandwidth() / 2)
      .attr('y', (d) => y(this.parseScore(d.opponentScore)))
      .attr('width', x.bandwidth() / 2 - barPadding)
      .attr('height', (d) => getBarHeight(d.opponentScore))
      .attr('fill', '#d95f02');
    roundGroup // Add text labels for team scores
      .selectAll('.team-score-text')
      .data((d) => [d])
      .enter()
      .append('text')
      .attr('class', 'team-score-text')
      .attr('x', x.bandwidth() / 4)
      .attr('y', (d) => y(this.parseScore(d.teamScore)) - 5)
      .text((d) => d.teamScore)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'black');
    roundGroup // Add text labels for opponent scores
      .selectAll('.opponent-score-text')
      .data((d) => [d])
      .enter()
      .append('text')
      .attr('class', 'opponent-score-text')
      .attr('x', (3 * x.bandwidth()) / 4)
      .attr('y', (d) => y(this.parseScore(d.opponentScore)) - 5)
      .text((d) => d.opponentScore)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'black');
  }

  // Method to draw the scatter plot
  drawScatterPlot(data: TeamScore[]): void {
    const margin = { top: 20, right: 30, bottom: 50, left: 90 }; //  chart margin
    const width = 600 - margin.left - margin.right; //  chart width
    const height = 500 - margin.top - margin.bottom; // chart height
    const winIncrement = 4; // Increment for a win
    const drawIncrement = winIncrement / 2; // Increment for a draw
    let cumulativeScore = 0; //  cumulative score
    d3.select('#scatter-plot').selectAll('svg').remove(); // Remove any existing SVG elements
    const svg = d3 // Create SVG element
      .select('#scatter-plot')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const x = d3 // Define X scale
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.round))
      .padding(0.2);
    svg
      .append('g') // Append X axis
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
    const y = d3
      .scaleLinear() // Define Y scale
      .domain([0, 20])
      .range([height, 0]);
    svg.append('g').call(d3.axisLeft(y)); // Append Y axis
    svg // Add dots for scatter plot
      .selectAll('dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d: TeamScore) => {
        const xValue = x(d.round);
        return xValue ? xValue + x.bandwidth() / 2 : 0; // Center the circle in the band
      })
      .attr('cy', (d: TeamScore) => {
        if (d.roundResult === 'win') {
          cumulativeScore += winIncrement; // Increment cumulative score for win
        } else if (d.roundResult === 'draw') {
          cumulativeScore += drawIncrement; // Increment cumulative score for draw
        }
        return y(cumulativeScore); // Convert score to pixel position
      })
      .attr('r', 10) // Circle radius
      .style('fill', (d) => {
        // Set fill color based on round result
        if (d.roundResult === 'win') {
          return 'green';
        } else if (d.roundResult === 'draw') {
          return 'orange';
        } else {
          return 'red';
        }
      });
  }
}
