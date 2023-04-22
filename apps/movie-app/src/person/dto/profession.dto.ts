import {FindAllMovieDto} from "../../movie/dto/findAll-movie.dto";
import {PersonProfession} from "../models/person-profession.model";

export class ProfessionDto {
    id: number;
    name: string;
    movies: FindAllMovieDto[]


    constructor(personProfession: PersonProfession) {
        this.id = personProfession.professionId;
        this.name = personProfession.profession.name;
        this.movies = personProfession.movies.map((movie) => new FindAllMovieDto(movie));
    }
}