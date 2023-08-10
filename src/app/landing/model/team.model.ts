export interface TeamViewDTO {

    id: string,
    teamName: string,
    country: string,
    stadiumId: string,
    stadiumName: string
    
}

export interface TeamCreationDTO {

    teamName: string,
    country: string,
    stadiumId: string
    
}

export interface TeamUpdateDTO {

    teamName: string,
    country: string,
    stadiumId: string
    
}