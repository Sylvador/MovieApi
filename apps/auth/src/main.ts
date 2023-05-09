import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { SharedService } from '@app/common/rmq/shared.services';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions(configService.get<string>('AUTH_QUEUE')));
  app.startAllMicroservices().then(() => console.log(`Microservice AUTH is listening`));
}
bootstrap();
