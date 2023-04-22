import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AtStrategy, RtStrategy } from './strategies';
import { SharedModule } from '@app/common/rmq/shared.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

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
  ],
  providers: [
    ApiService,
    RtStrategy,
    AtStrategy
  ],
})
export class ApiModule {}
