import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { AtStrategy, GoogleStrategy, RtStrategy, VkontakteStrategy } from './strategies';
import { SharedModule } from '../../../libs/common/src/rmq/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PersonController } from "./person.controller";
import { MovieController } from "./movie.controller";
import { AdminController } from './admin.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', 'auth_queue'),
    SharedModule.registerRmq('USER_SERVICE', 'user_queue'),
    SharedModule.registerRmq('MOVIE_SERVICE', 'movie_queue_leha'),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'at-secret'
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
  controllers: [
    AuthController,
    MovieController,
    PersonController,
    AdminController,
  ],
  providers: [
    ApiService,
    RtStrategy,
    AtStrategy,
    GoogleStrategy,
    VkontakteStrategy,
  ],
})
export class ApiModule { }
