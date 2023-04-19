import { NestFactory } from '@nestjs/core';
import { MovieAppModule } from './movie-app.module';

async function bootstrap() {
  const app = await NestFactory.create(MovieAppModule);
  await app.listen(3000);
}
bootstrap();
