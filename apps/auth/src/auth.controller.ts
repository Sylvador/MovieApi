import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from '../../user/src/dto/create-user.dto';
import { Tokens } from '@app/common/types';
import { SignInDto } from '../../user/src/dto/signin.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @MessagePattern('signup')
  async signup(@Payload() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.signup(userDto);
  }

  @MessagePattern('signin')
  async signin(@Payload() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signin(signInDto);
  }

  //Updates refresh token hash on user model and returns both access and refresh tokens
  @MessagePattern('refresh')
  refreshTokens(
    @Payload('userId') userId: number,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  //OAuth validation. If user doesn't exist, creates it.
  @MessagePattern('validateUser')
  validateUser(@Payload() userDto: CreateUserDto): Promise<Tokens> {
    return this.authService.validateUser(userDto);
  }
}
