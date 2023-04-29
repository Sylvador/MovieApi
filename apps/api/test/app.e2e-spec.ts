import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiModule } from '../src/api.module';
import { Tokens } from '@app/common/types';
import { of } from 'rxjs';

const mockAuthClient = {
  send: jest.fn(),
};

const mockTokens: Tokens = {
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken',
};

const mockUser = {
  userId: 1,
  email: 'user@example.com',
  username: 'user',
  hashedPassword: 'hashedPassword',
  hashedRt: 'mockRtHash',
  isAdmin: false,
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    })
      .overrideProvider('AUTH_SERVICE')
      .useValue(mockAuthClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', async () => {
    const userDto = {
      email: 'user@example.com',
      password: 'testpassword',
      username: 'user',
    };

    mockAuthClient.send.mockReturnValueOnce(of(mockTokens));

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userDto)
      .expect(201);

    expect(response.body).toEqual(mockTokens);
  });

  it('/auth/signin (POST)', async () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };

    mockAuthClient.send.mockReturnValueOnce(of(mockTokens));

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(signInDto)
      .expect(200);

    expect(response.body).toEqual(mockTokens);
  });
});
