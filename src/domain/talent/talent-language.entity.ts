import { Cascade, Entity } from '@mikro-orm/postgresql';
import { ManyToOne } from '@mikro-orm/core';
import { Language } from '../common/entities/language.entity';
import { Talent } from './talent.entity';
import { LanguageLevel } from '../common/entities/language-level.entity';

@Entity()
export class TalentLanguage {
  @ManyToOne(() => Talent, {
    primary: true,
    nullable: false,
    cascade: [Cascade.REMOVE],
  })
  public readonly talent!: Talent;

  @ManyToOne(() => Language, { primary: true })
  public readonly language!: Language;

  @ManyToOne(() => LanguageLevel)
  public readonly level!: LanguageLevel;

  public constructor(language: Language, level: LanguageLevel) {
    this.language = language;
    this.level = level;
  }
}
