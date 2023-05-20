import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { FindAllMovieDto } from './dto/findAll-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UpdateGenreDto } from 'apps/api/src/dto/update-genre.dto';
import * as SequelizeMock from 'sequelize-mock'
import { of } from 'rxjs';

const mockMovieService = () => ({
  findAllMovie: jest.fn(),
  findOneMovie: jest.fn(),
  updateMovie: jest.fn(),
  updateGenre: jest.fn(),
});

describe('MovieController', () => {
  let controller: MovieController;
  let service: ReturnType<typeof mockMovieService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useFactory: mockMovieService,
        }
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get(MovieService);
  });
  describe('findAllMovie', () => {
    it('should return an array of movies', async () => {
      const filters: FindAllMovieDto = { name: 'test' };
      const DBConnectionMock = new SequelizeMock();
      const result = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
      });
      jest.spyOn(service, 'findAllMovie').mockResolvedValueOnce(result);

      expect(await controller.findAllMovie(filters)).toBe(result);
    });
  });

  describe('findOneMovie', () => {
    it('should return a movie', async () => {
      const DBConnectionMock = new SequelizeMock();
      const result = DBConnectionMock.define('movies', {
        'name': 'Test Movie',
      });
      jest.spyOn(service, 'findOneMovie').mockResolvedValueOnce(result);

      expect(await controller.findOneMovie(1)).toBe(result);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie', async () => {
      const dto: UpdateMovieDto = { name: 'Updated Movie' };
      jest.spyOn(service, 'updateMovie').mockImplementation(() => of(null));

      expect(await controller.updateMovie(1, dto)).toBeUndefined();
      expect(service.updateMovie).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updateGenre', () => {
    it('should update a genre', async () => {
      const dto: UpdateGenreDto = { name: 'Обновлённый жанр', enName: 'Updated Genre' };
      jest.spyOn(service, 'updateGenre').mockImplementation(() => of(null));

      expect(await controller.updateGenre(1, dto)).toBeUndefined();
      expect(service.updateGenre).toHaveBeenCalledWith(1, dto);
    });
  });
});
