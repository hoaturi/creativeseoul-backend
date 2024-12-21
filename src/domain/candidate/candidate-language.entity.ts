import { Cascade, Entity, Enum } from '@mikro-orm/postgresql';
import { ManyToOne } from '@mikro-orm/core';
import { Candidate } from './candidate.entity';
import { Language } from '../common/entities/language.entity';
import { LANGUAGE_LEVELS } from '../common/constants';

@Entity()
export class CandidateLanguage {
  @ManyToOne(() => Candidate, {
    primary: true,
    nullable: false,
    cascade: [Cascade.REMOVE],
  })
  public candidate!: Candidate;

  @ManyToOne(() => Language, { primary: true })
  public language!: Language;

  @Enum(() => LANGUAGE_LEVELS)
  public level!: number;

  public constructor(candidate: Candidate, language: Language, level: number) {
    this.candidate = candidate;
    this.language = language;
    this.level = level;
  }
}
