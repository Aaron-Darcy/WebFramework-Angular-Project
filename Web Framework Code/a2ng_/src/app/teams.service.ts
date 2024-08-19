// Teams Service
// Imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player, Team, Result } from './team';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private baseUrl = 'http://localhost:3000'; // Base URL of the API

  constructor(private http: HttpClient) {}

  // Retrieves players from the API
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.baseUrl}/players`);
  }

  // Retrieves match results by round number from the API
  getResultsByRound(round: number): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/results/${round}`);
  }

  // Retrieves teams from the API, mapping team IDs to numbers
  getTeams(): Observable<Team[]> {
    return this.http
      .get<Team[]>(`${this.baseUrl}/teams`)
      .pipe(
        map((teams: any[]) =>
          teams.map((team: any) => ({ ...team, id: Number(team.id) }))
        )
      );
  }

  // Retrieves match results from the API, filtering out incomplete results
  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.baseUrl}/results`).pipe(
      map((results: any[]) =>
        results.filter(
          (result: any) =>
            result.team1Score !== '0' && result.team2Score !== '0'
        )
      )
    );
  }

  // log in a user with provided credentials
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        map((response) => {
          if (response.message === 'Login successful') {
            localStorage.setItem('isLoggedIn', 'true');
            return true;
          }
          return false;
        }),
        catchError(() => of(false))
      );
  }

  // Updates a match result in the API
  updateResult(result: Result): Observable<any> {
    return this.http.post(`${this.baseUrl}/results/update`, result);
  }

  // Deletes a match result from the API by ID
  deleteResult(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/results/${id}`);
  }

  // Retrieves scores for a specific team from the API
  getTeamScores(teamId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/team-scores/${teamId}`);
  }
}
