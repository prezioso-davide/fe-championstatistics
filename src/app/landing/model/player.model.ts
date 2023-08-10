export interface PlayerViewDTO {

    id: string,
    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    jerseyNumber: number,
    position: string,
    height: number,
    weight: number,
    foot: string,
    teamId: string

}

export interface PlayerCreationDTO {

    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    jerseyNumber: number,
    position: string,
    height: number,
    weight: number,
    foot: string,
    teamId: string
    
}

export interface PlayerUpdateDTO {

    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    jerseyNumber: number,
    position: string,
    height: number,
    weight: number,
    foot: string,
    teamId: string
    
}