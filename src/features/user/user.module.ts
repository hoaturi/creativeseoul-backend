import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChangePasswordHandler } from './commands/change-password/change-password.handler';
import { DeleteAccountHandler } from './commands/delete-account/delete-account.handler';

@Module({
  controllers: [UserController],
  providers: [ChangePasswordHandler, DeleteAccountHandler],
})
export class UserModule {}
