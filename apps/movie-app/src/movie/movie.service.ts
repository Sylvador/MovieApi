import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { PersonProfession } from "../person/models/person-profession.model";
import { MoviePerson } from "../person/models/movie-person.model";
import { Op, Sequelize } from "sequelize";
import { FindAllMovieDto } from "./dto/findAll-movie.dto";
import { UpdateGenreDto } from 'apps/api/src/dto/update-genre.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie) private movieRepository: typeof Movie,
    @InjectModel(Genre) private genreRepository: typeof Genre,
    @InjectModel(Country) private countryRepository: typeof Country,
    @InjectModel(SimilarMovies) private similarMoviesRepository: typeof SimilarMovies,
    @InjectModel(MoviePerson) private moviePersonRepository: typeof MoviePerson
  ) { }

  //#region movie
  async findAllMovie(filters: FindAllMovieDto): Promise<Movie[]> {
    const { genres, countries, person, page, rating, search, votes, sort } = filters;
    let order: string;
    if (sort) {
      sort == 'new' ? order = 'DESC' : order = 'ASC'
    }
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
        { model: Country, attributes: [], through: { attributes: [] } },
        { model: PersonProfession, include: [{ model: Person, attributes: [] }], attributes: [], through: { attributes: [] } },
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
        ...(person ? {
          '$persons.person.name$': {
            [Op.iLike]: `%${person}%`
          }
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
        ...(votes ? {
          votes: {
            [Op.gte]: votes,
          }
        } : {}),
      },
      ...(sort ? {
        order: [['premiere', order]]
      } : {}),
      group: ['Movie.movieId'],
      having: {
        ...(genres?.length ? {
          [Op.and]: Sequelize.literal(`COUNT(DISTINCT CASE WHEN "genres"."name" IN (${genres.map(g => `'${g}'`).join(',')}) THEN "genres"."genreId" END) >= ${genres.length}`),
        } : {}),
        ...(countries?.length ? {
          [Op.and]: Sequelize.literal(`COUNT(DISTINCT CASE WHEN "countries"."name" IN (${countries.map(c => `'${c}'`).join(',')}) THEN "countries"."name" END) >= ${countries.length}`),
        } : {}),
      },
      subQuery: false,
      limit: 10,
      offset: ((page || 1) - 1) * 10,
    });

    if (!movies.length) {
      throw new RpcException(new NotFoundException('Фильмы не найдены'));
    }

    //attach persons, genres, comments and countries
    for (let i = 0; i < movies.length; i++) {
      const personProfessions = await movies[i].$get('persons', { include: [{ model: Person }, { model: Profession }] });

      const genres = await movies[i].$get('genres', {
        joinTableAttributes: [],
        attributes: ['genreId', 'name'],
      } as any);

      const countries = await movies[i].$get('countries', {
        joinTableAttributes: [],
        through: { attributes: [] }
      } as any);

      movies[i] = movies[i].toJSON();
      await this.sortPersons(personProfessions) as any;
      movies[i].persons = await this.sortPersons(personProfessions) as any;
      movies[i].genres = genres as any;
      movies[i].countries = countries as any;
    }

    return movies;
  }

  async findOneMovie(id: number): Promise<any> {
    let movie: Movie = await this.movieRepository.findByPk(id, {
      include: [
        { model: Genre, through: { attributes: [] } },
        { model: Country, through: { attributes: [] } },
        { model: Comment, attributes: { exclude: ['movieId'] } },
        { model: Language, through: { attributes: [] } },
        { model: Fact, attributes: { exclude: ['movieId'] } },
        // { model: SimilarMovies, include: [{ model: Movie }], attributes: { exclude: ['id', 'movieId1', 'movieId2'] } },
      ],
    });
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    const similarMovies = await movie.$get('similarMovies', { include: [{ model: Movie }], attributes: { exclude: ['id', 'movieId1', 'movieId2'] } });
    movie.setDataValue('similarMovies', similarMovies);
    const personProfessions = await movie.$get('persons', {
      include: [
        { model: Person },
        { model: Profession },
      ],
      attributes: [],
    });

    const commentsTree = this.getCommentTree(movie.comments)
    movie = movie.toJSON();
    movie.persons = await this.sortPersons(personProfessions) as any;
    movie.comments = commentsTree;
    return movie;
  }

  async sortPersons(personProfessions: PersonProfession[]): Promise<{ [k: string]: Person[] }> {
    const sortedPersons: Map<string, Person[]> = new Map();
    personProfessions.forEach(personProfession => {
      if (sortedPersons.has(personProfession.profession.name)) {
        sortedPersons.set(personProfession.profession.name, [...sortedPersons.get(personProfession.profession.name), personProfession.person]);
      } else {
        sortedPersons.set(personProfession.profession.name, [personProfession.person]);
      }
    })
    return Object.fromEntries(sortedPersons);
  }

  async getMoviePersons(movieId: number): Promise<MoviePerson[]> {
    const persons: MoviePerson[] = await this.moviePersonRepository.findAll({
      include: [
        {
          model: PersonProfession,
          attributes: { exclude: ['id', 'professionId'] },
          include: [
            { model: Person },
            { model: Movie, attributes: ['movieId'], through: { attributes: [] } }
          ]
        }
      ],
      where: { movieId: movieId },
      attributes: [],
    });
    if (!persons.length) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    return persons;
  }

  updateMovie(dto: UpdateMovieDto): void {
    this.movieRepository.update({ name: dto.name, enName: dto.enName }, { where: { movieId: dto.movieId } });
  }

  async getModelById(id: number) {
    const movie = this.movieRepository.findByPk(id);
    if (!movie) {
      throw new RpcException(new NotFoundException('Фильм с данным id не найден'));
    }
    return movie;
  }
  //#endregion

  //#region comment
  getCommentTree(comments: Comment[]): Comment[] {
    const map = {};
    const result: Comment[] = [];

    // создаем объект-карту элементов, чтобы было проще находить родительские элементы
    for (const item of comments) {
      map[item.commentId] = { ...item.dataValues, childComments: [] };
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
  //#endregion

  //#region genre
  getAllGenres() {
    return this.genreRepository.findAll();
  }

  updateGenre(dto: UpdateGenreDto): void {
    try {
      this.genreRepository.update(dto, { where: { genreId: dto.genreId } });
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
  //#endregion

  //#region country
  getAllCountries() {
    return this.countryRepository.findAll();
  }
  //#endregion
}
