export interface StadiumViewDTO {

    id: string,
    stadiumName: string,
    city: string,
    country: string,
    capacity: number,
    latitude: number,
    longitude: number

}

export interface StadiumCreationDTO {
    
    stadiumName: string,
    city: string,
    country: string,
    capacity: number,
    latitude: number,
    longitude: number

}

export interface StadiumUpdateDTO {

    stadiumName: string,
    city: string,
    country: string,
    capacity: number,
    latitude: number,
    longitude: number
    
}