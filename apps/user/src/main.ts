import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { SharedService } from '@app/common/rmq/shared.services';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.enableCors();

  const sharedService = app.get(SharedService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(sharedService.getRmqOptions('user_queue'));
  app.startAllMicroservices().then(() => console.log(`Microservice USER is listening`));
}
bootstrap();
