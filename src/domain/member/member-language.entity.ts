import { Cascade, Entity, Enum } from '@mikro-orm/postgresql';
import { ManyToOne } from '@mikro-orm/core';
import { Member } from './member.entity';
import { Language } from '../common/entities/language.entity';
import { LANGUAGE_LEVELS } from '../common/constants';

@Entity()
export class MemberLanguage {
  @ManyToOne(() => Member, {
    primary: true,
    nullable: false,
    cascade: [Cascade.REMOVE],
  })
  public member!: Member;

  @ManyToOne(() => Language, { primary: true })
  public language!: Language;

  @Enum(() => LANGUAGE_LEVELS)
  public level!: number;

  public constructor(member: Member, language: Language, level: number) {
    this.member = member;
    this.language = language;
    this.level = level;
  }
}
