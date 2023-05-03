import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import {Person} from "./models/person.model";
import {PersonProfession} from "./models/person-profession.model";

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @MessagePattern('findAllPerson')
  findAll(@Payload() dto: {search: string, profession: string}): Promise<Person[]> {
    return this.personService.findAll(dto.search, dto.profession);
  }

  @MessagePattern('findOnePerson')
  findOne(@Payload() id: number): Promise<PersonProfession[]> {
    return this.personService.findOne(id);
  }
}
