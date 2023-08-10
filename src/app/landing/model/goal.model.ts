export interface GoalViewDTO {

    id: string,
    minute: number,
    description: string,
    playerId: string,
    assist: string,
    matchId: string

}

export interface GoalCreationDTO {

    minute: number,
    description: string,
    playerId: string,
    assist: string,
    matchId: string
    
}

export interface GoalUpdateDTO {

    minute: number,
    description: string,
    playerId: string,
    assist: string,
    matchId: string
    
}