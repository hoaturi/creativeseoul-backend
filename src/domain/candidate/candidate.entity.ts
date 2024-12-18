import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { JobCategory } from '../common/entities/job-category.entity';
import { WorkLocationType } from '../common/entities/work-location-type.entity';
import { EmploymentType } from '../common/entities/employment-type.entity';
import { CandidateLanguage } from './candidate-language.entity';

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne()
  public readonly user!: User;

  @Property({ length: 64 })
  public fullName!: string;

  @Property({ length: 128 })
  public location!: string;

  @Property({ length: 128 })
  public title!: string;

  @Property()
  public bio!: string;

  @Property()
  public profilePictureUrl?: string;

  @Property()
  public resumeUrl?: string;

  @ManyToMany(() => JobCategory)
  public preferredCategories = new Collection<JobCategory>(this);

  @ManyToMany(() => WorkLocationType)
  public preferredWorkLocations = new Collection<WorkLocationType>(this);

  @OneToMany(() => CandidateLanguage, (cl) => cl.candidate)
  public languages = new Collection<CandidateLanguage>(this);

  @ManyToMany(() => EmploymentType)
  public preferredEmploymentTypes = new Collection<EmploymentType>(this);

  @Property()
  public isAvailable!: boolean;

  public constructor(
    user: User,
    fullName: string,
    location: string,
    title: string,
    bio: string,
    isAvailable: boolean,
    profilePictureUrl?: string,
    resumeUrl?: string,
  ) {
    super();
    this.user = user;
    this.fullName = fullName;
    this.location = location;
    this.title = title;
    this.bio = bio;
    this.isAvailable = isAvailable;
    this.profilePictureUrl = profilePictureUrl;
    this.resumeUrl = resumeUrl;
  }
}
