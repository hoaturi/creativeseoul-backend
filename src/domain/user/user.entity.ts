import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ length: 128 })
  fullName: string;

  @Property({ unique: true, length: 256 })
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
    this.fullName = fullName;
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
