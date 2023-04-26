import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Movie} from "./models/movie.model";
import {Genre} from "./models/genre.model";
import {Country} from "./models/country.model";

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [SequelizeModule.forFeature([Movie, Genre, Country])],
  exports: [MovieService]
})
export class MovieModule {}
