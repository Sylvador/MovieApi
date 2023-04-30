import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @MessagePattern('findAllPerson')
  findAll(@Payload() dto: {search: string, profession: string}) {
    return this.personService.findAll(dto.search, dto.profession);
  }

  @MessagePattern('findOnePerson')
  findOne(@Payload() id: number) {
    return this.personService.findOne(id);
  }
}
