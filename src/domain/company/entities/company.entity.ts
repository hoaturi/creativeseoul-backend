import {
  Cascade,
  Entity,
  Formula,
  Index,
  ManyToOne,
  PrimaryKey,
} from '@mikro-orm/core';
import {
  Collection,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/postgresql';
import { User } from '../../user/user.entity';
import { Job } from '../../job/entities/job.entity';
import { CompanySize } from './company-size.entity';
import { CompanySocialLinks } from '../company-social-links.interface';
import { CreditTransaction } from './credit-transaction.entity';
import { BaseEntity } from '../../base.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => User, { nullable: true })
  public user?: User;

  @Property({ length: 64, unique: true })
  public name: string;

  @Property({ length: 64 })
  public slug: string;

  @Property({ length: 128 })
  public summary: string;

  @Property({ type: 'text' })
  public description: string;

  @Property({ nullable: true })
  public logoUrl?: string;

  @Property({ unique: true })
  public websiteUrl: string;

  @Property({ length: 64 })
  public location: string;

  @ManyToOne(() => CompanySize)
  public size: CompanySize;

  @Property({ type: 'jsonb' })
  public socialLinks: CompanySocialLinks;

  @Property({ nullable: true })
  @Index()
  public customerId?: string;

  @Formula(
    (alias) =>
      `EXISTS (SELECT 1 FROM sponsorship s WHERE s.company_id = ${alias}.id AND s.current_period_end >= CURRENT_TIMESTAMP)`,
  )
  public readonly isSponsor!: boolean;

  @OneToMany(() => Job, (job) => job.company, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  public jobs: Collection<Job> = new Collection(this);

  @Property()
  @Index()
  public isClaimed: boolean;

  @Property()
  @Index()
  public isActive: boolean;

  @Formula(
    (alias) =>
      `(SELECT COUNT(*)::int FROM job j WHERE j.company_id = ${alias}.id)`,
  )
  public readonly totalJobs!: number;

  @Property({ nullable: true })
  public creditBalance: number;

  @OneToMany(
    () => CreditTransaction,
    (creditTransaction) => creditTransaction.company,
    {
      cascade: [Cascade.ALL],
    },
  )
  public readonly creditTransactions: Collection<CreditTransaction> =
    new Collection(this);

  public constructor(data: {
    isClaimed: boolean;
    isActive: boolean;
    name: string;
    slug: string;
    websiteUrl: string;
    summary: string;
    description: string;
    location: string;
    logoUrl?: string;
    size: CompanySize;
    socialLinks: CompanySocialLinks;
    user?: User;
    creditBalance: number;
  }) {
    super();
    this.isClaimed = data.isClaimed;
    this.isActive = data.isActive;
    this.name = data.name;
    this.slug = data.slug;
    this.summary = data.summary;
    this.description = data.description;
    this.location = data.location;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
    this.size = data.size;
    this.socialLinks = data.socialLinks;
    this.user = data.user;
    this.creditBalance = data.creditBalance;
  }
}
