import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenModule } from './token/token.module';
import { SharedModule } from '@app/common/rmq/shared.module';

@Module({
  imports: [
    TokenModule,
    SharedModule.registerRmq('USER_SERVICE', process.env.USER_QUEUE),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
