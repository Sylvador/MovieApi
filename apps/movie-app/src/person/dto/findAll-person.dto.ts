import {Person} from "../models/person.model";

export class FindAllPersonDto {
    id: number;
    name: string;
    enName: string;
    photo: string;

    constructor(person: Person) {
        this.id = person.id;
        this.name = person.name;
        this.enName = person.enName;
        this.photo = person.photo;
    }
}