import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { GetTalentHandler } from './queries/get-talent/get-talent.handler';
import { GetTalentListHandler } from './queries/get-talent-list/get-talent-list.handler';
import { UpsertTalentHandler } from './commands/upsert-talent/upsert-talent.handler';
import { TalentScoringModule } from '../../infrastructure/services/talent-scoring/talent-scoring.module';

@Module({
  imports: [TalentScoringModule],
  controllers: [TalentController],
  providers: [GetTalentHandler, GetTalentListHandler, UpsertTalentHandler],
})
export class TalentModule {}
