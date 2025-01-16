import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { applicationConfig } from './config/application.config';
import { AuthModule } from './features/auth/auth.module';
import { LoggerModule } from 'nestjs-pino';
import mikroOrmConfig from './config/mikro-orm.config';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from './features/user/user.module';
import { TalentModule } from './features/talent/talent.module';
import { CompanyModule } from './features/company/company.module';
import { PaymentModule } from './features/payment/payment.module';
import { JobModule } from './features/job/job.module';
import { TalentActivityModule } from './infrastructure/services/talent-activity/talent-activity.module';
import { BullModule } from '@nestjs/bullmq';
import { bullMqConfig } from './config/bull-mq.config';
import { QueuesModule } from './infrastructure/queues/queues.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            {
              target: '@autotelic/pino-seq-transport',
              options: {
                serverUrl: process.env.SEQ_URL,
                apiKey: process.env.SEQ_API_KEY,
              },
            },
          ],
        },
        autoLogging: false,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      load: [applicationConfig],
    }),
    BullModule.forRoot(bullMqConfig),
    CqrsModule.forRoot(),
    MikroOrmModule.forRoot(mikroOrmConfig),
    AuthModule,
    UserModule,
    TalentModule,
    CompanyModule,
    PaymentModule,
    JobModule,
    TalentActivityModule,
    QueuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
