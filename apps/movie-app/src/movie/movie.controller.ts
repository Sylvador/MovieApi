import { Controller, InternalServerErrorException } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import {MoviePerson} from "../person/models/movie-person.model";
import {FindAllMovieDto} from "./dto/findAll-movie.dto";

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAllMovie(@Payload('filters') filters: FindAllMovieDto) {
    return this.movieService.findAllMovie(filters);
  }

  @MessagePattern('findOneMovie')
  findOneMovie(@Payload() id: number): Promise<any> {
    try {
      return this.movieService.findOneMovie(id);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('getAllGenres')
  getAllGenres() {
    return this.movieService.getAllGenres();
  }

  @MessagePattern('getAllCountries')
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
    try {
      this.movieService.updateGenre(dto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
