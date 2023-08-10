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

    public getAllTeamsByStadiumId(stadiumId: number) {
        return this._http.get<TeamViewDTO[]>(this.url + "allByStadiumId/" + stadiumId);
    }

    public getSpecificTeam(id: number) {
        return this._http.get(this.url + id);
    }

    public createTeam(dto: TeamCreationDTO, id: number) {
        return this._http.post(this.url + "create", dto);
    }

    public updateTeam(dto: TeamUpdateDTO, id: number) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeTeam(id: number) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}