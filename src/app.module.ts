import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { mikroOrmConfig } from './config/mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { applicationConfig } from './config/application.config';
import { BullModule } from '@nestjs/bullmq';
import { bullMqConfig } from './config/bull-mq.config';
import { AuthModule } from './features/auth/auth.module';
import { EmailProcessor } from './infrastructure/queue/email/email.processor';
import { EmailModule } from './infrastructure/services/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [applicationConfig],
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    BullModule.forRoot(bullMqConfig),
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailProcessor],
})
export class AppModule {}
