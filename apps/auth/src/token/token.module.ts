import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@app/common/rmq/shared.module';

@Module({
  controllers: [],
  providers: [TokenService],
  imports: [
    JwtModule.register({ 
      global: true, 
      secret: process.env.ACCESS_TOKEN_SECRET_KEY || 'at-secret'
    }),
    SharedModule.registerRmq('USER_SERVICE', process.env.USER_QUEUE),
  ],
  exports: [
    TokenService,
  ]
})
export class TokenModule {}
