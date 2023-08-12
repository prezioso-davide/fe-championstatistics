import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StadiumService } from './service/stadium.service';
import { StadiumViewDTO } from './model/stadium.model';
import { forkJoin, tap } from 'rxjs';
import { TeamService } from './service/team.service';
import { TeamViewDTO } from './model/team.model';
import { ManagerViewDTO } from './model/manager.model';
import { PlayerViewDTO } from './model/player.model';
import { MatchViewDTO } from './model/match.model';
import { GoalViewDTO } from './model/goal.model';
import { PlayerService } from './service/player.service';
import { ManagerService } from './service/manager.service';
import { MatchService } from './service/match.service';
import { GoalService } from './service/goal.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{

    public stadiums: StadiumViewDTO[] = [];
    public teams: TeamViewDTO[] = [];
    public managers: ManagerViewDTO[] = [];
    public players: PlayerViewDTO[] = [];
    public matches: MatchViewDTO[] = [];

    public stadiumOpenModal: boolean = false;
    public teamOpenModal: boolean = false;
    public managerOpenModal: boolean = false;
    public matchOpenModal: boolean = false;
    public playerOpenModal: boolean = false;

    public loading: boolean = false;

    constructor(
        public router: Router,
        private _stadiumService: StadiumService,
        private _teamService: TeamService,
        private _playerService: PlayerService,
        private _managerService: ManagerService,
        private _matchService: MatchService,
        private _goalService: GoalService
    ) {}

    ngOnInit(): void {
        this._getAllData();
    }

    private _getAllData() {
        this.loading = true;

        const stadiumData$ = this._stadiumService.getAllStadiums();
        const teamData$ = this._teamService.getAllTeams();
        const playerData$ = this._playerService.getAllPlayers();
        const managerData$ = this._managerService.getAllManagers();
        const matchData$ = this._matchService.getAllMatches();

        const allData$ = forkJoin([stadiumData$, teamData$, playerData$, managerData$, matchData$])
            .pipe(
                tap(([stadiumData, teamData, playerData, managerData, matchData]) => {
                    this.stadiums = stadiumData;
                    this.teams = teamData;
                    this.players = playerData;
                    this.managers = managerData;
                    this.matches = matchData;
                })
            ).subscribe({
                next: () => {

                },
                error: (err) => {
                    console.error(err);
                },
                complete: () => {
                    this.loading = false;
                    allData$.unsubscribe();
                }
            })
    }

}
