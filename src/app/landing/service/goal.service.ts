import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { GoalViewDTO, GoalCreationDTO, GoalUpdateDTO } from "../model/goal.model";

@Injectable({
    providedIn:'root'
})
export class GoalService{

    url: string = environment.serverURL + "public/goal/";

    constructor(private _http: HttpClient) {}

    public getAllGoals() {
        return this._http.get<GoalViewDTO[]>(this.url + "all");
    }

    public getAllGoalsByPlayerId(playerId: string) {
        return this._http.get<GoalViewDTO[]>(this.url + "allByPlayerId/" + playerId);
    }

    public getAllGoalsByAssist(assist: string) {
        return this._http.get<GoalViewDTO[]>(this.url + "allByAssist/" + assist);
    }

    public getAllGoalsByMatchId(matchId: string) {
        return this._http.get<GoalViewDTO[]>(this.url + "allByStadiumId/" + matchId);
    }

    public getSpecificGoal(id: number) {
        return this._http.get(this.url + id);
    }

    public createGoal(dto: GoalCreationDTO, id: number) {
        return this._http.post(this.url + "create", dto);
    }

    public updateGoal(dto: GoalUpdateDTO, id: number) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeGoal(id: number) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}