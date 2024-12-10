import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChangePasswordHandler } from './commands/change-password/change-password.handler';
import { ChangeUsernameHandler } from './commands/change-username/change-username.handler';
import { GetCurrentUserHandler } from './query/get-current-user/get-current-user.handler';

const handlers = [
  ChangePasswordHandler,
  ChangeUsernameHandler,
  GetCurrentUserHandler,
];

@Module({
  controllers: [UserController],
  providers: [...handlers],
})
export class UserModule {}
