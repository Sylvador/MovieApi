import { Controller, InternalServerErrorException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PersonService } from './person.service';
import { Person } from "./models/person.model";
import { PersonProfession } from "./models/person-profession.model";

@Controller()
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @MessagePattern('findAllPerson')
  findAll(@Payload() dto: { search: string, profession?: string }): Promise<Person[]> {
    try {
      return this.personService.findAll(dto.search, dto.profession);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('findOnePerson')
  findOne(@Payload() id: number): Promise<PersonProfession[]> {
    try {
      return this.personService.findOne(id);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
