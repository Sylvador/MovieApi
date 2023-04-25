import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Person} from "./models/person.model";
import {FindOnePersonDto} from "./dto/findOne-person.dto";

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private personRepository: typeof Person) {}

  findAll() {
    return `This action returns all person`;
  }

  async findOne(id: number): Promise<FindOnePersonDto> {
    const person: Person = await this.personRepository.findByPk(id, {include: {all: true}});
    return new FindOnePersonDto(person);
  }
}
