import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { UpdateMovieDto } from 'apps/api/src/dto/update-movie.dto';
import {Movie} from "./models/movie.model";
import {MoviePerson} from "../person/models/movie-person.model";

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAllMovie(@Payload('filters') filters: FindAllMovieDto) {
    return this.movieService.findAllMovie(filters);
  }

  @MessagePattern('findOneMovie')
  findOneMovie(@Payload() id: number): Promise<any> {
    return this.movieService.findOneMovie(id);
  }

  @MessagePattern('GetAllGenres')
  getAllGenres() {
    return this.movieService.getAllGenres();
  }

  @MessagePattern('GetAllCountries')
  getAllCountries() {
    return this.movieService.getAllCountries();
  }

  @MessagePattern('getMoviePersons')
  getMoviePersons(@Payload() id: number): Promise<MoviePerson[]> {
    return this.movieService.getMoviePersons(id);
  }

  @EventPattern('updateMovie')
  updateMovie(@Payload() dto: UpdateMovieDto): void {
    this.movieService.updateMovie(dto);
  }

  @EventPattern('updateGenre')
  updateGenre(@Payload() dto: UpdateGenreDto): void {
    this.movieService.updateGenre(dto);
  }
}
