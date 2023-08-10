export interface MatchViewDTO {

    id: string,
    season: string,
    datetime: string,
    attendance: number,
    homeTeamScore: number,
    awayTeamScore: number,
    penalityShootOut: number,
    homeTeam: string,
    awayTeam: string,
    stadiumId: string

}

export interface MatchCreationDTO {

    season: string,
    datetime: string,
    attendance: number,
    homeTeamScore: number,
    awayTeamScore: number,
    penalityShootOut: number,
    homeTeam: string,
    awayTeam: string,
    stadiumId: string
    
}

export interface MatchUpdateDTO {

    season: string,
    datetime: string,
    attendance: number,
    homeTeamScore: number,
    awayTeamScore: number,
    penalityShootOut: number,
    homeTeam: string,
    awayTeam: string,
    stadiumId: string
    
}