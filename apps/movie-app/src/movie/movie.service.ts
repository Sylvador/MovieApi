import {BadRequestException, Injectable} from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
import {InjectModel} from "@nestjs/sequelize";
import {Movie} from "./models/movie.model";
import {PersonProfession} from "../person/models/person-profession.model";
import {Person} from "../person/models/person.model";
import {Profession} from "../person/models/profession.model";
import {FindOneMovieDto} from "./dto/findOne-movie.dto";
import {RpcException} from "@nestjs/microservices";
import {Genre} from "./models/genre.model";
import {Country} from "./models/country.model";
import {Language} from "./models/language.model";
import {Fact} from "./models/fact.model";
import {Comment} from "../comment/models/comment.model";

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie) private movieRepository: typeof Movie) {}
  findAll() {
    return `This action returns all movie`;
  }

  async findOne(id: number) {
    const movie: Movie = await this.movieRepository.findByPk(id, {
      include: [
        {model: Genre},
        {model: Country},
        {model: Comment},
        {model: Language},
        {model: Fact},
        {model: PersonProfession, include: [{model: Person}, {model: Profession}]},
      ]});
    return new FindOneMovieDto(movie);
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  async getModelById(id: number) {
    const movie =  this.movieRepository.findByPk(id);
    if (!movie) {
      throw new RpcException(new BadRequestException('Фильм с данным id не найден'));
    }
    return movie;
  }
}
