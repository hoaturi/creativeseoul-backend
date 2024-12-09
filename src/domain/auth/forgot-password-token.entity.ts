import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';
import { Cascade, Index, ManyToOne } from '@mikro-orm/core';

@Entity()
@Index({ properties: ['token', 'expiresAt', 'usedAt'] })
export class ForgotPasswordToken extends BaseEntity {
  @PrimaryKey()
  public readonly id!: number;

  @ManyToOne(() => User, { cascade: [Cascade.REMOVE] })
  public readonly user!: User;

  @Property()
  @Index()
  public readonly token!: string;

  @Property()
  public readonly expiresAt!: Date;

  @Property({ nullable: true })
  public readonly usedAt?: Date;

  constructor(user: User, token: string, expiresAt: Date) {
    super();
    this.user = user;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}
