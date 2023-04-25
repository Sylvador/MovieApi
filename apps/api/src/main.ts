import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcExceptionFilter } from '@app/common/exceptions/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix('api')

  const configService = new ConfigService();
  const PORT = configService.get<string>('PORT');
  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('Movie API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.startAllMicroservices();
  await app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
}
bootstrap();
