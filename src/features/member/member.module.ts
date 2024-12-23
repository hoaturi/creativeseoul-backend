import { Module, Provider } from '@nestjs/common';
import { MemberController } from './member.controller';
import { CreateMemberHandler } from './commands/create-member/create-member.handler';
import { GetMemberHandler } from './queries/get-member/get-member.handler';
import { UpdateMemberHandler } from './commands/update-candidate/update-member.handler';
import { MemberScoringModule } from '../../infrastructure/services/member-scoring/member-scoring.module';

const handlers: Provider[] = [
  GetMemberHandler,
  CreateMemberHandler,
  UpdateMemberHandler,
];

@Module({
  imports: [MemberScoringModule],
  controllers: [MemberController],
  providers: [...handlers],
})
export class MemberModule {}
