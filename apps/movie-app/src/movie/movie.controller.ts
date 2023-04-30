import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpdateGenreDto } from '../../../api/src/dto/update-genre.dto';
import { FindAllMovieDto } from './dto/findAll-movie.dto';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAllMovie(@Payload('page') page: number, @Payload('filters') filters: FindAllMovieDto) {
    return this.movieService.findAllMovie(page, filters);
  }

  @MessagePattern('findOneMovie')
  findOneMovie(@Payload() id: number) {
    return this.movieService.findOneMovie(id);
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
