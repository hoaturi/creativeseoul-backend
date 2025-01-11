import { Module, Provider } from '@nestjs/common';
import { TalentController } from './controllers/talent.controller';
import { GetTalentHandler } from './queries/get-talent/get-talent.handler';
import { GetTalentListHandler } from './queries/get-talent-list/get-talent-list.handler';
import { UpdateTalentHandler } from './commands/upsert-talent/update-talent.handler';
import { TalentScoringModule } from '../../infrastructure/services/talent-scoring/talent-scoring.module';
import { CreateTalentHandler } from './commands/create-talent/create-talent.handler';
import { GetTalentAsMemberHandler } from './queries/get-talent-as-member/get-talent-as-member.handler';
import { MemberController } from './controllers/member.controller';
import { GetTalentAsMemberListHandler } from './queries/get-talent-as-member-list/get-talent-as-member-list.handler';

const providers: Provider[] = [
  GetTalentHandler,
  GetTalentListHandler,
  UpdateTalentHandler,
  CreateTalentHandler,
  GetTalentAsMemberHandler,
  GetTalentAsMemberListHandler,
];

@Module({
  imports: [TalentScoringModule],
  controllers: [TalentController, MemberController],
  providers: [...providers],
})
export class TalentModule {}
