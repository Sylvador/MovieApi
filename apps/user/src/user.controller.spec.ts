import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import { InternalServerErrorException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
            logout: jest.fn(),
            updateRtHash: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = {
        userId: 1,
        email: 'test@example.com',
      }

      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(user as unknown as User);

      const result = await userController.getUserById(1);
      expect(result).toEqual(user);
    });

    it('should throw an RpcException on error', async () => {
      const error = new Error('Test error');
      jest.spyOn(userService, 'getUserById').mockRejectedValueOnce(error);

      await expect(userController.getUserById(1)).rejects.toThrow(
        new RpcException(new InternalServerErrorException(error.message)),
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        userId: 1,
        email: 'test@example.com',
      }

      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(user as unknown as User);

      const result = await userController.getUserByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should throw an RpcException on error', async () => {
      const error = new Error('Test error');
      jest.spyOn(userService, 'getUserByEmail').mockRejectedValueOnce(error);

      await expect(userController.getUserByEmail('test@example.com')).rejects.toThrow(
        new RpcException(new InternalServerErrorException(error.message)),
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'test',
        password: 'password',
      };

      const user = {
        email: 'test@example.com',
        hashedPassword: '1234',
      }

      jest.spyOn(userService, 'createUser').mockResolvedValueOnce(user as unknown as User);

      const result = await userController.createUser(userDto);
      expect(result).toEqual(user);
    });

    it('should throw an RpcException on error', async () => {
      const error = new Error('Test error');
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(error);

      await expect(userController.createUser({ email: 'test@example.com', username: 'test', password: 'password' })).rejects.toThrow(
        new RpcException(new InternalServerErrorException(error.message)),
      );
    });
  });

  describe('logout', () => {
    it('should call userService.logout with the correct id', async () => {
      jest.spyOn(userService, 'logout').mockResolvedValueOnce(null);

      await userController.logout(1);
      expect(userService.logout).toHaveBeenCalledWith(1);
    });
  });

  describe('updateRtHash', () => {
    it('should call userService.updateRtHash with the correct payload', async () => {
      const payload = { userId: 1, hashedRt: 'hashedRt' };
      jest.spyOn(userService, 'updateRtHash').mockResolvedValueOnce(null);

      await userController.updateRtHash(payload);
      expect(userService.updateRtHash).toHaveBeenCalledWith(payload.userId, payload.hashedRt);
    });
  });
});
