import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import {FindOnePersonDto} from "./dto/findOne-person.dto";

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @MessagePattern('findAllPerson')
  findAll() {
    return this.personService.findAll();
  }

  @MessagePattern('findOnePerson')
  findOne(@Payload() id: number): Promise<FindOnePersonDto> {
    return this.personService.findOne(id);
  }
}
