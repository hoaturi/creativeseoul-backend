import { BaseEntity } from '../../base.entity';
import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Company } from './company.entity';
import { Enum, Property } from '@mikro-orm/postgresql';
import { Job } from '../../job/entities/job.entity';
import { CreditTransactionType } from '../credit-transaction-type.enum';

@Entity()
export class CreditTransaction extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @Property({ unique: true })
  public readonly displayId: string;

  @ManyToOne(() => Company)
  public readonly company: Company;

  @Property()
  public readonly amount: number;

  @Enum(() => CreditTransactionType)
  public readonly type: CreditTransactionType;

  @Property({ nullable: true })
  public readonly checkoutId?: string;

  @ManyToOne(() => Job, { nullable: true })
  public readonly job?: Job;

  public constructor(data: {
    displayId: string;
    company: Company;
    amount: number;
    type: CreditTransactionType;
    checkoutId?: string;
    job?: Job;
  }) {
    super();
    this.displayId = data.displayId;
    this.company = data.company;
    this.amount = data.amount;
    this.type = data.type;
    this.checkoutId = data.checkoutId;
    this.job = data.job;
  }
}
