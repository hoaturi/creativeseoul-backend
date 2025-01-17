import {
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { Cascade, Index } from '@mikro-orm/core';
import { UserRole } from './user-role.enum';
import { Talent } from '../talent/entities/talent.entity';
import { Company } from '../company/entities/company.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @OneToOne(() => Talent, (talent) => talent.user, {
    cascade: [Cascade.REMOVE],
  })
  public readonly talent?: Talent;

  @OneToOne(() => Company, (company) => company.user, {
    cascade: [Cascade.REMOVE],
  })
  public readonly company?: Company;

  @Property({ unique: true, length: 256 })
  @Index()
  public email: string;

  @Property({ length: 128 })
  public password: string;

  @Enum(() => UserRole)
  public readonly role: UserRole;

  @Property({ default: false })
  public isVerified!: boolean;

  @Property({ default: true })
  public isActive!: boolean;

  public constructor(email: string, password: string, role: UserRole) {
    super();
    this.email = email;
    this.role = role;
    this.password = password;
  }
}
