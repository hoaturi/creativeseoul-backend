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
  public readonly id!: number;

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  @Index()
  public readonly user!: User;

  @Property()
  @Unique()
  public readonly token!: string;

  @Property()
  public expiresAt!: Date;

  @Property({ nullable: true })
  public usedAt?: Date;

  public constructor(user: User, token: string, expiresAt: Date) {
    super();
    this.user = user;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}
