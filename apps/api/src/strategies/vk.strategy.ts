// passport-vkontakte

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {
    super({
      clientID: process.env.VK_ID,
      clientSecret: process.env.VK_SECRET,
      callbackURL: process.env.VK_CALLBACK,
      scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, params, profile, done) => {
      const user = await firstValueFrom(
        this.authClient.send('validateUser', {email: profile.emails[0].value, username: profile.displayName, password: accessToken})
        .pipe(catchError(err => throwError(() => new RpcException(err.response))))
        );
      done(null, user);
    });
  }
  
}
