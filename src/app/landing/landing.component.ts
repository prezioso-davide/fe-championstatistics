import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StadiumService } from './service/stadium.service';
import { StadiumCreationDTO, StadiumUpdateDTO, StadiumViewDTO } from './model/stadium.model';
import { Subscription, forkJoin, map, switchMap, tap } from 'rxjs';
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
import { Data } from '../utilities/constant.data';
import { MapComponent } from './map/map.component';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styles: [`#scroll-top {position: fixed; bottom: 20px; right: 20px; z-index: 9999}`]
})
export class LandingComponent implements OnInit, OnDestroy{

    @ViewChild(MapComponent) mapComponent: MapComponent;

    public countries: any[] = Data.COUNTRIES;
    public previouslySelectedCountries: any[] = [];
    public selectedCountries: any[];

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
    private _teamForm: FormGroup;

    public managers: ManagerViewDTO[] = [];
    public manager: ManagerViewDTO;
    public managerId: string;
    public managerCreation: ManagerCreationDTO;
    public managerUpdate: ManagerUpdateDTO;
    private _managerForm: FormGroup;

    public players: PlayerViewDTO[] = [];
    public player: PlayerViewDTO;
    public playerId: string;
    public playerCreation: PlayerCreationDTO;
    public playerUpdate: PlayerUpdateDTO;
    private _playerForm: FormGroup;

    public matches: MatchViewDTO[] = [];
    public match: MatchViewDTO;
    public matchId: string;
    public matchCreation: MatchCreationDTO;
    public matchUpdate: MatchUpdateDTO;
    private _matchForm: FormGroup;

    public goal: GoalViewDTO;
    public goalId: string;
    public goalCreation: GoalCreationDTO;
    public goalUpdate: GoalUpdateDTO;
    private _goalForm: FormGroup;

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

    public getInfo(event) {
        console.log(event);

        const selectedCountries = event.value.map(country => country.name);
        const deselectedCountries = this.previouslySelectedCountries.filter(country => !selectedCountries.includes(country));

        deselectedCountries.forEach(country => {
            if (this.mapComponent) {
                this.mapComponent.clearStadiumMarkers(country); 
            }
        });

        this.previouslySelectedCountries = selectedCountries;

        event.value.forEach(country => {
            const name = country.name;

            this._stadiumService.getAllStadiumsByCountry(name)
                .subscribe({
                    next: (data) => {
                        if (this.mapComponent) {
                            this.mapComponent.addStadiumMarkers(name, data); 
                        }
                    },
                    error: (err) => {

                    },
                    complete: () => {

                    }
                });
            
        });
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
                tap(() => {
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

    public showTeamDialog(team: null | TeamViewDTO) {
        this.teamOpenModal = true;

        if(team !== null) {
            this.isEdit = true;
            this.team = team;
            this.teamId = team.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorTeamForm(form: FormGroup) {
        this._teamForm = form;
    }

    handleTeam(event) {
        this.isEdit ? this.teamUpdate = event : this.teamCreation = event ;
    }

    submitTeam() {
        if(this._teamForm.pristine || this._teamForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._teamForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.teamOpenModal = false;
            if(!this.isEdit) {
                const createTeam$ = this._teamService.createTeam(this.teamCreation)
                    .pipe(
                        tap((data: TeamViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Squadra', 
                                detail: 'Creazione della squadra ' + data.teamName + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._teamService.getAllTeams()),
                        tap((data: TeamViewDTO[]) => {
                            this.teams = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearTeamData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Squadra', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createTeam$);
                        }
                    });
            } else {
                const updateTeam$ = this._teamService.updateTeam(this.teamUpdate, this.teamId)
                    .pipe(
                        tap((data: TeamViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Squadra',
                                detail: 'Modifica della squadra ' + data.teamName + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._teamService.getAllTeams()),
                        tap((data: TeamViewDTO[]) => {
                            this.teams = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearTeamData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Squadra',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updateTeam$);
                        }
                    });
            }
        }
    }

    public deleteTeam(team: TeamViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare ' + team.teamName.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              this._teamService.removeTeam(team.id)
              .pipe(
                tap(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Squadra',
                        detail: 'Cancellazione della squadra avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => this._teamService.getAllTeams()),
                tap((data: TeamViewDTO[]) => {
                    this.teams = data;
                })
              )
              .subscribe({
                next: () => {
                    
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Squadra',
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

    public showPlayerDialog(player: null | PlayerViewDTO) {
        this.playerOpenModal = true;

        if(player !== null) {
            this.isEdit = true;
            this.player = player;
            this.playerId = player.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorPlayerForm(form: FormGroup) {
        this._playerForm = form;
    }

    handlePlayer(event) {
        this.isEdit ? this.playerUpdate = event : this.playerCreation = event ;
    }

    submitPlayer() {
        if(this._playerForm.pristine || this._playerForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._playerForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.playerOpenModal = false;
            if(!this.isEdit) {
                const createPlayer$ = this._playerService.createPlayer(this.playerCreation)
                    .pipe(
                        tap((data: PlayerViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Giocatore', 
                                detail: 'Creazione del giocatore ' + data.firstName + ' ' + data.lastName + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._playerService.getAllPlayers()),
                        tap((data: PlayerViewDTO[]) => {
                            this.players = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearPlayerData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Giocatore', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createPlayer$);
                        }
                    });
            } else {
                const updatePlayer$ = this._playerService.updatePlayer(this.playerUpdate, this.playerId)
                    .pipe(
                        tap((data: PlayerViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Giocatore',
                                detail: 'Modifica del giocatore ' + data.firstName + ' ' + data.lastName + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._playerService.getAllPlayers()),
                        tap((data: PlayerViewDTO[]) => {
                            this.players = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearPlayerData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Giocatore',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updatePlayer$);
                        }
                    });
            }
        }
    }

    public deletePlayer(player: PlayerViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare ' + player.firstName.toUpperCase() + ' ' + player.lastName.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              this._playerService.removePlayer(player.id)
              .pipe(
                tap(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Giocatore',
                        detail: 'Cancellazione del giocatore avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => this._playerService.getAllPlayers()),
                tap((data: PlayerViewDTO[]) => {
                    this.players = data;
                })
              )
              .subscribe({
                next: () => {
                    
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Giocatore',
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

    public showManagerDialog(manager: null | ManagerViewDTO) {
        this.managerOpenModal = true;

        if(manager !== null) {
            this.isEdit = true;
            this.manager = manager;
            this.managerId = manager.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorManagerForm(form: FormGroup) {
        this._managerForm = form;
    }

    handleManager(event) {
        this.isEdit ? this.managerUpdate = event : this.managerCreation = event ;
    }

    submitManager() {
        if(this._managerForm.pristine || this._managerForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._managerForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.managerOpenModal = false;
            console.log(this.managerCreation);
            if(!this.isEdit) {
                const createManager$ = this._managerService.createManager(this.managerCreation)
                    .pipe(
                        tap((data: ManagerViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Allenatore', 
                                detail: 'Creazione dell\'allenatore ' + data.firstName + ' ' + data.lastName + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._managerService.getAllManagers()),
                        tap((data: ManagerViewDTO[]) => {
                            this.managers = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearManagerData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Allenatore', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createManager$);
                        }
                    });
            } else {
                const updateManager$ = this._managerService.updateManager(this.managerUpdate, this.managerId)
                    .pipe(
                        tap((data: ManagerViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Allenatore',
                                detail: 'Modifica dell\'allenatore ' + data.firstName + ' ' + data.lastName + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._managerService.getAllManagers()),
                        tap((data: ManagerViewDTO[]) => {
                            this.managers = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearManagerData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Allenatore',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updateManager$);
                        }
                    });
            }
        }
    }

    public deleteManager(manager: ManagerViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare ' + manager.firstName.toUpperCase() + ' ' + manager.lastName.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              this._managerService.removeManager(manager.id)
              .pipe(
                tap(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Allenatore',
                        detail: 'Cancellazione dell\'allenatore avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => this._managerService.getAllManagers()),
                tap((data: ManagerViewDTO[]) => {
                    this.managers = data;
                })
              )
              .subscribe({
                next: () => {
                    
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Allenatore',
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

    public showMatchDialog(match: null | MatchViewDTO) {
        this.matchOpenModal = true;

        if(match !== null) {
            this.isEdit = true;
            this.match = match;
            this.matchId = match.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorMatchForm(form: FormGroup) {
        this._matchForm = form;
    }

    handleMatch(event) {
        this.isEdit ? this.matchUpdate = event : this.matchCreation = event;
    }

    submitMatch() {
        if(this._matchForm.pristine || this._matchForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._matchForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.matchOpenModal = false;
            if(!this.isEdit) {
                const createMatch$ = this._matchService.createMatch(this.matchCreation)
                    .pipe(
                        tap((data: MatchViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Partita', 
                                detail: 'Creazione della partita ' + data.homeTeamName + ' - ' + data.awayTeamName + ', del ' + data.datetime + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._matchService.getAllMatches()),
                        tap((data: MatchViewDTO[]) => {
                            this.matches = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearMatchData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Partita', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createMatch$);
                        }
                    });
            } else {
                const updateMatch$ = this._matchService.updateMatch(this.matchUpdate, this.matchId)
                    .pipe(
                        tap((data: MatchViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Partita',
                                detail: 'Modifica della partita ' + data.homeTeamName + ' - ' + data.awayTeamName + ', del ' + data.datetime + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._matchService.getAllMatches()),
                        tap((data: MatchViewDTO[]) => {
                            this.matches = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearMatchData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Partita',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updateMatch$);
                        }
                    });
            }
        }
    }

    public deleteMatch(match: MatchViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare ' + match.homeTeamName.toUpperCase() + ' - ' + match.awayTeamName.toUpperCase() + ', del ' + match.datetime.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              const goals$ = this._goalService.getAllGoalsByMatchId(match.id);
              const match$ = this._matchService.removeMatch(match.id);

              const result$ = goals$
              .pipe(
                switchMap((data: GoalViewDTO[]) => {
                    const deleteGoals$ = data.map(el => this._goalService.removeGoal(el.id));
                    return forkJoin(deleteGoals$);
                }),
                tap(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Rete',
                        detail: 'Cancellazione delle reti avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => {
                    return match$;
                }),
                switchMap(() => this._matchService.getAllMatches()),
                tap((data: MatchViewDTO[]) => {
                    this.matches = data;
                })
              )
              
              result$.subscribe({
                next: () => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Partita',
                        detail: 'Cancellazione della partita avvenuta con successo.',
                        life: 5000
                    });
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Partita',
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

    selectedMatch(match: MatchViewDTO) {
        this.match = match;
    }

    public showGoalDialog(goal: null | GoalViewDTO) {
        this.goalOpenModal = true;

        if(goal !== null) {
            this.isEdit = true;
            this.goal = goal;
            this.goalId = goal.id;
        } else {
            this.isEdit = false;
        }

    }

    checkErrorGoalForm(form: FormGroup) {
        this._goalForm = form;
    }

    handleGoal(event) {
        this.isEdit ? this.goalUpdate = event : this.goalCreation = event ;
    }

    submitGoal() {
        if(this._goalForm.pristine || this._goalForm.invalid) {
            console.log("invalid");
            this._markAllControlsAsDirty(this._goalForm);
        } else {
            console.log("ok");
            this.loading = true;
            this.goalOpenModal = false;
            if(!this.isEdit) {
                const createGoal$ = this._goalService.createGoal(this.goalCreation)
                    .pipe(
                        tap((data: GoalViewDTO) => {
                            this._messageService.add({ 
                                severity: 'success', 
                                summary: 'Creazione Rete', 
                                detail: 'Creazione della rete ' + data.minute + ' - ' + data.playerFullName + ', avvenuta con successo.', 
                                life: 5000 
                            });
                        }),
                        switchMap(() => this._matchService.getAllMatches()),
                        tap((data: MatchViewDTO[]) => {
                            this.matches = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearGoalData();
                        },
                        error: (err) => {
                            this._messageService.add({ 
                                severity: 'error', 
                                summary: 'Creazione Rete', 
                                detail: 'Procedimento non andato a buon fine.', 
                                life: 3000 
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(createGoal$);
                        }
                    });
            } else {
                const updateGoal$ = this._goalService.updateGoal(this.goalUpdate, this.goalId)
                    .pipe(
                        tap((data: GoalViewDTO) => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Modifica Rete',
                                detail: 'Modifica della rete ' + data.minute + ' - ' + data.playerFullName + ', avvenuta con successo.',
                                life: 5000
                            });
                        }),
                        switchMap(() => this._matchService.getAllMatches()),
                        tap((data: MatchViewDTO[]) => {
                            this.matches = data;
                        })
                    )
                    .subscribe({
                        next: () => {
                            this._clearGoalData();
                            this.isEdit = false;
                        },
                        error: (err) => {
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Modifica Rete',
                                detail: 'Procedimento non andato a buon fine.',
                                life: 3000
                            });
                        },
                        complete: () => {
                            this.loading = false;
                            this._subscriptions.add(updateGoal$);
                        }
                    });
            }
        }
    }

    public deleteGoal(goal: GoalViewDTO) {
        this._confirmationService.confirm({
            message: 'Sicuro di voler cancellare il goal di ' + goal.playerFullName.toUpperCase() + '?',
            header: 'Conferma',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.loading = true;
              this._goalService.removeGoal(goal.id)
              .pipe(
                tap(() => {
                    this._messageService.add({
                        severity: 'success',
                        summary: 'Cancellazione Rete',
                        detail: 'Cancellazione della rete avvenuta con successo.',
                        life: 5000
                    });
                }),
                switchMap(() => this._matchService.getAllMatches()),
                tap((data: MatchViewDTO[]) => {
                    this.matches = data;
                })
              )
              .subscribe({
                next: () => {
                    
                },
                error: (err) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Cancellazione Rete',
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

    public checkGoals(match: MatchViewDTO): boolean {
        let totGoals = match.homeTeamScore + match.awayTeamScore;
        console.log(totGoals + ' - ' + match.goals.length);
        if(totGoals !== match.goals.length) {
            return false;
        } else {
            return true;
        }
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
        this._teamForm = null;
    }

    private _clearManagerData() {
        this.managerOpenModal = false;
        this.manager = null;
        this.managerId = null;
        this.managerCreation = null;
        this.managerUpdate = null;
        this._managerForm = null;
    }

    private _clearPlayerData() {
        this.playerOpenModal = false;
        this.player = null;
        this.playerId = null;
        this.playerCreation = null;
        this.playerUpdate = null;
        this._playerForm = null;
    }

    private _clearMatchData() {
        this.matchOpenModal = false;
        this.match = null;
        this.matchId = null;
        this.matchCreation = null;
        this.matchUpdate = null;
        this._matchForm = null;
    }

    private _clearGoalData() {
        this.goalOpenModal = false;
        this.goal = null;
        this.goalId = null;
        this.goalCreation = null;
        this.goalUpdate = null;
        this._goalForm = null;
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
