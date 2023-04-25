import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {

    const { name, emails } = profile

    const user = await firstValueFrom(
      this.authClient.send('validateUser', {email: emails[0].value, username: name.givenName, password: accessToken})
      .pipe(catchError(err => throwError(() => new RpcException(err.response))))
      );
    
    return user;
  }
}