import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateGenreDto } from '../../../api/src/dto/update-genre.dto';
import { FindAllMovieDto } from './dto/findAll-movie.dto';
import { UpdateMovieDto } from 'apps/api/src/dto/update-movie.dto';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAllMovie(@Payload('filters') filters: FindAllMovieDto) {
    return this.movieService.findAllMovie(filters);
  }

  @MessagePattern('findOneMovie')
  findOneMovie(@Payload() id: number) {
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

  @EventPattern('updateMovie')
  updateMovie(@Payload() dto: UpdateMovieDto): void {
    this.movieService.updateMovie(dto);
  }

  @EventPattern('updateGenre')
  updateGenre(@Payload() dto: UpdateGenreDto): void {
    this.movieService.updateGenre(dto);
  }
}
