export interface ManagerViewDTO {

    id: string,
    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    teamId: string,
    teamName: string

}

export interface ManagerCreationDTO {

    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    teamId: string
    
}

export interface ManagerUpdateDTO {

    firstName: string,
    lastName: string,
    nationality: string,
    birthday: string,
    teamId: string
    
}