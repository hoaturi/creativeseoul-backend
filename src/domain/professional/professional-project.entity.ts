import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Property } from '@mikro-orm/postgresql';
import { Professional } from './professional.entity';

@Entity()
export class ProfessionalProject extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => Professional, {
    deleteRule: 'cascade',
  })
  public professional!: Professional;

  @Property({ length: 64 })
  public title!: string;

  @Property({ length: 512 })
  public description!: string;

  @Property()
  public url!: string;

  public constructor(title: string, description: string, url: string) {
    super();
    this.title = title;
    this.description = description;
    this.url = url;
  }
}
