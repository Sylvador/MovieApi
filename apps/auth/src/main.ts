import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { SharedService } from '@app/common/rmq/shared.services';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions('auth_queue'));
  app.startAllMicroservices().then(() => console.log(`Microservice AUTH is listening`));
}
bootstrap();
