import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateMovieDto } from './dto/update-movie.dto';
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
import {FiltersDto} from "./dto/filters.dto";

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie) private movieRepository: typeof Movie,
    @InjectModel(Genre) private genreRepository: typeof Genre,
    @InjectModel(Country) private countryRepository: typeof Country,
    @InjectModel(SimilarMovies) private similarMoviesRepository: typeof SimilarMovies,
    @InjectModel(MoviePerson) private moviePersonRepository: typeof MoviePerson
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

  async findOneMovie(id: number): Promise<any> {
    const movie: Movie = await this.movieRepository.findByPk(id, {
      include: [
        { model: Genre, through: { attributes: [] } },
        { model: Country, through: { attributes: [] } },
        { model: Comment, attributes: { exclude: ['movieId'] } },
        { model: Language, through: { attributes: [] } },
        { model: Fact, attributes: { exclude: ['movieId'] } },
        { model: SimilarMovies, include: [{model: Movie}], attributes: {exclude: ['id', 'movieId1', 'movieId2']}},
      ]
    });
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    const persons = await movie.$get('persons', {
      include: [
        {model: Person},
        {model: Profession},
      ],
      attributes: [],
    });
    movie.setDataValue('persons', persons);
    movie.setDataValue('comments', this.getCommentTree(movie.comments));
    return movie.dataValues;
  }

  getCommentTree(comments: Comment[]): Comment[] {
    const map = {};
    const result: Comment[] = [];

    // создаем объект-карту элементов, чтобы было проще находить родительские элементы
    for (const item of comments) {
      map[item.commentId] = {...item.dataValues, childComments: []};
    }

    // проходимся по всем элементам и создаем связи между родительскими и дочерними элементами
    for (const item of comments) {
      if (item.parentId !== null) {
        map[item.parentId].childComments.push(map[item.commentId]);
      } else {
        result.push(map[item.commentId]);
      }
    }

    return result;
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

  async getMoviePersons(movieId: number): Promise<MoviePerson[]> {
    const persons = await this.moviePersonRepository.findAll({
      include: [
        {
          model: PersonProfession,
          attributes: {exclude: ['id', 'professionId']},
          include: [
            {model: Person},
            {model: Movie, attributes: ['movieId'], through: {attributes: []}}
          ]
        }
      ],
      where: {movieId: movieId},
      attributes: [],
    });
    return persons;
  }

  async getModelById(id: number) {
    const movie = this.movieRepository.findByPk(id);
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    return movie;
  }
}
