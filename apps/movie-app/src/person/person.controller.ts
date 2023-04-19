import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @MessagePattern('createPerson')
  create(@Payload() createPersonDto: CreatePersonDto) {
    return this.personService.create(createPersonDto);
  }

  @MessagePattern('findAllPerson')
  findAll() {
    return this.personService.findAll();
  }

  @MessagePattern('findOnePerson')
  findOne(@Payload() id: number) {
    return this.personService.findOne(id);
  }

  @MessagePattern('updatePerson')
  update(@Payload() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(updatePersonDto.id, updatePersonDto);
  }

  @MessagePattern('removePerson')
  remove(@Payload() id: number) {
    return this.personService.remove(id);
  }
}
