import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { TeamViewDTO, TeamCreationDTO, TeamUpdateDTO } from "../model/team.model";

@Injectable({
    providedIn: 'root',
})
export class TeamService {

    url: string = environment.serverURL + "public/team/";

    constructor(private _http: HttpClient) {}

    public getAllTeams() {
        return this._http.get<TeamViewDTO[]>(this.url + "all");
    }

    public getAllTeamsByCountry(country: string) {
        return this._http.get<TeamViewDTO[]>(this.url + "allByCountry/" + country);
    }

    public getAllTeamsByStadiumId(stadiumId: string) {
        return this._http.get<TeamViewDTO[]>(this.url + "allByStadiumId/" + stadiumId);
    }

    public getSpecificTeam(id: string) {
        return this._http.get(this.url + id);
    }

    public createTeam(dto: TeamCreationDTO) {
        return this._http.post(this.url + "create", dto);
    }

    public updateTeam(dto: TeamUpdateDTO, id: string) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeTeam(id: string) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}