import { NestFactory } from '@nestjs/core';
import { MovieAppModule } from './movie-app.module';
import {SharedService} from "@app/common/rmq/shared.services";
import {ValidationPipe} from "@nestjs/common";
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(MovieAppModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  const configService = app.get(ConfigService);
  
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions(configService.get<string>('MOVIE_QUEUE')));
  app.startAllMicroservices();
}
bootstrap();
