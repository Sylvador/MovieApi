import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../../user/src/dto/create-user.dto';
import { Tokens } from '@app/common/types';
import { SignInDto } from '../../user/src/dto/signin.dto';
import { RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('signup')
  async signup(@Payload() userDto: CreateUserDto): Promise<Tokens> {
    try {
      return await this.authService.signup(userDto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  @MessagePattern('signin')
  async signin(@Payload() signInDto: SignInDto): Promise<Tokens> {
    try {
      return await this.authService.signin(signInDto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  //Updates refresh token hash on user model and returns both access and refresh tokens
  @MessagePattern('refresh')
  async refreshTokens(
    @Payload('userId') userId: number,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    try {
      return await this.authService.refresh(userId, refreshToken);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  //OAuth validation. If user doesn't exist, creates it.
  @MessagePattern('validateUser')
  async validateUser(@Payload() userDto: CreateUserDto): Promise<Tokens> {
    try {
      return await this.authService.validateUser(userDto);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }
}
