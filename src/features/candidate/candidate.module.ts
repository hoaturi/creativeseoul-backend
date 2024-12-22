import { Module, Provider } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { GetCandidateHandler } from './query/get-candidate/get-candidate.handler';
import { UpdateCandidateHandler } from './commands/update-candidate/update-candidate.handler';

const handlers: Provider[] = [UpdateCandidateHandler, GetCandidateHandler];

@Module({
  controllers: [CandidateController],
  providers: [...handlers],
})
export class CandidateModule {}
