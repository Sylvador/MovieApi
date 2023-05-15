import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getModelToken } from '@nestjs/sequelize';
import { Movie } from './models/movie.model';
import { Genre } from './models/genre.model';
import { Country } from './models/country.model';
import { Comment } from '../comment/models/comment.model';
import { of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpdateGenreDto } from 'apps/api/src/dto/update-genre.dto';
import { FindAllMovieDto } from './dto/findAll-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { Fact } from './models/fact.model';
import { Language } from './models/language.model';
import { SimilarMovies } from './models/similar-movies.model';
import * as SequelizeMock from 'sequelize-mock';
import { MoviePerson } from '../person/models/movie-person.model';
import { PersonProfession } from '../person/models/person-profession.model';
import { Person } from '../person/models/person.model';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: typeof Movie;
  let genreRepository: typeof Genre;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getModelToken(Movie),
          useValue: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
            $get: jest.fn(),
          },
        },
        {
          provide: getModelToken(Genre),
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: getModelToken(Country),
          useValue: {},
        },
        {
          provide: getModelToken(Comment),
          useValue: {},
        },
        {
          provide: getModelToken(SimilarMovies),
          useValue: {},
        },
        {
          provide: getModelToken(MoviePerson),
          useValue: {},
        }
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get(getModelToken(Movie));
    genreRepository = module.get<typeof Genre>(getModelToken(Genre));

  });

  describe('findAllMovie', () => {
    it('should return an array of movies', async () => {
      const DBConnectionMock = new SequelizeMock();
      const movieMock = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
    });
      const filters: FindAllMovieDto = { page: 1 };
      jest.spyOn(movieRepository, 'findAll').mockResolvedValueOnce(movieMock);

      expect(await movieService.findAllMovie(filters)).toBe(movieMock);
      expect(movieRepository.findAll).toHaveBeenCalledWith({
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
          { model: PersonProfession, include: [ { model: Person, attributes: [] } ], attributes: [], through: { attributes: [] } },
        ],
        where: {},
        group: ['Movie.movieId'],
        having: {},
        subQuery: false,
        limit: 10,
        offset: 0,
      });
    });
  });

  describe('findOneMovie', () => {
    it('should return a movie with the given id', async () => {
      const DBConnectionMock = new SequelizeMock();
      const commentMock = DBConnectionMock.define('comments', {
        'value': 'Test Comment',
      });
      const movieMock = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
    });
      console.log(movieMock)
      const movieId = 1;
      movieMock.id = movieId;
      movieMock.$get = jest.fn();
      movieMock.setDataValue = jest.fn();
      movieMock.toJSON = jest.fn().mockImplementationOnce(() => {
        movieMock.comments = [];
        return movieMock;
      });

      jest.spyOn(movieRepository, 'findByPk').mockResolvedValueOnce(movieMock);
      jest.spyOn(movieService, 'getCommentTree').mockReturnValueOnce(commentMock)

      const result = await movieService.findOneMovie(movieId);

      expect(movieRepository.findByPk).toHaveBeenCalledWith(movieId, expect.any(Object));
      expect(result).toEqual(movieMock);
    });

    it('should throw an exception if movie is not found', async () => {
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(jest.fn());

      await expect(movieService.findOneMovie(1)).rejects.toThrowError(
        new RpcException(new NotFoundException('Фильм с данным id не найден')),
      );
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const dto: UpdateMovieDto = { id: 1, name: 'Updated Movie' };
      jest.spyOn(movieRepository, 'update').mockImplementation(() => Promise.resolve(null));

      expect(await movieService.updateMovie(dto)).toBeUndefined();
      expect(movieRepository.update).toHaveBeenCalledWith(dto, { where: { movieId: dto.id } });
    });
  });

  describe('updateGenre', () => {
    it('should update a genre', async () => {
      const dto: UpdateGenreDto = { id: 1, name: 'Обновлённый жанр', enName: 'Updated Genre' };
      jest.spyOn(genreRepository, 'update').mockImplementation(() => Promise.resolve(null));

      expect(await movieService.updateGenre(dto)).toBeUndefined();
      expect(genreRepository.update).toHaveBeenCalledWith({ name: dto.name }, { where: { genreId: dto.id } });
    });
  });

  describe('getModelById', () => {
    it('should return a movie by id', async () => {
      const result = movieRepository.create({ name: 'Test Movie' });
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(() => Promise.resolve(result));

      expect(await movieService.getModelById(1)).toBe(result);
      expect(movieRepository.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if movie is not found', async () => {
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(() => Promise.reject(new Error('Фильм с данным id не найден')));

      await expect(movieService.getModelById(1)).rejects.toThrowError(
        new RpcException(new NotFoundException('Фильм с данным id не найден')),
      );
    });
  });
});
