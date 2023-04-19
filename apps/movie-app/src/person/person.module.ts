import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Person} from "./models/person.model";

@Module({
  controllers: [PersonController],
  providers: [PersonService],
  imports: [SequelizeModule.forFeature([Person])]
})
export class PersonModule {}
