import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAllMovie() {
    return this.movieService.findAllMovie();
  }

  @MessagePattern('findOneMovie')
  findOneMovie(@Payload() id: number) {
    return this.movieService.findOneMovie(id);
  }

  @MessagePattern('updateMovie')
  updateMovie(@Payload() dto: UpdateMovieDto) {
    return this.movieService.updateMovie(dto);
  }
}
