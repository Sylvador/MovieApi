import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { Tokens } from '@app/common/types';
import { SignInDto } from 'apps/user/src/dto/signin.dto';
import { SharedService } from '@app/common/rmq/shared.services';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @MessagePattern('signup')
  async signup(@Payload() userDto: CreateUserDto, @Ctx() ctx): Promise<Tokens> {
    return this.authService.signup(userDto);
  }

  @MessagePattern('signin')
  async signin(@Payload() signInDto: SignInDto, @Ctx() ctx): Promise<Tokens> {
    return this.authService.signin(signInDto);
  }

  @MessagePattern('refresh')
  refreshTokens(
    @Payload('userId') userId: number,
    @Payload('refreshToken') refreshToken: string,
    @Ctx() ctx,
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  @MessagePattern('validateUser')
  validateUser(@Payload() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.validateUser(userDto);
  }
}
