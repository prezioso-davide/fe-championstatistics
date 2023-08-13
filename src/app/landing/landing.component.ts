import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StadiumService } from './service/stadium.service';
import { StadiumCreationDTO, StadiumUpdateDTO, StadiumViewDTO } from './model/stadium.model';
import { Subscription, forkJoin, switchMap, tap } from 'rxjs';
import { TeamService } from './service/team.service';
import { TeamCreationDTO, TeamUpdateDTO, TeamViewDTO } from './model/team.model';
import { ManagerCreationDTO, ManagerUpdateDTO, ManagerViewDTO } from './model/manager.model';
import { PlayerCreationDTO, PlayerUpdateDTO, PlayerViewDTO } from './model/player.model';
import { MatchCreationDTO, MatchUpdateDTO, MatchViewDTO } from './model/match.model';
import { GoalCreationDTO, GoalUpdateDTO, GoalViewDTO } from './model/goal.model';
import { PlayerService } from './service/player.service';
import { ManagerService } from './service/manager.service';
import { MatchService } from './service/match.service';
import { GoalService } from './service/goal.service';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent implements OnInit, OnDestroy{

    public stadiums: StadiumViewDTO[] = [];
    public stadium: StadiumViewDTO;
    public stadiumId: string;
    public stadiumCreation: StadiumCreationDTO;
    public stadiumUpdate: StadiumUpdateDTO;
    private _stadiumForm: FormGroup;

    public teams: TeamViewDTO[] = [];
    public team: TeamViewDTO;
    public teamId: string;
    public teamCreation: TeamCreationDTO;
    public teamUpdate: TeamUpdateDTO;

    public managers: ManagerViewDTO[] = [];
    public manager: ManagerViewDTO;
    public managerId: string;
    public managerCreation: ManagerCreationDTO;
    public managerUpdate: ManagerUpdateDTO;

    public players: PlayerViewDTO[] = [];
    public player: PlayerViewDTO;
    public playerId: string;
    public playerCreation: PlayerCreationDTO;
    public playerUpdate: PlayerUpdateDTO;

    public matches: MatchViewDTO[] = [];
    public match: MatchViewDTO;
    public matchId: string;
    public matchCreation: MatchCreationDTO;
    public matchUpdate: MatchUpdateDTO;

    public goal: GoalViewDTO;
    public goalId: string;
    public goalCreation: GoalCreationDTO;
    public goalUpdate: GoalUpdateDTO;

    public stadiumOpenModal: boolean = false;
    public teamOpenModal: boolean = false;
    public managerOpenModal: boolean = false;
    public matchOpenModal: boolean = false;
    public playerOpenModal: boolean = false;
    public goalOpenModal: boolean = false;

    public loading: boolean = false;
    public isEdit: boolean = false;

    private _subscriptions: Subscription = new Subscription;

    constructor(
        public router: Router,
        private _stadiumService: StadiumService,
        private _teamService: TeamService,
        private _playerService: PlayerService,
        private _managerService: ManagerService,
        private _matchService: MatchService,
        private _goalService: GoalService,
        private _messageService: MessageService,
        private _confirmationService: ConfirmationService
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
                    this._subscriptions.add(allData$);
                }
            })
        
    }

    public showStadiumDialog(stadium: null | StadiumViewDTO) {
        this.stadiumOpenModal = true;

        if(stadium !== null) {
            console.log(stadium);
            this.isEdit = true;
            this.stadium = stadium;
            this.stadiumId = stadium.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorStadiumForm(form: FormGroup) {
        this._stadiumForm = form;
    }

    handleStadium(event) {
        this.isEdit ? this.stadiumUpdate = event : this.stadiumCreation = event ;
    }

    submitStadium() {
        if(this._stadiumForm.pristine || this._stadiumForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._stadiumForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.stadiumOpenModal = false;
            if(!this.isEdit) {
                const createStadium$ = this._stadiumService.createStadium(this.stadiumCreation)
                    .pipe(
                        tap((data: StadiumViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Stadio', 
                                detail: 'Creazione dello stadio ' + data.stadiumName + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._stadiumService.getAllStadiums()),
                        tap((data: StadiumViewDTO[]) => {
                            this.stadiums = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearStadiumData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Stadio', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createStadium$);
                        }
                    });
            } else {
                const updateStadium$ = this._stadiumService.updateStadium(this.stadiumUpdate, this.stadiumId)
                    .pipe(
                        tap((data: StadiumViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Stadio',
                                detail: 'Modifica dello stadio ' + data.stadiumName + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._stadiumService.getAllStadiums()),
                        tap((data: StadiumViewDTO[]) => {
                            this.stadiums = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearStadiumData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Stadio',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updateStadium$);
                        }
                    });
            }
        }
    }

    public deleteStadium(stadium: StadiumViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare ' + stadium.stadiumName.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              this._stadiumService.removeStadium(stadium.id)
              .pipe(
                tap((data: StadiumViewDTO) => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Stadio',
                        detail: 'Cancellazione dello stadio avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => this._stadiumService.getAllStadiums()),
                tap((data: StadiumViewDTO[]) => {
                    this.stadiums = data;
                })
              )
              .subscribe({
                next: () => {
                    
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Stadio',
                        detail: 'Procedimento non andato a buon fine.',
                        life: 3000
                    });
                },
                complete: () => {
                    this.loading = false;
                }
              });
            }
          });
    }

    public hideDialog(type: string) {
        switch (type) {
            case "stadium":
                this._clearStadiumData();
                break;

            case "team":
                this._clearTeamData();
                break;

            case "manager":
                this._clearManagerData();
                break;

            case "player":
                this._clearPlayerData();
                break;

            case "match":
                this._clearMatchData();
                break;

            case "goal":
                this._clearGoalData();
                break;

            default:
                break;
        }
        
        this.isEdit = false;
    }

    private _clearStadiumData() {
        this.stadiumOpenModal = false;
        this.stadium = null;
        this.stadiumId = null;
        this.stadiumCreation = null;
        this.stadiumUpdate = null;
        this._stadiumForm = null;
    }

    private _clearTeamData() {
        this.teamOpenModal = false;
        this.team = null;
        this.teamId = null;
        this.teamCreation = null;
        this.teamUpdate = null;
    }

    private _clearManagerData() {
        this.managerOpenModal = false;
        this.manager = null;
        this.managerId = null;
        this.managerCreation = null;
        this.managerUpdate = null;
    }

    private _clearPlayerData() {
        this.playerOpenModal = false;
        this.player = null;
        this.playerId = null;
        this.playerCreation = null;
        this.playerUpdate = null;
    }

    private _clearMatchData() {
        this.matchOpenModal = false;
        this.match = null;
        this.matchId = null;
        this.matchCreation = null;
        this.matchUpdate = null;
    }

    private _clearGoalData() {
        this.goalOpenModal = false;
        this.goal = null;
        this.goalId = null;
        this.goalCreation = null;
        this.goalUpdate = null;
    }

    private _markAllControlsAsDirty(form: FormGroup) {
        if (form === undefined) {
          return
        }
        Object.keys(form.controls).forEach(key => {
          form.get(key).markAsDirty();
        });
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }

}
