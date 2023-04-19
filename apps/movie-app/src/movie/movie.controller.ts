import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('createMovie')
  create(@Payload() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @MessagePattern('findAllMovie')
  findAll() {
    return this.movieService.findAll();
  }

  @MessagePattern('findOneMovie')
  findOne(@Payload() id: number) {
    return this.movieService.findOne(id);
  }

  @MessagePattern('updateMovie')
  update(@Payload() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(updateMovieDto.id, updateMovieDto);
  }

  @MessagePattern('removeMovie')
  remove(@Payload() id: number) {
    return this.movieService.remove(id);
  }
}
