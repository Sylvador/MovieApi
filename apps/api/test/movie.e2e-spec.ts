import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from '../src/api.module';
import { RpcExceptionFilter } from '../../../libs/common/src/exceptions/rpc-exception.filter';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new RpcExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/GET find-by-id/:id (200)', () => {
    const id = 435;
    return request(app.getHttpServer())
      .get(`/movie/find-by-id/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('movieId', id);
      });
  });
  
  it('/GET find-by-id/:id (404)', () => {
    const id = -1;
    return request(app.getHttpServer())
      .get(`/movie/find-by-id/${id}`)
      .expect(404);
  });
  
  it('/GET :id/persons (200)', () => {
    const id = 435;
    return request(app.getHttpServer())
      .get(`/movie/${id}/persons`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
  
  it('/GET :id/persons (404)', () => {
    const id = -1; // Replace with an invalid movie ID
    return request(app.getHttpServer())
      .get(`/movie/${id}/persons`)
      .expect(404);
  });
  
  it('/GET findAllMovies (200)', () => {
    return request(app.getHttpServer())
      .get('/movie/')
      .query({ search: 'Зеленая миля' })
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
      });
  });
  
  it('/GET findAllMovies (404)', () => {
    return request(app.getHttpServer())
      .get('/movie')
      .query({ search: 'invalid search string' })
      .expect(404);
  });
});
