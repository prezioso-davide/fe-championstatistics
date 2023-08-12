import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { PlayerViewDTO, PlayerCreationDTO, PlayerUpdateDTO } from "../model/player.model";

@Injectable({
    providedIn:'root'
})
export class PlayerService{

    url: string = environment.serverURL + "public/player/";

    constructor(private _http: HttpClient) {}

    public getAllPlayers() {
        return this._http.get<PlayerViewDTO[]>(this.url + "all");
    }

    public getAllPlayersByNationality(nationality: string) {
        return this._http.get<PlayerViewDTO[]>(this.url + "allByNationality/" + nationality);
    }

    public getAllPlayersByTeamId(teamId: string) {
        return this._http.get<PlayerViewDTO[]>(this.url + "allByTeamId/" + teamId);
    }

    public getSpecificPlayer(id: number) {
        return this._http.get(this.url + id);
    }

    public createPlayer(dto: PlayerCreationDTO, id: number) {
        return this._http.post(this.url + "create", dto);
    }

    public updatePlayer(dto: PlayerUpdateDTO, id: number) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removePlayer(id: number) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}