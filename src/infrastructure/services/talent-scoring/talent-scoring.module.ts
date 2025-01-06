import { Module } from '@nestjs/common';
import { TalentScoringService } from './talent-scoring.service';

@Module({
  providers: [TalentScoringService],
  exports: [TalentScoringService],
})
export class TalentScoringModule {}
