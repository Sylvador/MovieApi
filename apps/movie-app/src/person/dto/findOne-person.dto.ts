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

    constructor(personProfessions: PersonProfession[]) {
        this.id = personProfessions[0].personId;
        this.name = personProfessions[0].person.name;
        this.enName = personProfessions[0].person.enName;
        this.photo = personProfessions[0].person.photo;
        this.professions = personProfessions.map((personProfession) => new ProfessionDto(personProfession))
    }
}