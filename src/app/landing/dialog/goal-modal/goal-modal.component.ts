import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GoalViewDTO } from '../../model/goal.model';
import { MatchViewDTO } from '../../model/match.model';
import { PlayerViewDTO } from '../../model/player.model';

@Component({
  selector: 'app-goal-modal',
  templateUrl: './goal-modal.component.html',
  styleUrls: ['./goal-modal.component.scss']
})
export class GoalModalComponent {

  @Input() goalTarget: GoalViewDTO;
  @Input() allPlayers: PlayerViewDTO[];
  @Input() matchTarget: MatchViewDTO;

  @Output() goalResponse: EventEmitter<GoalViewDTO> = new EventEmitter();
  @Output() errorGoalForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public goalForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.goalTarget);
    
    this._initForm(this.goalTarget);
    this.goalForm.valueChanges.subscribe(
      (data) => {
        this.goalResponse.emit(data);
      }
    );
  }

  private _initForm(goal: null | GoalViewDTO){
    console.log(goal);
    this.goalForm = this._fb.group({
      'minute' : new FormControl((goal) ? goal.minute : null, [Validators.required]),
      'description' : new FormControl((goal) ? goal.description : null, [Validators.required]),
      'playerId' : new FormControl((goal) ? goal.playerId : null, [Validators.required]),
      'assist' : new FormControl((goal) ? goal.assist : null),
      'matchId' : new FormControl(this.matchTarget.id, [Validators.required])
    });

    this.errorGoalForm.emit(this.goalForm);
  }

  formatMatchLabel(match: any): string {
    return `${match.datetime} ${match.homeTeamName} - ${match.awayTeamName}`;
  }

  formatPlayerLabel(player: any): string {
    if(player.firstName) {
      return `${player.firstName} ${player.lastName}`;
    } else {
      return `${player.lastName}`;
    }
   
  }


}
