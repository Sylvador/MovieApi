import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovieService } from './movie.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {FindOneMovieDto} from "./dto/findOne-movie.dto";

@Controller()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @MessagePattern('findAllMovie')
  findAll() {
    return this.movieService.findAll();
  }

  @MessagePattern('findOneMovie')
  findOne(@Payload() id: number): Promise<FindOneMovieDto> {
    return this.movieService.findOne(id);
  }

  @MessagePattern('updateMovie')
  update(@Payload() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(updateMovieDto.id, updateMovieDto);
  }
}
