// Interfaces

// Team interface
export interface Team {    
    id: string;
    name: string;
}
// Player interface
export interface Player {
    id: number;
    teamID: string;
    name: string;
    squadNumber: number;
    age: number;
    matches: number;
  }
  // Result interface
  export interface Result {
    teamID1(teamID1: any): unknown;
    teamID2(teamID2: any): unknown;
    id: number;
    round: string;
    division: string; 
    team1: string;
    team1ID: string;
    team2: string;
    team2ID: string;
    team1Score: string;
    team1Goals: number;
    team1Points: number;
    team2Score: string;
    team2Goals: number;
    team2Points: number;
    date: string;
    time: string;
    competition: string;
    season: string;
  }
  
  // Standings interface
  export interface Standings {
    teamID: number;
    teamName: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
    diff: number;
    points: number;
  }
// User interface
  export interface User {
    email: string;
    password: string;
  }
// TeamScore interface
  export interface TeamScore {
    round: string;
    teamScore: string; 
    opponentScore: string; 
    opponentName: string; 
    roundResult: string;
  }
  