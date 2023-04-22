import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Person} from "./models/person.model";
import {FindOnePersonDto} from "./dto/findOne-person.dto";
import {Op} from "sequelize";
import {FindAllPersonDto} from "./dto/findAll-person.dto";
import {PersonProfession} from "./models/person-profession.model";

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private personRepository: typeof Person,
              @InjectModel(PersonProfession) private personProfessionRepository: typeof PersonProfession) {}

  async findAll(search: string, profession: string) {
    const persons: Person[] = await this.personRepository.findAll(
        {
          include: {all: true},
          where: {
              [Op.or]: [
                {name: {[Op.substring]: search}},
                {enName: {[Op.substring]: search}}
              ],
          },
        });
      return persons.filter((person) => {
          return person.professions.filter((personProfession) => personProfession.name === profession).length;
      }).map((person) => new FindAllPersonDto(person));
  }

  async findOne(id: number) {
    const personProfessions = await this.personProfessionRepository.findAll({
        where: {personId: id},
        include: {all: true}
    });
    return new FindOnePersonDto(personProfessions);
  }
}
