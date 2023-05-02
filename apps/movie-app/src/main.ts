import { NestFactory } from '@nestjs/core';
import { MovieAppModule } from './movie-app.module';
import {SharedService} from "@app/common/rmq/shared.services";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(MovieAppModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions('movie_queue_leha'));
  app.startAllMicroservices();
}
bootstrap();
