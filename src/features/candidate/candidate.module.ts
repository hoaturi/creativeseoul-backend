import { Module, Provider } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CreateCandidateProfileHandler } from './commands/create-cnadidate-profile/create-candidate-profile.handler';
import { GetCandidateListHandler } from './query/get-candidate-list/get-candidate-list.handler';
import { GetCandidateHandler } from './query/get-candidate/get-candidate.handler';

const handlers: Provider[] = [
  CreateCandidateProfileHandler,
  GetCandidateListHandler,
  GetCandidateHandler,
];

@Module({
  controllers: [CandidateController],
  providers: [...handlers],
})
export class CandidateModule {}
