import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { sessionConfig } from './config/session.config';
import { GlobalCustomExceptionFilter } from './common/exceptions/global-custom-exception.filter';
import { UserActivityInterceptor } from './infrastructure/interceptors/user-activity.interceptor';
import { TalentActivityService } from './infrastructure/services/talent-activity/talent-activity.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  app.enableCors({
    origin: process.env.CLIENT_BASE_URL,
  });

  app.use(cookieParser());
  app.use(session(sessionConfig()));

  if (process.env.NODE_ENV === 'production') {
    app.useLogger(app.get(Logger));
  }

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('CreativeSeoul API')
    .setDescription('Backend API documentation for CreativeSeoul')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalCustomExceptionFilter());
  app.useGlobalInterceptors(
    new UserActivityInterceptor(app.get(TalentActivityService)),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
