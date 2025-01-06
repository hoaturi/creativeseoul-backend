import { Cascade, Entity, Enum } from '@mikro-orm/postgresql';
import { ManyToOne } from '@mikro-orm/core';
import { Language } from '../common/entities/language.entity';
import { LANGUAGE_LEVELS } from '../common/constants';
import { Talent } from './talent.entity';

@Entity()
export class TalentLanguage {
  @ManyToOne(() => Talent, {
    primary: true,
    nullable: false,
    cascade: [Cascade.REMOVE],
  })
  public talent!: Talent;

  @ManyToOne(() => Language, { primary: true })
  public language!: Language;

  @Enum(() => LANGUAGE_LEVELS)
  public level!: number;

  public constructor(language: Language, level: number) {
    this.language = language;
    this.level = level;
  }
}
