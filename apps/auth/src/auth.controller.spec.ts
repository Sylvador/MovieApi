// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { SignInDto } from 'apps/user/src/dto/signin.dto';
import { Tokens } from '@app/common/types';

const mockAuthService = () => ({
  signup: jest.fn(),
  signin: jest.fn(),
  refresh: jest.fn(),
  validateUser: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: ReturnType<typeof mockAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup with CreateUserDto and return Tokens', async () => {
      const userDto: CreateUserDto = { 
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };
      authService.signup.mockResolvedValue(tokens);

      const result = await authController.signup(userDto);

      expect(authService.signup).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(tokens);
    });
  });

  describe('signin', () => {
    it('should call authService.signin with SignInDto and return Tokens', async () => {
      const signInDto: SignInDto = {
        email: 'user@mail.ru',
        password: '1234',
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };
      authService.signin.mockResolvedValue(tokens);

      const result = await authController.signin(signInDto);

      expect(authService.signin).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(tokens);
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refresh with userId and refreshToken and return Tokens', async () => {
      const userId = 1;
      const refreshToken = 'some_refresh_token';
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };
      authService.refresh.mockResolvedValue(tokens);

      const result = await authController.refreshTokens(userId, refreshToken);

      expect(authService.refresh).toHaveBeenCalledWith(userId, refreshToken);
      expect(result).toEqual(tokens);
    });
  });

  describe('validateUser', () => {
    it('should call authService.validateUser with CreateUserDto and return Tokens', async () => {
      const userDto: CreateUserDto = {
        email: 'user@mail.ru',
        password: '1234',
        username: 'user'
      };
      const tokens: Tokens = { accessToken: 'at', refreshToken: 'rt' };
      authService.validateUser.mockResolvedValue(tokens);

      const result = await authController.validateUser(userDto);

      expect(authService.validateUser).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(tokens);
    });
  });
});
