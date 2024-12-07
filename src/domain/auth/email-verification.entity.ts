import {
  Cascade,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';

@Entity()
export class EmailVerification extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  user!: User;

  @Property()
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
