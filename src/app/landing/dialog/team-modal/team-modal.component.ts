import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamViewDTO } from '../../model/team.model';
import { StadiumService } from '../../service/stadium.service';
import { Subscription } from 'rxjs';
import { StadiumViewDTO } from '../../model/stadium.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.scss']
})
export class TeamModalComponent {

  @Input() teamTarget: TeamViewDTO;
  @Input() allStadiums: StadiumViewDTO[];

  @Output() teamResponse: EventEmitter<TeamViewDTO> = new EventEmitter();
  @Output() errorTeamForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public teamForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.teamTarget);
    console.log(this.allStadiums)
    
    this._initForm(this.teamTarget);
    this.teamForm.valueChanges.subscribe(
      (data) => {
        this.teamResponse.emit(data);
      }
    );
  }

  private _initForm(team: TeamViewDTO){
    console.log(team);
    this.teamForm = this._fb.group({
      'teamName' : new FormControl((team) ? team.teamName : null, [Validators.required]),
      'country' : new FormControl((team) ? team.country : null, [Validators.required]),
      'stadiumId' : new FormControl((team) ? team.stadiumId : null, [Validators.required])
    });

    this.errorTeamForm.emit(this.teamForm);
  }

}
