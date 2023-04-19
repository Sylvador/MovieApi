import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Movie} from "./models/movie.model";

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [SequelizeModule.forFeature([Movie])],
})
export class MovieModule {}
