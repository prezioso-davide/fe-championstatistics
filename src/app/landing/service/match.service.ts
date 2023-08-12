import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { MatchViewDTO, MatchCreationDTO, MatchUpdateDTO } from "../model/match.model";

@Injectable({
    providedIn:'root'
})
export class MatchService{

    url: string = environment.serverURL + "public/match/";

    constructor(private _http: HttpClient) {}

    public getAllMatches() {
        return this._http.get<MatchViewDTO[]>(this.url + "all");
    }

    public getAllMatchesBySeason(season: string) {
        return this._http.get<MatchViewDTO[]>(this.url + "allBySeason/" + season);
    }

    public getAllMatchesByHomeTeam(homeTeam: string) {
        return this._http.get<MatchViewDTO[]>(this.url + "allByHomeTeam/" + homeTeam);
    }

    public getAllMatchesByAwayTeam(awayTeam: string) {
        return this._http.get<MatchViewDTO[]>(this.url + "allByAwayTeam/" + awayTeam);
    }

    public getAllMatchesByStadiumId(stadiumId: string) {
        return this._http.get<MatchViewDTO[]>(this.url + "allByStadiumId/" + stadiumId);
    }

    public getSpecificMatch(id: number) {
        return this._http.get(this.url + id);
    }

    public createMatch(dto: MatchCreationDTO, id: number) {
        return this._http.post(this.url + "create", dto);
    }

    public updateMatch(dto: MatchUpdateDTO, id: number) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeMatch(id: number) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}