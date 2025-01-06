import {
  Collection,
  Entity,
  FullTextType,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  WeightedFullTextValue,
} from '@mikro-orm/postgresql';
import { City } from '../common/entities/city.entity';
import { Country } from '../common/entities/country.entity';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { TalentLanguage } from './talent-language.entity';
import { TalentSocialLinks } from './talent-social-links.interface';

const generateSearchVector = (talent: Talent): WeightedFullTextValue => ({
  A: [talent.title, talent.skills?.join(' ')].filter(Boolean).join(' '),

  B: [talent.bio, [...talent.languages].map((lang) => lang.language.label)]
    .filter(Boolean)
    .join(' '),
});

@Entity()
export class Talent extends BaseEntity {
  // Primary key and relations
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => User, (user) => user.talent, {
    owner: true,
    deleteRule: 'cascade',
  })
  public readonly user!: User;

  // Basic profile information
  @Property({ length: 64 })
  public fullName: string;

  @Property({ length: 128 })
  public title!: string;

  @Property({ length: 2048 })
  public bio!: string;

  @Property({ nullable: true })
  public avatarUrl?: string;

  // Location information
  @ManyToOne(() => City, { nullable: true })
  public city?: City;

  @ManyToOne(() => Country)
  public country!: Country;

  // Skills and languages
  @Property({ type: 'array', nullable: true })
  public skills?: string[];

  @OneToMany(() => TalentLanguage, (cl) => cl.talent, {
    orphanRemoval: true,
  })
  public readonly languages = new Collection<TalentLanguage>(this);

  // Employment preferences
  @Property()
  @Index()
  public isAvailable!: boolean;

  @Property()
  @Index()
  public requiresVisaSponsorship!: boolean;

  @Property({ nullable: true })
  @Index()
  public salaryRangeId?: number;

  @Property({ nullable: true })
  @Index()
  public hourlyRateRangeId?: number;

  @Property({ columnType: 'integer[]' })
  @Index()
  public locationTypeIds: number[];

  @Property({ columnType: 'integer[]' })
  @Index()
  public employmentTypeIds: number[];

  // Contact information
  @Property()
  public isContactable!: boolean;

  @Property({ nullable: true })
  public email?: string;

  @Property({ nullable: true })
  public phone?: string;

  @Property({ type: 'jsonb', nullable: true })
  public socialLinks?: TalentSocialLinks;

  // Visibility and status
  @Property()
  public isPublic!: boolean;

  @Property({ nullable: true })
  @Index()
  public qualityScore: number;

  @Property({ nullable: true })
  @Index()
  public promotedAt?: Date;

  @Property({ nullable: true })
  @Index()
  public lastActiveAt?: Date;

  // Search
  @Index({ type: 'fulltext' })
  @Property({
    type: new FullTextType('english'),
    onCreate: (talent: Talent) => generateSearchVector(talent),
    onUpdate: (talent: Talent) => generateSearchVector(talent),
  })
  public searchVector!: WeightedFullTextValue;

  public constructor(
    user: User,
    data: {
      fullName: string;
      requiresVisaSponsorship: boolean;
      isPublic: boolean;
      isAvailable: boolean;
      isContactable: boolean;
      locationTypeIds: number[];
      employmentTypeIds: number[];
      title?: string;
      bio?: string;
      avatarUrl?: string;
      city?: City;
      country?: Country;
      socialLinks?: TalentSocialLinks;
      salaryRangeId?: number;
      hourlyRateRangeId?: number;
      skills?: string[];
      email?: string;
      phone?: string;
    },
  ) {
    super();
    Object.assign(this, { user, ...data });
  }
}
