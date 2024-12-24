import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { UpsertCandidateHandler } from './commands/upsert-candidate/upsert-candidate.handler';

@Module({
  controllers: [CandidateController],
  providers: [UpsertCandidateHandler],
})
export class CandidateModule {}
