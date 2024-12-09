import {
  Cascade,
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';

@Entity()
@Index({ properties: ['token', 'expiresAt', 'usedAt'] })
export class EmailVerificationToken extends BaseEntity {
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
