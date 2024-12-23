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
import { User } from '../user/user.entity';
import { MemberLanguage } from './member-language.entity';
import { Index, ManyToOne } from '@mikro-orm/core';
import { City } from '../common/entities/city.entity';
import { Country } from '../common/entities/country.entity';
import { BaseEntity } from '../base.entity';

const generateSearchVector = (member: Member): WeightedFullTextValue => ({
  A: [member.title, member.tags?.join(' ')].filter(Boolean).join(' '),
  B: member.bio,
  C: [
    member.city?.name,
    member.country.name,
    ...[...member.languages].map((lang) => lang.language.name),
  ]
    .filter(Boolean)
    .join(' '),
});

@Entity()
export class Member extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne()
  public readonly user!: User;

  @Property({ length: 64 })
  public fullName!: string;

  @Property({ length: 32 })
  public title!: string;

  @Property({ length: 512 })
  public bio!: string;

  @Property()
  public avatarUrl?: string;

  @Property({ nullable: true })
  public tags?: string[];

  @ManyToOne(() => City, { nullable: true })
  public city?: City;

  @ManyToOne(() => Country)
  public country!: Country;

  @OneToMany(() => MemberLanguage, (cl) => cl.member, {
    orphanRemoval: true,
  })
  public languages = new Collection<MemberLanguage>(this);

  @Property({ type: 'float' })
  public qualityScore: number;

  @Property({ nullable: true })
  public promotedAt: Date;

  @Property({ nullable: true })
  public lastActiveAt: Date;

  @Index({ type: 'fulltext' })
  @Property({
    type: new FullTextType('english'),
    onCreate: (member: Member) => generateSearchVector(member),
    onUpdate: (member: Member) => generateSearchVector(member),
  })
  public searchVector!: WeightedFullTextValue;

  public constructor(
    user: User,
    fullName: string,
    city: City,
    country: Country,
    title: string,
    bio: string,
    AvatarUrl?: string,
    tags?: string[],
  ) {
    super();
    this.user = user;
    this.fullName = fullName;
    this.city = city;
    this.country = country;
    this.title = title;
    this.bio = bio;
    this.avatarUrl = AvatarUrl;
    this.tags = tags;
  }
}
