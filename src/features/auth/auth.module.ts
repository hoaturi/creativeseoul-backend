import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../../infrastructure/queue/queue-type.enum';
import {
  ForgotPasswordHandler,
  LoginHandler,
  ResetPasswordHandler,
  SignUpHandler,
  VerifyEmailHandler,
} from './commands';

const handlers: Provider[] = [
  SignUpHandler,
  VerifyEmailHandler,
  LoginHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
];

@Module({
  imports: [JwtModule, BullModule.registerQueue({ name: QueueType.EMAIL })],
  controllers: [AuthController],
  providers: [...handlers],
})
export class AuthModule {}
