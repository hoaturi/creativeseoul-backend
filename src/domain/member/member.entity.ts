import {
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
import { Cascade, Index, ManyToOne, Unique } from '@mikro-orm/core';
import { City } from '../common/entities/city.entity';
import { Country } from '../common/entities/country.entity';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { Professional } from '../professional/professional.entity';
import { MemberSocialLinks } from './member-social-links.interface';

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

  @OneToOne(() => User, (user) => user.member, {
    owner: true,
    deleteRule: 'cascade',
  })
  public readonly user!: User;

  @OneToOne(() => Professional, (professional) => professional.member, {
    nullable: true,
    cascade: [Cascade.REMOVE],
  })
  public professional?: Professional;

  @Property({ length: 16 })
  @Unique()
  public handle!: string;

  @Property({ length: 64 })
  public fullName: string;

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
  public socialLinks?: MemberSocialLinks;

  @Property({ nullable: true })
  @Index()
  public qualityScore: number;

  @Property({ nullable: true })
  @Index()
  public promotedAt?: Date;

  @Property({ nullable: true })
  @Index()
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
