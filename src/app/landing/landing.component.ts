import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StadiumService } from './service/stadium.service';
import { StadiumViewDTO } from './model/stadium.model';
import { forkJoin, tap } from 'rxjs';
import { TeamService } from './service/team.service';
import { TeamViewDTO } from './model/team.model';
import { cl } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit{

    public stadiums: StadiumViewDTO[] = [];
    public teams: TeamViewDTO[] = [];
    public loading: boolean = false;

    constructor(
        public router: Router,
        private _stadiumService: StadiumService,
        private _teamService: TeamService
    ) {}

    ngOnInit(): void {
        this._getAllData();
    }

    private _getAllData() {
        this.loading = true;

        const stadiumData$ = this._stadiumService.getAllStadiums();
        const teamData$ = this._teamService.getAllTeams();

        const allData$ = forkJoin([stadiumData$, teamData$])
            .pipe(
                tap(([stadiumData, teamData]) => {
                    this.stadiums = stadiumData;
                    this.teams = teamData;
                })
            ).subscribe({
                next: () => {
                    console.log(this.stadiums);
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
