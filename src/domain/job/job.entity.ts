import { BaseEntity } from '../base.entity';
import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { Company } from '../company/company.entity';
import { Category } from '../common/entities/category.entity';
import { EmploymentType } from '../common/entities/employment-type.entity';
import { SeniorityLevel } from '../common/entities/seniority-level.entity';
import { WorkLocationType } from '../common/entities/work-location-type.entity';
import { LanguageLevel } from '../common/entities/language-level.entity';

@Entity()
export class Job extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  // Basic Info
  @Property({ length: 64 })
  public title!: string;

  @Property()
  public description!: string;

  @ManyToOne(() => Company)
  public company!: Company;

  // Job Details
  @ManyToOne(() => Category)
  public category!: Category;

  @ManyToOne(() => EmploymentType)
  public employmentType!: EmploymentType;

  @ManyToOne(() => SeniorityLevel)
  public seniorityLevel!: SeniorityLevel;

  @ManyToOne(() => WorkLocationType)
  public workLocationType!: WorkLocationType;

  @Property({ length: 64 })
  public location?: string;

  // Compensation
  @Property({ nullable: true })
  public minSalary?: number;

  @Property({ nullable: true })
  public maxSalary?: number;

  // Requirements
  @Property({ type: 'array', nullable: true })
  public tags?: string[];

  @ManyToOne(() => LanguageLevel)
  public koreanLevel!: LanguageLevel;

  @ManyToOne(() => LanguageLevel)
  public englishLevel!: LanguageLevel;

  @Property()
  public visaSponsorship!: boolean;

  @Property()
  public residentOnly!: boolean;

  // Application
  @Property()
  public applicationUrl!: string;

  // Status
  @Property()
  public isPublished!: boolean;

  @Property()
  public isFeatured!: boolean;

  @Property()
  public applicationClickCount!: number;

  public constructor(data: {
    company: Company;
    title: string;
    description: string;
    category: Category;
    employmentType: EmploymentType;
    seniorityLevel: SeniorityLevel;
    workLocationType: WorkLocationType;
    location?: string;
    minSalary?: number;
    maxSalary?: number;
    tags?: string[];
    koreanLevel: LanguageLevel;
    englishLevel: LanguageLevel;
    visaSponsorship: boolean;
    residentOnly: boolean;
    applicationUrl: string;
    isPublished: boolean;
    isFeatured: boolean;
    applicationClickCount: number;
  }) {
    super();
    this.company = data.company;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.employmentType = data.employmentType;
    this.seniorityLevel = data.seniorityLevel;
    this.workLocationType = data.workLocationType;
    this.location = data.location;
    this.minSalary = data.minSalary;
    this.maxSalary = data.maxSalary;
    this.tags = data.tags;
    this.koreanLevel = data.koreanLevel;
    this.englishLevel = data.englishLevel;
    this.visaSponsorship = data.visaSponsorship;
    this.residentOnly = data.residentOnly;
    this.applicationUrl = data.applicationUrl;
    this.isPublished = data.isPublished;
    this.isFeatured = data.isFeatured;
    this.applicationClickCount = data.applicationClickCount;
  }
}
