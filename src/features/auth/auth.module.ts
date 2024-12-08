import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignUpHandler } from './commands/signUp/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../domain/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../../infrastructure/queue/queue-type.enum';
import { VerifyEmailHandler } from './commands/verifyEmail/verify-email.handler';
import { LoginHandler } from './commands/login/login.handler';

const handlers: Provider[] = [SignUpHandler, VerifyEmailHandler, LoginHandler];

@Module({
  imports: [
    CqrsModule,
    MikroOrmModule.forFeature([User]),
    JwtModule,
    BullModule.registerQueue({ name: QueueType.EMAIL }),
  ],
  controllers: [AuthController],
  providers: [...handlers],
})
export class AuthModule {}
