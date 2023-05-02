import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Movie } from "./models/movie.model";
import { Person } from "../person/models/person.model";
import { Profession } from "../person/models/profession.model";
import { RpcException } from "@nestjs/microservices";
import { Genre } from "./models/genre.model";
import { Country } from "./models/country.model";
import { Language } from "./models/language.model";
import { Fact } from "./models/fact.model";
import { Comment } from "../comment/models/comment.model";
import { SimilarMovies } from "./models/similar-movies.model";
import { UpdateGenreDto } from 'apps/api/src/dto/update-genre.dto';
import { FindAllMovieDto } from './dto/findAll-movie.dto';
import { Op, Sequelize } from 'sequelize';
import { UpdateMovieDto } from 'apps/api/src/dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie) private movieRepository: typeof Movie,
    @InjectModel(Genre) private genreRepository: typeof Genre,
    @InjectModel(Country) private countryRepository: typeof Country
  ) { }

  async findAllMovie(filters: FindAllMovieDto): Promise<Movie[]> {
    try {
      const { genres, countries, persons, page, rating, search } = filters;
      console.log('before query ***********')
      const movies: Movie[] = await this.movieRepository.findAll({
        attributes: [
          'movieId',
          'name',
          'enName',
          'type',
          'rating',
          'votes',
          'movieLength',
          'description',
          'premiere',
          'slogan',
          'shortDescription',
          'ageRating',
          'poster',
          'trailer',
        ],
        include: [
          { model: Genre, as: 'genres', attributes: [], through: { attributes: [] } },
          { model: Country, through: { attributes: [] } },
          { model: Comment, attributes: { exclude: ['movieId'] } },
        ],
        where: {
          ...(search ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { enName: { [Op.iLike]: `%${search}%` } },
            ]
          } : {}),
          ...(genres?.length ? {
            '$genres.name$': {
              [Op.in]: genres,
            },
          } : {}),
          ...(countries?.length ? {
            '$countries.name$': {
              [Op.in]: countries,
            },
          } : {}),
          ...(rating ? {
            rating: {
              [Op.gte]: rating,
            }
          } : {}),
        },
        group: ['Movie.movieId'],
        having: {
          ...(genres?.length ? {
            [Op.and]: Sequelize.literal(`COUNT(DISTINCT CASE WHEN "genres"."name" IN (${genres.map(g => `'${g}'`).join(',')}) THEN "genres"."genreId" END) >= ${genres.length}`),
          } : {}),
          ...(countries?.length ? {
            [Op.and]: Sequelize.literal(`COUNT(DISTINCT CASE WHEN '$countries.name$' IN (${countries.map(c => `'${c}'`).join(',')}) THEN '$countries.name$' END) = ${countries.length}`),
          } : {}),
        },
        subQuery: false,
        limit: 10,
        offset: ((page || 1) - 1) * 10,
      });
      
      for (let i = 0; i < movies.length; i++) {
        const persons = await movies[i].$get('persons', { include: [{ model: Person }, { model: Profession }] });
        movies[i].setDataValue('persons', persons);
      }
      
      
      for (let i = 0; i < movies.length; i++) {
        const genres = await movies[i].$get('genres', {
          joinTableAttributes: [],
          attributes: ['genreId', 'name'],
        } as any);

        movies[i].setDataValue('genres', genres as any);
      }
      
      
      return movies;
    } catch (error) {
      console.log(error);
      throw new RpcException(new BadRequestException(error.message));
    }
  }

  async findOneMovie(id: number): Promise<Movie> {
    const movie: Movie = await this.movieRepository.findByPk(id, {
      include: [
        { model: Genre, through: { attributes: [] } },
        { model: Country, through: { attributes: [] } },
        { model: Comment, attributes: { exclude: ['movieId'] } },
        { model: Language, through: { attributes: [] } },
        { model: Fact, attributes: { exclude: ['movieId'] } },
        { model: SimilarMovies },
      ]
    });
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    const persons = await movie.$get('persons', { include: [{ model: Person }, { model: Profession }] });
    movie.setDataValue('persons', persons);
    return movie;
  }

  updateMovie(dto: UpdateMovieDto): void {
    this.movieRepository.update(dto, { where: { id: dto.id } });
  }
  
  getAllGenres() {
    return this.genreRepository.findAll();
  }

  getAllCountries() {
    return this.countryRepository.findAll();
  }

  updateGenre(dto: UpdateGenreDto): void {
    this.genreRepository.update(dto, { where: { id: dto.id } });
  }

  
  async getModelById(id: number) {
    const movie = this.movieRepository.findByPk(id);
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    return movie;
  }
}
