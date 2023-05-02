import {FindAllMovieDto} from "../../movie/dto/findAll-movie.dto";
import {Person} from "../models/person.model";
import {ProfessionDto} from "./profession.dto";
import {PersonProfession} from "../models/person-profession.model";

export class FindOnePersonDto {
    id: number;
    name: string;
    enName: string;
    photo: string;
    professions: ProfessionDto[]
}