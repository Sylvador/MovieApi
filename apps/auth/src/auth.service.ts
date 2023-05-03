import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TokenService } from './token/token.service';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';
import { Tokens } from '@app/common/types';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { User } from 'apps/user/src/user.model';
import { SignInDto } from 'apps/user/src/dto/signin.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async signup(userDto: CreateUserDto): Promise<Tokens> {
    try {
      console.log('AUTH SERVICE')
      console.log(userDto)
      const candidate = await firstValueFrom(this.userClient.send('get_user_by_email', userDto.email));
      if (candidate) {
        throw new RpcException(new BadRequestException('Пользователь с таким email уже существует'));
      }
      const user: User = await firstValueFrom(this.userClient.send('createUser', userDto));
      console.log(user);
      const tokens = await this.tokenService.generateTokens(user);
      this.tokenService.updateRtHash(user.userId, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(new InternalServerErrorException(error.message));
    }
  }

  async signin(signInDto: SignInDto): Promise<Tokens> {
    const user: User = await firstValueFrom(this.userClient.send('get_user_by_email', signInDto.email));

    const passwordMatches = await argon.verify(user.hashedPassword, signInDto.password);

    if (!passwordMatches || !user) {
      throw new RpcException(new ForbiddenException('Invalid credentials'));
    }

    const tokens = await this.tokenService.generateTokens(user);
    this.tokenService.updateRtHash(user.userId, tokens.refreshToken);

    return tokens;
  }

  refresh(userId: number, rt: string): Promise<Tokens> {
    return this.tokenService.refreshTokens(userId, rt);
  }

  async validateUser(userDto: CreateUserDto): Promise<Tokens> {
    const user: User = await firstValueFrom(this.userClient.send('get_user_by_email', userDto.email));

    if(user) {
      const tokens = await this.tokenService.generateTokens(user);
      this.tokenService.updateRtHash(user.userId, tokens.refreshToken);

      return tokens;
    }

    return this.signup(userDto);
  }
}
