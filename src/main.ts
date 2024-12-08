import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  if (process.env.NODE_ENV === 'development') {
    app.useLogger(app.get(Logger));
  }

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('FloatSeoul API')
    .setDescription('Backend API documentation for FloatSeoul')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
