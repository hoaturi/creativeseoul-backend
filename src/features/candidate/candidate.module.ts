import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CreateCandidateProfileHandler } from './commands/create-candidate-profile.handler';
import { GetCandidateListHandler } from './query/get-candidate-list.handler';

@Module({
  controllers: [CandidateController],
  providers: [CreateCandidateProfileHandler, GetCandidateListHandler],
})
export class CandidateModule {}
