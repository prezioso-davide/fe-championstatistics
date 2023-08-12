import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ManagerViewDTO, ManagerCreationDTO, ManagerUpdateDTO } from "../model/manager.model";

@Injectable({
    providedIn:'root'
})
export class ManagerService {

    url: string = environment.serverURL + "public/manager/";

    constructor(private _http: HttpClient) {}

    public getAllManagers() {
        return this._http.get<ManagerViewDTO[]>(this.url + "all");
    }

    public getAllManagersByNationality(nationality: string) {
        return this._http.get<ManagerViewDTO[]>(this.url + "allByNationality/" + nationality);
    }

    public getAllManagersByTeamId(teamId: string) {
        return this._http.get<ManagerViewDTO[]>(this.url + "allByTeamId/" + teamId);
    }

    public getSpecificManager(id: number) {
        return this._http.get(this.url + id);
    }

    public createManager(dto: ManagerCreationDTO, id: number) {
        return this._http.post(this.url + "create", dto);
    }

    public updateManager(dto: ManagerUpdateDTO, id: number) {
        return this._http.put(this.url + "update/"+ id, dto);
    }

    public removeManager(id: number) {
        return this._http.delete(this.url + "delete/"+ id);
    }

}