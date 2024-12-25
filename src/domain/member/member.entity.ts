import {
  Cascade,
  Collection,
  Entity,
  FullTextType,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  WeightedFullTextValue,
} from '@mikro-orm/postgresql';
import { MemberLanguage } from './member-language.entity';
import { Index, ManyToOne, Unique } from '@mikro-orm/core';
import { City } from '../common/entities/city.entity';
import { Country } from '../common/entities/country.entity';
import { BaseEntity } from '../base.entity';
import { SocialLinks } from './social-links.interface';
import { Candidate } from '../candidate/candidate.entity';

const generateSearchVector = (member: Member): WeightedFullTextValue => ({
  A: [member.title, member.tags?.join(' ')].filter(Boolean).join(' '),
  B: [member.bio].filter(Boolean).join(' '),
  C: [...[...member.languages].map((lang) => lang.language.name)]
    .filter(Boolean)
    .join(' '),
});

@Entity()
export class Member extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Candidate, {
    nullable: true,
    cascade: [Cascade.REMOVE],
  })
  public candidate?: Candidate;

  @Property({ length: 16 })
  @Unique()
  public handle!: string;

  @Property({ length: 64 })
  public fullName?: string;

  @Property({ length: 32, nullable: true })
  public title?: string;

  @Property({ length: 512, nullable: true })
  public bio?: string;

  @Property({ nullable: true })
  public avatarUrl?: string;

  @Property({ nullable: true })
  public tags?: string[];

  @OneToMany(() => MemberLanguage, (cl) => cl.member, {
    orphanRemoval: true,
  })
  public readonly languages: Collection<MemberLanguage> =
    new Collection<MemberLanguage>(this);

  @ManyToOne(() => City, { nullable: true })
  public city?: City;

  @ManyToOne(() => Country, { nullable: true })
  public country?: Country;

  @Property({ type: 'jsonb', nullable: true })
  public socialLinks?: SocialLinks;

  @Property({ nullable: true })
  public qualityScore: number;

  @Property({ nullable: true })
  public promotedAt?: Date;

  @Property({ nullable: true })
  public lastActiveAt?: Date;

  @Index({ type: 'fulltext' })
  @Property({
    type: new FullTextType('english'),
    onCreate: (member: Member) => generateSearchVector(member),
    onUpdate: (member: Member) => generateSearchVector(member),
  })
  public searchVector!: WeightedFullTextValue;

  public constructor(fullName: string, handle: string) {
    super();
    this.fullName = fullName;
    this.handle = handle;
  }
}
