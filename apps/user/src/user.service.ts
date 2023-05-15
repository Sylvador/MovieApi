import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) { }

  async getUserById(id: number): Promise<User> {
    return this.userRepository.findByPk(id);
  }

  async updateRtHash(userId: number, hashedRt: string): Promise<void> {
    this.userRepository.update({ hashedRt }, { where: { userId } });
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const hashedPassword = await argon.hash(userDto.password);
    return this.userRepository.create({ ...userDto, hashedPassword });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async logout(userId: number): Promise<void> {
    this.userRepository.update({ hashedRt: null }, { where: { userId } });
  }
}