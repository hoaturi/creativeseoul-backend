import { BaseEntity } from '../base.entity';
import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Enum, Property } from '@mikro-orm/postgresql';
import { Company } from '../company/company.entity';
import { Category } from '../common/entities/category.entity';
import { SALARY_TYPES, SalaryType } from './salary-type.constant';
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

  // Relations
  @ManyToOne(() => Company, { nullable: true })
  public company?: Company;

  @ManyToOne(() => Category)
  public category!: Category;

  // Job Details
  @ManyToOne(() => EmploymentType)
  public employmentType!: EmploymentType;

  @ManyToOne(() => SeniorityLevel)
  public seniorityLevel!: SeniorityLevel;

  // Location
  @ManyToOne(() => WorkLocationType)
  public workLocationType!: WorkLocationType;

  @Property({ nullable: true })
  public location?: string;

  // Compensation
  @Property({ nullable: true })
  public minSalary?: number;

  @Property({ nullable: true })
  public maxSalary?: number;

  @Property({ nullable: true })
  @Enum(() => SALARY_TYPES.map((type) => type.label))
  public salaryType!: SalaryType;

  // Requirements
  @Property({ type: 'array', nullable: true })
  public tags?: string[];

  @ManyToOne(() => LanguageLevel)
  public requiredKoreanLevel!: LanguageLevel;

  @ManyToOne(() => LanguageLevel)
  public requiredEnglishLevel!: LanguageLevel;

  @Property()
  public providesVisaSponsorship!: boolean;

  @Property()
  public requiresKoreanResidency!: boolean;

  // Application
  @Property()
  public applicationUrl!: string;

  // Status
  @Property()
  public isPublished!: boolean;

  @Property()
  public isFeatured!: boolean;

  @Property({ default: 0 })
  public applicationClickCount!: number;
}
