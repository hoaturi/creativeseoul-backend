import { Module, Provider } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { GetCandidateListHandler } from './query/get-candidate-list/get-candidate-list.handler';
import { GetCandidateHandler } from './query/get-candidate/get-candidate.handler';
import { CreateCandidateHandler } from './commands/create-candidate/create-candidate.handler';
import { UpdateCandidateHandler } from './commands/update-candidate/update-candidate.handler';

const handlers: Provider[] = [
  CreateCandidateHandler,
  GetCandidateListHandler,
  GetCandidateHandler,
  UpdateCandidateHandler,
];

@Module({
  controllers: [CandidateController],
  providers: [...handlers],
})
export class CandidateModule {}
