import {
  Cascade,
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';

@Entity()
@Index({ properties: ['token', 'expiresAt', 'usedAt'] })
export class EmailVerification extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  @Index()
  user!: User;

  @Property()
  @Unique()
  token!: string;

  @Property()
  expiresAt!: Date;

  @Property({ nullable: true })
  usedAt?: Date;

  constructor(user: User, token: string, expiresAt: Date) {
    super();
    this.user = user;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}
