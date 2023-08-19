import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ManagerViewDTO } from '../../model/manager.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamViewDTO } from '../../model/team.model';

@Component({
  selector: 'app-manager-modal',
  templateUrl: './manager-modal.component.html',
  styleUrls: ['./manager-modal.component.scss']
})
export class ManagerModalComponent {

  @Input() managerTarget: ManagerViewDTO;
  @Input() allTeams: TeamViewDTO[];

  @Output() managerResponse: EventEmitter<ManagerViewDTO> = new EventEmitter();
  @Output() errorManagerForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public managerForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
  ) {}

  ngOnInit() {
    console.log(this.managerTarget);
    console.log(this.allTeams)
    
    this._initForm(this.managerTarget);
    this.managerForm.valueChanges.subscribe(
      (data) => {
        this.managerResponse.emit(data);
      }
    );
  }

  private _initForm(manager: ManagerViewDTO){
    console.log(manager);
    this.managerForm = this._fb.group({
      'firstName' : new FormControl((manager) ? manager.firstName : null, [Validators.required]),
      'lastName' : new FormControl((manager) ? manager.lastName : null, [Validators.required]),
      'nationality' : new FormControl((manager) ? manager.nationality : null, [Validators.required]),
      'birthday' : new FormControl((manager) ? manager.birthday : null, [Validators.required]),
      'teamId' : new FormControl((manager) ? manager.teamId : null, [Validators.required])
    });

    this.errorManagerForm.emit(this.managerForm);
  }

}
