import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {Movie} from "./models/movie.model";
import {Genre} from "./models/genre.model";
import {Country} from "./models/country.model";
import {SimilarMovies} from "./models/similar-movies.model";
import {MoviePerson} from "../person/models/movie-person.model";

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [SequelizeModule.forFeature([Movie, Genre, Country, SimilarMovies, MoviePerson])],
  exports: [MovieService]
})
export class MovieModule {}
