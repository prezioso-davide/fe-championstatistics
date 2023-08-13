import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { StadiumCreationDTO, StadiumUpdateDTO, StadiumViewDTO } from "../model/stadium.model";

@Injectable({
    providedIn: 'root',
})
export class StadiumService {

    url: string = environment.serverURL + "public/stadium/";

    constructor(private _http: HttpClient) {}

    public getAllStadiums() {
        return this._http.get<StadiumViewDTO[]>(this.url + "all");
    }

    public getAllStadiumsByCountry(country: string) {
        return this._http.get<StadiumViewDTO[]>(this.url + "allByCountry/" + country);
    }

    public getSpecificStadium(id: string) {
        return this._http.get(this.url + id);
    }

    public createStadium(dto: StadiumCreationDTO) {
        return this._http.post(this.url + "create", dto);
    }

    public updateStadium(dto: StadiumUpdateDTO, id: string) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeStadium(id: string) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}