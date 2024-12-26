import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { UpdateMemberHandler } from './commands/update-candidate/update-member.handler';
import { MemberScoringModule } from '../../infrastructure/services/member-scoring/member-scoring.module';
import { GetMemberHandler } from './queries/get-member/get-member.handler';

@Module({
  imports: [MemberScoringModule],
  controllers: [MemberController],
  providers: [UpdateMemberHandler, GetMemberHandler],
})
export class MemberModule {}
