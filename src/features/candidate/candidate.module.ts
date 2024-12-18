import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CreateCandidateProfileHandler } from './commands/create-candidate-profile.handler';

@Module({
  controllers: [CandidateController],
  providers: [CreateCandidateProfileHandler],
})
export class CandidateModule {}
