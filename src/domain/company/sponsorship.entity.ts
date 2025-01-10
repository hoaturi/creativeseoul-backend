import { Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Company } from './company.entity';
import { Enum, Property } from '@mikro-orm/postgresql';

export enum SponsorshipStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

@Entity()
export class Sponsorship extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => Company)
  public readonly company!: Company;

  @Property()
  public readonly subscriptionId!: string;

  @Enum(() => SponsorshipStatus)
  @Index()
  public status!: SponsorshipStatus;

  @Property()
  public currentPeriodStart!: Date;

  @Property()
  @Index()
  public currentPeriodEnd!: Date;

  public constructor(data: {
    company: Company;
    subscriptionId: string;
    status: SponsorshipStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  }) {
    super();
    this.company = data.company;
    this.subscriptionId = data.subscriptionId;
    this.status = data.status;
    this.currentPeriodStart = data.currentPeriodStart;
    this.currentPeriodEnd = data.currentPeriodEnd;
  }
}
