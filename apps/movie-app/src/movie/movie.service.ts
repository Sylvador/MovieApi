import { Injectable } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {InjectModel} from "@nestjs/sequelize";
import {Movie} from "./models/movie.model";
import {FindOneMovieDto} from "./dto/findOne-movie.dto";

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie) private movieRepository: typeof Movie) {}
  findAll() {
    return `This action returns all movie`;
  }

  async findOne(id: number): Promise<FindOneMovieDto> {
    const movie: Movie = await this.movieRepository.findByPk(id, {include: {all: true}});
    return new FindOneMovieDto(movie);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }
}
