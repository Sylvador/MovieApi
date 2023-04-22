import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import {AtStrategy, GoogleStrategy, RtStrategy, VkontakteStrategy} from './strategies';
import { SharedModule } from '@app/common/rmq/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import {PersonController} from "./person.controller";
import {MovieController} from "./movie.controller";

@Module({
  imports: [
    SharedModule.registerRmq('AUTH_SERVICE', 'auth_queue'),
    SharedModule.registerRmq('USER_SERVICE', 'user_queue'),
    JwtModule.register({ 
      global: true, 
      secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'at-secret' }),
  ],
  controllers: [
    ApiController,
    AuthController,
    MovieController,
    PersonController,
  ],
  providers: [
    ApiService,
    RtStrategy,
    AtStrategy,
    GoogleStrategy,
    VkontakteStrategy,
  ],
})
export class ApiModule {}
