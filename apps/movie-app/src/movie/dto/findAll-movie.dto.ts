import {Movie} from "../models/movie.model";

export class FindAllMovieDto {
    id?: number;
    name?: string;
    enName?: string;
    type?: string;
    poster?: string;

    constructor(movie: Movie) {
        this.id = movie.movieId;
        this.name = movie.name;
        this.enName = movie.enName;
        this.type = movie.type;
        this.poster = movie.poster;
    }
}