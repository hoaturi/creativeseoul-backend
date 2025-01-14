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
import { User } from '../user/user.entity';
import { Job } from '../job/job.entity';
import { CompanySize } from '../common/entities/company-size.entity';
import { CompanySocialLinks } from './company-social-links.interface';
import { CreditTransaction } from './credit-transaction.entity';

@Entity()
export class Company {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => User, { nullable: true })
  public user?: User;

  @Property({ length: 64 })
  public name: string;

  @Property({ length: 128, nullable: true })
  public summary?: string;

  @Property({ nullable: true })
  public description?: string;

  @Property({ nullable: true })
  public logoUrl?: string;

  @Property({ unique: true })
  public websiteUrl: string;

  @Property({ length: 64, nullable: true })
  public location?: string;

  @ManyToOne(() => CompanySize, { nullable: true })
  public size?: CompanySize;

  @Property({ type: 'jsonb', nullable: true })
  public socialLinks?: CompanySocialLinks;

  @Property({ nullable: true })
  @Index()
  public customerId?: string;

  @OneToMany(() => Job, (job) => job.company, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  public jobs: Collection<Job> = new Collection(this);

  @Property()
  @Index()
  public isClaimed: boolean;

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
    name: string;
    websiteUrl: string;
    summary?: string;
    description?: string;
    location?: string;
    logoUrl?: string;
    size?: CompanySize;
    socialLinks?: CompanySocialLinks;
    user?: User;
    creditBalance: number;
  }) {
    this.isClaimed = data.isClaimed;
    this.name = data.name;
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
