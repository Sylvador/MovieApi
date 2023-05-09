import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { SharedService } from '@app/common/rmq/shared.services';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions(configService.get<string>('USER_QUEUE')));
  app.startAllMicroservices().then(() => console.log(`Microservice USER is listening`));
}
bootstrap();
