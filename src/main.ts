import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { sessionConfig } from './config/session.config';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());
  app.use(session(sessionConfig()));

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
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
