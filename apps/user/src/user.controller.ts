import { Controller, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, EventPattern, Payload, Ctx } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';
import { RpcException } from '@nestjs/microservices';
import { User } from './user.model';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    ) { }

  @MessagePattern('get_user_by_id')
  async getUserById(@Payload() id: number): Promise<User> {
    try {
      return this.userService.getUserById(id);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('get_user_by_email')
  async getUserByEmail(@Payload() email: string): Promise<User> {
    try {
      return this.userService.getUserByEmail(email);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('createUser')
  async createUser(@Payload() userDto: CreateUserDto): Promise<User> {
    try {
      return this.userService.createUser(userDto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @EventPattern('logout')
  async logout(@Payload() id: number): Promise<void> {
    try {
      this.userService.logout(id);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @EventPattern('updateRtHash')
  async updateRtHash(@Payload() payload: { userId: number; hashedRt: string }): Promise<void> {
    try {
      this.userService.updateRtHash(payload.userId, payload.hashedRt);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
