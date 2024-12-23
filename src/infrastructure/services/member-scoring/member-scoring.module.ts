import { Module } from '@nestjs/common';
import { MemberScoringService } from './member-scoring.service';

@Module({
  providers: [MemberScoringService],
  exports: [MemberScoringService],
})
export class MemberScoringModule {}
