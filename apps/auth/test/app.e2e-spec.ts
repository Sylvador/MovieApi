import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth.service';
import { TokenService } from '../src/token/token.service';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { Tokens } from '@app/common/types';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { SignInDto } from 'apps/user/src/dto/signin.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService (e2e)', () => {
  let authService: AuthService;
  let tokenService: TokenService;
  let userClient: ClientProxy;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        TokenService,
        JwtService,
        ConfigService,
        {
          provide: 'USER_SERVICE',
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleFixture.get<AuthService>(AuthService);
    tokenService = moduleFixture.get<TokenService>(TokenService);
    userClient = moduleFixture.get<ClientProxy>('USER_SERVICE');
  });

  describe('signup', () => {
    it('should return tokens when user is created successfully', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const user = { 
        userId: 1,
        email: 'user@mail.ru',
        username: 'user',
        hashedPassword: 'hashedPassword',
        hashedRt: 'hashedRt',
        isAdmin: false,
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(null));
      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(user));
      jest.spyOn(tokenService, 'generateTokens').mockResolvedValueOnce(tokens);
      jest.spyOn(tokenService, 'updateRtHash').mockResolvedValueOnce(undefined);

      const result = await authService.signup(userDto);
      expect(result).toEqual(tokens);
    });

    it('should throw BadRequestException when user with the same email already exists', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const candidate = {
        email: 'user@mail.ru',
      };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(candidate));

      await expect(authService.signup(userDto)).rejects.toThrowError('Пользователь с таким email уже существует');
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(new Error('Some error')));

      await expect(authService.signup(userDto)).rejects.toThrowError();
    });
  });

  describe('signin', () => {
    it('should return tokens when user is authenticated successfully', async () => {
      const signInDto: SignInDto = {
        email: 'user@mail.ru',
        password: '1234',
      };
      const user = { 
        userId: 1,
        email: 'user@mail.ru',
        username: 'user',
        hashedPassword: 'hashedPassword',
        hashedRt: 'hashedRt',
        isAdmin: false,
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(user));
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);
      jest.spyOn(tokenService, 'generateTokens').mockResolvedValueOnce(tokens);
      jest.spyOn(tokenService, 'updateRtHash').mockResolvedValueOnce(undefined);

      const result = await authService.signin(signInDto);
      expect(result).toEqual(tokens);
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      const signInDto: SignInDto = {
        email: 'user@mail.ru',
        password: '1234',
      };
      const user = { 
        userId: 1,
        email: 'user@mail.ru',
        username: 'user',
        hashedPassword: 'hashedPassword',
        hashedRt: 'hashedRt',
        isAdmin: false,
      };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(user));
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(authService.signin(signInDto)).rejects.toThrowError('Invalid credentials');
    });
  });

  describe('refresh', () => {
    it('should return tokens when refresh token is valid', async () => {
      const userId = 1;
      const rt = 'some_refresh_token';
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };

      jest.spyOn(tokenService, 'refreshTokens').mockResolvedValueOnce(tokens);

      const result = await authService.refresh(userId, rt);
      expect(result).toEqual(tokens);
    });
  });

  describe('validateUser', () => {
    it('should return tokens when user exists', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const user = { 
        userId: 1,
        email: 'user@mail.ru',
        username: 'user',
        hashedPassword: 'hashedPassword',
        hashedRt: 'hashedRt',
        isAdmin: false,
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(user));
      jest.spyOn(tokenService, 'generateTokens').mockResolvedValueOnce(tokens);
      jest.spyOn(tokenService, 'updateRtHash').mockResolvedValueOnce(undefined);

      const result = await authService.validateUser(userDto);
      expect(result).toEqual(tokens);
    });

    it('should call signup when user does not exist', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };

      jest.spyOn(userClient, 'send').mockReturnValueOnce(of(null));
      jest.spyOn(authService, 'signup').mockResolvedValueOnce(tokens);

      const result = await authService.validateUser(userDto);
      expect(result).toEqual(tokens);
    });
  });
});
