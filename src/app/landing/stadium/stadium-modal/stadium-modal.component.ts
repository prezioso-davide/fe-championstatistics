import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { StadiumViewDTO } from '../../model/stadium.model';

@Component({
  selector: 'app-stadium-modal',
  templateUrl: './stadium-modal.component.html',
  styleUrls: ['./stadium-modal.component.scss']
})
export class StadiumModalComponent {

  @Input() stadiumTarget: StadiumViewDTO;

  @Output() stadiumResponse: EventEmitter<StadiumViewDTO> = new EventEmitter();
  @Output() errorStadiumForm: EventEmitter<FormGroup> = new EventEmitter();
  
  public stadiumForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    console.log(this.stadiumTarget);
    this._initForm(this.stadiumTarget);
    this.stadiumForm.valueChanges.subscribe(
      (data) => {
        this.stadiumResponse.emit(data);
      }
    );
  }

  private _initForm(stadium: StadiumViewDTO){
    console.log(stadium);
    this.stadiumForm = this._fb.group({
      'stadiumName' : new FormControl((stadium) ? stadium.stadiumName : null, [Validators.required]),
      'city' : new FormControl((stadium) ? stadium.city : null, [Validators.required]),
      'country' : new FormControl((stadium) ? stadium.country : null, [Validators.required]),
      'capacity' : new FormControl((stadium) ? stadium.capacity : null, [Validators.required]),
      'latitude' : new FormControl((stadium) ? stadium.latitude : null, [Validators.required]),
      'longitude' : new FormControl((stadium) ? stadium.longitude : null, [Validators.required])
    });

    this.errorStadiumForm.emit(this.stadiumForm);
  }

  onInputLatitude(event) {
    if (event.value === null) {
      this.stadiumForm.get('latitude').setValue(event.value);

      if (!this.stadiumForm.get('latitude').value) {
        this.stadiumForm.get('latitude').markAsDirty();
      }
    } else if (event.value.toString().length <= 7) {
      this.stadiumForm.get('latitude').setValue(event.value);
    }
  }
  onInputLongitude(event) {
    if (event.value === null) {
      this.stadiumForm.get('longitude').setValue(event.value);

      if (!this.stadiumForm.get('longitude').value) {
        this.stadiumForm.get('longitude').markAsDirty();
      }
    } else if (event.value.toString().length <= 7) {
      this.stadiumForm.get('longitude').setValue(event.value);
    }
  }

}
