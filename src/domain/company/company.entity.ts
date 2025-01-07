import { Cascade, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
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

@Entity()
export class Company {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => User, { nullable: true })
  public user?: User;

  @Property({ length: 64 })
  public name!: string;

  @Property({ length: 128, nullable: true })
  public summary?: string;

  @Property({ nullable: true })
  public description?: string;

  @Property({ type: 'array', nullable: true })
  public languages?: string[];

  @Property({ nullable: true })
  public logoUrl?: string;

  @Property({ unique: true, nullable: true })
  public websiteUrl?: string;

  @Property({ length: 64, nullable: true })
  public location?: string;

  @ManyToOne(() => CompanySize, { nullable: true })
  public size?: CompanySize;

  @Property({ type: 'jsonb', nullable: true })
  public socialLinks?: CompanySocialLinks;

  @OneToMany(() => Job, (job) => job.company, {
    cascade: [Cascade.REMOVE],
    orphanRemoval: true,
  })
  public jobs: Collection<Job> = new Collection(this);

  public constructor(
    data: {
      name: string;
      summary: string;
      description: string;
      languages: string[];
      location: string;
      logoUrl?: string;
      websiteUrl?: string;
      size?: CompanySize;
      socialLinks?: CompanySocialLinks;
    },
    user?: User,
  ) {
    this.name = data.name;
    this.summary = data.summary;
    this.description = data.description;
    this.languages = data.languages;
    this.location = data.location;
    this.logoUrl = data.logoUrl;
    this.websiteUrl = data.websiteUrl;
    this.size = data.size;
    this.socialLinks = data.socialLinks;
    this.user = user;
  }
}
