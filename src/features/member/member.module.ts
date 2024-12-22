import { Module, Provider } from '@nestjs/common';
import { MemberController } from './member.controller';
import { CreateMemberHandler } from './commands/create-member/create-member.handler';
import { GetMemberHandler } from './queries/get-member/get-member.handler';
import { UpdateMemberHandler } from './commands/update-candidate/update-member.handler';

const handlers: Provider[] = [
  GetMemberHandler,
  CreateMemberHandler,
  UpdateMemberHandler,
];

@Module({
  controllers: [MemberController],
  providers: [...handlers],
})
export class MemberModule {}
