import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { Tokens, JwtPayload } from '@app/common/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as argon from 'argon2';
import { firstValueFrom } from 'rxjs';
import { User } from 'apps/user/src/user.model';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async generateTokens(tokenDto: CreateTokenDto): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: tokenDto.userId,
      email: tokenDto.email,
      isAdmin: tokenDto.isAdmin
    }
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        jwtPayload,
        {
          expiresIn: '15m',
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET_KEY'),
        }),
      this.jwtService.signAsync(
        jwtPayload,
        {
          expiresIn: '7d',
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET_KEY'),
        }
        )
      ]);
      return {
      accessToken,
      refreshToken
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user: User = await firstValueFrom(this.userClient.send('get_user_by_id', userId));

    if (!user?.hashedRt) {
      console.log(userId)
      throw new RpcException(new ForbiddenException('Invalid Credentials'));
    }
    const rtMatches = argon.verify(user.hashedRt, rt);
    if (!rtMatches) {
      throw new RpcException(new ForbiddenException('Invalid Credentials'));
    }
    const tokens = await this.generateTokens(user);
    await this.updateRtHash(userId, tokens.refreshToken);

    return tokens;
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hashedRt = await argon.hash(rt);
    this.userClient.emit('updateRtHash', { userId, hashedRt });
  }
}
