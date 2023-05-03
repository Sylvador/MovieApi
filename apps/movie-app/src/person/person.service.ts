import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Person} from "./models/person.model";
import {FindOnePersonDto} from "./dto/findOne-person.dto";
import {Op} from "sequelize";
import {FindAllPersonDto} from "./dto/findAll-person.dto";
import {PersonProfession} from "./models/person-profession.model";
import {Profession} from "./models/profession.model";

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private personRepository: typeof Person,
              @InjectModel(PersonProfession) private personProfessionRepository: typeof PersonProfession) {}

    async findAll(search: string, profession: string): Promise<Person[]> {
        return this.personRepository.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { enName: { [Op.iLike]: `%${search}%` } },
                ]},
            include: [{ model: Profession, where: { name: profession } }],
            limit: 10,
        });
   }

  async findOne(id: number) {
    const personProfessions = await this.personProfessionRepository.findAll({
        where: {personId: id},
        include: {all: true}
    });
    return personProfessions;
  }
}
