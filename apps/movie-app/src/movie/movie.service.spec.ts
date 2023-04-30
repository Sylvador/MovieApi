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

describe('MovieService', () => {
  let service: MovieService;
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
            $get: jest.fn().mockResolvedValue([{ name: 'Person 1' }, { name: 'Person 2' }]),
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
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get(getModelToken(Movie));
    genreRepository = module.get<typeof Genre>(getModelToken(Genre));

  });

  describe('findAllMovie', () => {
    it('should return an array of movies', async () => {
      const DBConnectionMock = new SequelizeMock();
      const movieMock = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
    }, {
        instanceMethods: {
            
        },
    });
      const filters: FindAllMovieDto = { name: 'test' };
      jest.spyOn(movieRepository, 'findAll').mockResolvedValueOnce(movieMock);

      expect(await service.findAllMovie(1, filters)).toBe(movieMock);
      expect(movieRepository.findAll).toHaveBeenCalledWith({
        where: { ...filters },
        include: [
          { model: Genre, through: { attributes: [] } },
          { model: Country, through: { attributes: [] } },
          { model: Comment, attributes: { exclude: ['movieId'] } },
          { model: Language, through: { attributes: [] } },
          { model: Fact, attributes: { exclude: ['movieId'] } },
          { model: SimilarMovies },
        ],
        limit: 10,
        offset: 0,
      });
    });
  });

  describe('findOneMovie', () => {
    it('should return a movie', async () => {
      const DBConnectionMock = new SequelizeMock();
      const movieMock = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
      });
      movieMock.$get = () => {};
      movieMock.setDataValue = () => {};
      jest.spyOn(movieMock, '$get').mockResolvedValueOnce('test persons');
      jest.spyOn(movieRepository, 'findByPk').mockResolvedValueOnce(movieMock);

      expect(await service.findOneMovie(1)).toBe(movieMock);
      expect(movieRepository.findByPk).toHaveBeenCalledWith(1, {
        include: [
          { model: Genre, through: { attributes: [] } },
          { model: Country, through: { attributes: [] } },
          { model: Comment, attributes: { exclude: ['movieId'] } },
          { model: Language, through: { attributes: [] } },
          { model: Fact, attributes: { exclude: ['movieId'] } },
          { model: SimilarMovies },
        ],
      });
    });

    it('should throw an exception if movie is not found', async () => {
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(() => Promise.resolve(null));

      await expect(service.findOneMovie(1)).rejects.toThrowError(
        new RpcException(new NotFoundException('Фильм с данным id не найден')),
      );
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const dto: UpdateMovieDto = { id: 1, name: 'Updated Movie' };
      jest.spyOn(movieRepository, 'update').mockImplementation(() => Promise.resolve(null));

      expect(await service.updateMovie(dto)).toBeUndefined();
      expect(movieRepository.update).toHaveBeenCalledWith(dto, { where: { id: dto.id } });
    });
  });

  describe('updateGenre', () => {
    it('should update a genre', async () => {
      const dto: UpdateGenreDto = { id: 1, name: 'Updated Genre' };
      jest.spyOn(genreRepository, 'update').mockImplementation(() => Promise.resolve(null));

      expect(await service.updateGenre(dto)).toBeUndefined();
      expect(genreRepository.update).toHaveBeenCalledWith(dto, { where: { id: dto.id } });
    });
  });

  describe('getModelById', () => {
    it('should return a movie by id', async () => {
      const result = movieRepository.create({ name: 'Test Movie' });
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(() => Promise.resolve(result));

      expect(await service.getModelById(1)).toBe(result);
      expect(movieRepository.findByPk).toHaveBeenCalledWith(1);
    });

    it('should throw an exception if movie is not found', async () => {
      jest.spyOn(movieRepository, 'findByPk').mockImplementation(() => Promise.reject(new Error('Фильм с данным id не найден')));

      await expect(service.getModelById(1)).rejects.toThrowError(
        new RpcException(new NotFoundException('Фильм с данным id не найден')),
      );
    });
  });
});
