// Imports
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PlayersComponent } from './players/players.component';
import { RoutesComponent } from './routes/routes.component';
import { StatsComponent } from './stats/stats.component';
import { TablesComponent } from './tables/tables.component';
import { TeamsComponent } from './teams/teams.component';
import { ResultsComponent } from './results/results.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './notfound/notfound.component';

// Routes
export const routes: Routes = [
    { path: '', component: RoutesComponent, title: 'RoutesComponent'},
    { path: 'teams', component: TeamsComponent, title: 'TeamsComponent'},
    { path: 'players', component: PlayersComponent, title: 'PlayersComponent'},
    { path: 'results', component: ResultsComponent, title: 'ResultsComponent'},
    { path: 'tables', component: TablesComponent, title: 'TablesComponent'},
    { path: 'stats', component: StatsComponent, title: 'StatsComponent'},
    { path: 'login', component: LoginComponent, title: 'LoginComponent'},
    { path: 'admin', component: AdminComponent, title: 'AdminComponent'},
    // Route Not Founds
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];