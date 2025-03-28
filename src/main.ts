import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { sessionConfig } from './config/session.config';
import { GlobalCustomExceptionFilter } from './common/exceptions/global-custom-exception.filter';
import { TalentActivityInterceptor } from './infrastructure/interceptors/talent-activity-interceptor';
import { TalentActivityService } from './infrastructure/services/talent-activity/talent-activity.service';
import fs from 'fs';

async function bootstrap(): Promise<void> {
  let httpsOptions: { cert: Buffer; key: Buffer } | undefined = undefined;

  if (process.env.NODE_ENV === 'production') {
    httpsOptions = {
      cert: fs.readFileSync('/app/ssl/creativeseoul.pem'),
      key: fs.readFileSync('/app/ssl/creativeseoul.key'),
    };
  }

  const app = await NestFactory.create(AppModule, {
    ...(httpsOptions && { httpsOptions }),
    bufferLogs: true,
    rawBody: true,
  });

  app.enableCors({
    origin: process.env.CLIENT_BASE_URL?.split(', '),
    credentials: true,
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
    new TalentActivityInterceptor(app.get(TalentActivityService)),
  );

  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? '0.0.0.0');
}

bootstrap();
