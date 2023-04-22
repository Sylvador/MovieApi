import {FindAllMovieDto} from "../../movie/dto/findAll-movie.dto";
import {Person} from "../models/person.model";

export class FindOnePersonDto {
    id: number;
    name: string;
    enName: string;
    photo: string;
    movies: FindAllMovieDto[];

    constructor(person: Person) {
        this.id = person.id;
        this.name = person.name;
        this.enName = person.enName;
        this.photo = person.photo;
        this.movies = person.movies.map((movie) => new FindAllMovieDto(movie));
    }
}