import {FindAllMovieDto} from "../../movie/dto/findAll-movie.dto";
import {PersonProfession} from "../models/person-profession.model";

export class ProfessionDto {
    id: number;
    name: string;
    movies: FindAllMovieDto[]
}