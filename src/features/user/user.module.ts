import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChangePasswordHandler } from './commands/change-password/change-password.handler';

@Module({
  controllers: [UserController],
  providers: [ChangePasswordHandler],
})
export class UserModule {}
