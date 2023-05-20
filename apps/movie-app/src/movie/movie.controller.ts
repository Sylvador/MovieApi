import { Controller, InternalServerErrorException } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviePerson } from "../person/models/movie-person.model";
import { FindAllMovieDto } from "./dto/findAll-movie.dto";
import { UpdateGenreDto } from '../../../api/src/dto/update-genre.dto';
import { Movie } from './models/movie.model';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @MessagePattern('findAllMovie')
  async findAllMovie(@Payload('filters') filters: FindAllMovieDto): Promise<{ pageCount: number; movies: Movie[]; }> {
    try {
      return this.movieService.findAllMovie(filters);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('findOneMovie')
  async findOneMovie(@Payload() id: number): Promise<any> {
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
  async getAllGenres() {
    try {
      return this.movieService.getAllGenres();
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('getAllCountries')
  async getAllCountries() {
    try {
      return this.movieService.getAllCountries();
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('getMoviePersons')
  async getMoviePersons(@Payload() id: number): Promise<MoviePerson[]> {
    try {
      return this.movieService.getMoviePersons(id);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @EventPattern('updateMovie')
  async updateMovie(@Payload('movieId') movieId: number, @Payload('dto') dto: UpdateMovieDto): Promise<void> {
    try {
      this.movieService.updateMovie(movieId, dto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @EventPattern('updateGenre')
  async updateGenre(@Payload('genreId') genreId: number, @Payload('dto') dto: UpdateGenreDto): Promise<void> {
    try {
      this.movieService.updateGenre(genreId, dto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
