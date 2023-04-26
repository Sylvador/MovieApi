import {PersonProfession} from "../../person/models/person-profession.model";

export class PersonProfDto {
    id: number;
    name: string;
    enName: string;
    photo: string;
    profession: string;

    constructor(personProf: PersonProfession) {
        this.id = personProf.personId;
        this.name = personProf.person.name;
        this.enName = personProf.person.enName;
        this.photo = personProf.person.photo;
        this.profession = personProf.profession.name;
    }
}