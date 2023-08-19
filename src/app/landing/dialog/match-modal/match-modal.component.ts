import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatchViewDTO } from '../../model/match.model';
import { TeamViewDTO } from '../../model/team.model';
import { StadiumViewDTO } from '../../model/stadium.model';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: ['./match-modal.component.scss']
})
export class MatchModalComponent {

  @Input() matchTarget: MatchViewDTO;
  @Input() allTeams: TeamViewDTO[];
  @Input() allStadiums: StadiumViewDTO[];

  @Output() matchResponse: EventEmitter<MatchViewDTO> = new EventEmitter();
  @Output() errorMatchForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public matchForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.matchTarget);
    console.log(this.allTeams)
    
    this._initForm(this.matchTarget);
    this.matchForm.valueChanges.subscribe(
      (data) => {
        this.matchResponse.emit(data);
      }
    );
  }

  private _initForm(match: MatchViewDTO){
    console.log(match);
    this.matchForm = this._fb.group({
      'season' : new FormControl((match) ? match.season : null, [Validators.required]),
      'datetime' : new FormControl((match) ? match.datetime : null, [Validators.required]),
      'attendance' : new FormControl((match) ? match.attendance : null, [Validators.required]),
      'homeTeamScore' : new FormControl((match) ? match.homeTeamScore : null, [Validators.required]),
      'awayTeamScore' : new FormControl((match) ? match.awayTeamScore : null, [Validators.required]),
      'penalityShootOut' : new FormControl((match) ? match.penalityShootOut : null, [Validators.required]),
      'homeTeam' : new FormControl((match) ? match.homeTeam : null, [Validators.required]),
      'awayTeam' : new FormControl((match) ? match.awayTeam : null, [Validators.required]),
      'stadiumId' : new FormControl((match) ? match.stadiumId : null, [Validators.required])
    });

    this.errorMatchForm.emit(this.matchForm);
  }

}
