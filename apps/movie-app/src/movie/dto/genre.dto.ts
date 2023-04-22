import {Genre} from "../models/genre.model";

export class GenreDto {
    id: number;
    name: string;


    constructor(genre: Genre) {
        this.id = genre.genreId;
        this.name = genre.name;
    }
}