import { Cascade, Entity, Enum } from '@mikro-orm/postgresql';
import { ManyToOne } from '@mikro-orm/core';
import { Candidate } from './candidate.entity';
import { Language } from '../common/entities/language.entity';
import { LANGUAGE_PROFICIENCY_LEVELS } from '../common/constants';

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

  @Enum(() => LANGUAGE_PROFICIENCY_LEVELS)
  public proficiencyLevel!: number;

  public constructor(
    candidate: Candidate,
    language: Language,
    proficiencyLevel: number,
  ) {
    this.candidate = candidate;
    this.language = language;
    this.proficiencyLevel = proficiencyLevel;
  }
}
