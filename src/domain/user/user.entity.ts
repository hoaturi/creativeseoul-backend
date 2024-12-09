import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { Index } from '@mikro-orm/core';

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ length: 16 })
  userName: string;

  @Property({ unique: true, length: 256 })
  @Index()
  email: string;

  @Property({ length: 128 })
  password!: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property({ default: false })
  isVerified!: boolean;

  @Property({ default: true })
  isActive!: boolean;

  constructor(
    fullName: string,
    email: string,
    role: UserRole,
    password: string,
  ) {
    super();
    this.userName = fullName;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
