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
  public readonly id!: string;

  @Property({ length: 16 })
  public username!: string;

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
    username: string,
    email: string,
    role: UserRole,
    password: string,
  ) {
    super();
    this.username = username;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
