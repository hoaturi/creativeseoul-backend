import { Property } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  createdAt = new Date();
}
