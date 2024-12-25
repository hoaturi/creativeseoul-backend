import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { Cascade, Index } from '@mikro-orm/core';
import { Member } from '../member/member.entity';

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Member, {
    cascade: [Cascade.REMOVE],
  })
  public readonly member: Member;

  @Property({ unique: true, length: 256 })
  @Index()
  public email!: string;

  @Property({ length: 128 })
  public password!: string;

  @Enum(() => UserRole)
  public readonly role!: UserRole;

  @Property({ default: false })
  public isVerified!: boolean;

  @Property({ default: true })
  public isActive!: boolean;

  public constructor(
    email: string,
    password: string,
    role: UserRole,
    member: Member,
  ) {
    super();
    this.email = email;
    this.role = role;
    this.password = password;
    this.member = member;
  }
}
