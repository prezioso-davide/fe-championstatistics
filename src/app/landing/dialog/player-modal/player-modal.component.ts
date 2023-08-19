import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PlayerViewDTO } from '../../model/player.model';
import { TeamViewDTO } from '../../model/team.model';

@Component({
  selector: 'app-player-modal',
  templateUrl: './player-modal.component.html',
  styleUrls: ['./player-modal.component.scss']
})
export class PlayerModalComponent {

  @Input() playerTarget: PlayerViewDTO;
  @Input() allTeams: TeamViewDTO[];

  @Output() playerResponse: EventEmitter<PlayerViewDTO> = new EventEmitter();
  @Output() errorPlayerForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public playerForm: FormGroup;

  public footTypes: string[] = [
    "R",
    "L",
    "Ambidestro"
  ]

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.playerTarget);
    console.log(this.allTeams)
    
    this._initForm(this.playerTarget);
    this.playerForm.valueChanges.subscribe(
      (data) => {
        this.playerResponse.emit(data);
      }
    );
  }

  private _initForm(player: PlayerViewDTO){
    console.log(player);
    this.playerForm = this._fb.group({
      'firstName' : new FormControl((player) ? player.firstName : null),
      'lastName' : new FormControl((player) ? player.lastName : null, [Validators.required]),
      'nationality' : new FormControl((player) ? player.nationality : null, [Validators.required]),
      'birthday' : new FormControl((player) ? player.birthday : null, [Validators.required]),
      'jerseyNumber' : new FormControl((player) ? player.jerseyNumber : null, [Validators.required]),
      'position' : new FormControl((player) ? player.position : null, [Validators.required]),
      'height' : new FormControl((player) ? player.height : null, [Validators.required]),
      'weight' : new FormControl((player) ? player.weight : null, [Validators.required]),
      'foot' : new FormControl((player) ? player.foot : null, [Validators.required]),
      'teamId' : new FormControl((player) ? player.teamId : null, [Validators.required])
    });

    this.errorPlayerForm.emit(this.playerForm);
  }

  onInputJersey(event) {
    if (event.value === null) {
      this.playerForm.get('jerseyNumber').setValue(event.value);

      if (!this.playerForm.get('jerseyNumber').value) {
        this.playerForm.get('jerseyNumber').markAsDirty();
      }
    } else if (event.value.toString().length <= 2) {
      this.playerForm.get('jerseyNumber').setValue(event.value);
    }
  }

  onInputHeight(event) {
    if (event.value === null) {
      this.playerForm.get('height').setValue(event.value);

      if (!this.playerForm.get('height').value) {
        this.playerForm.get('height').markAsDirty();
      }
    } else if (event.value.toString().length <= 4) {
      this.playerForm.get('height').setValue(event.value);
    }
  }

  onInputWeight(event) {
    if (event.value === null) {
      this.playerForm.get('weight').setValue(event.value);

      if (!this.playerForm.get('weight').value) {
        this.playerForm.get('weight').markAsDirty();
      }
    } else if (event.value.toString().length <= 3) {
      this.playerForm.get('weight').setValue(event.value);
    }
  }

}
