import { Property } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
  @Property({ onUpdate: () => new Date() })
  public readonly updatedAt = new Date();

  @Property()
  public readonly createdAt = new Date();
}
