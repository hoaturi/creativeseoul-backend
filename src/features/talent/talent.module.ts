import { Module, Provider } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { GetTalentHandler } from './queries/get-talent/get-talent.handler';
import { GetTalentListHandler } from './queries/get-talent-list/get-talent-list.handler';
import { UpdateTalentHandler } from './commands/upsert-talent/update-talent.handler';
import { TalentScoringModule } from '../../infrastructure/services/talent-scoring/talent-scoring.module';
import { CreateTalentHandler } from './commands/create-talent/create-talent.handler';

const providers: Provider[] = [
  GetTalentHandler,
  GetTalentListHandler,
  UpdateTalentHandler,
  CreateTalentHandler,
];

@Module({
  imports: [TalentScoringModule],
  controllers: [TalentController],
  providers: [...providers],
})
export class TalentModule {}
