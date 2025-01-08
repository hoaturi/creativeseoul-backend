import { BaseEntity } from '../base.entity';
import { Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { Company } from './company.entity';

@Entity()
export class CompanyInvitation extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @Property()
  @Index()
  public readonly token!: string;

  @ManyToOne(() => Company)
  public readonly company!: Company;

  @Property()
  @Index()
  public readonly expiresAt!: Date;

  @Property()
  @Index()
  public isAccepted: boolean;

  public constructor(
    token: string,
    expiresAt: Date,
    isAccepted: boolean,
    company: Company,
  ) {
    super();
    this.token = token;
    this.expiresAt = expiresAt;
    this.isAccepted = isAccepted;
    this.company = company;
  }
}
