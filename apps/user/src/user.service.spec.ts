import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';

jest.mock('argon2');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            update: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = {
        userId: 1,
        email: 'test@example.com',
      }

      jest.spyOn(userService['userRepository'], 'findByPk').mockResolvedValue(user as unknown as User);

      const result = await userService.getUserById(1);
      expect(result).toEqual(user);
    });
  });

  describe('updateRtHash', () => {
    it('should update the hashedRt for a user', async () => {
      const updateSpy = jest.spyOn(userService['userRepository'], 'update').mockResolvedValue(null);

      await userService.updateRtHash(1, 'hashedRt');
      expect(updateSpy).toHaveBeenCalledWith({ hashedRt: 'hashedRt' }, { where: { userId: 1 } });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'test',
        password: 'password',
      };

      const hashedPassword = 'hashedPassword';
      (argon.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const user = {
        email: 'test@example.com',
        hashedPassword: '1234',
      }

      jest.spyOn(userService['userRepository'], 'create').mockResolvedValue(user);

      const result = await userService.createUser(userDto);
      expect(result).toEqual(user);
      expect(argon.hash).toHaveBeenCalledWith(userDto.password);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        userId: 1,
        email: 'test@example.com',
      }

      jest.spyOn(userService['userRepository'], 'findOne').mockResolvedValue(user as unknown as User);

      const result = await userService.getUserByEmail('test@example.com');
      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should set hashedRt to null for a user', async () => {
      const updateSpy = jest.spyOn(userService['userRepository'], 'update').mockResolvedValue(null);

      await userService.logout(1);
      expect(updateSpy).toHaveBeenCalledWith({ hashedRt: null }, { where: { userId: 1 } });
    });
  });
});
