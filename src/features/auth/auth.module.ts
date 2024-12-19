import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BullModule } from '@nestjs/bullmq';
import { QueueType } from '../../infrastructure/queue/queue-type.enum';
import {
  ForgotPasswordHandler,
  LoginHandler,
  ResetPasswordHandler,
  SignupHandler,
  VerifyEmailHandler,
} from './commands';

const handlers: Provider[] = [
  SignupHandler,
  VerifyEmailHandler,
  LoginHandler,
  ForgotPasswordHandler,
  ResetPasswordHandler,
];

@Module({
  imports: [BullModule.registerQueue({ name: QueueType.EMAIL })],
  controllers: [AuthController],
  providers: [...handlers],
})
export class AuthModule {}
