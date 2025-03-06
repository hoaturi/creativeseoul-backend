import { Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { EventType } from './event-type.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @Property({ unique: true })
  public readonly slug: string;

  @ManyToOne(() => EventType)
  public eventType: EventType;

  @Property()
  public title: string;

  @Property()
  public summary: string;

  @Property({ type: 'text' })
  public description: string;

  @Property()
  @Index()
  public startDate: Date;

  @Property()
  public endDate: Date;

  @Property()
  public coverImageUrl: string;

  @Property()
  public websiteUrl: string;

  public constructor(data: {
    title: string;
    summary: string;
    slug: string;
    eventType: EventType;
    description: string;
    startDate: Date;
    endDate: Date;
    coverImageUrl: string;
    websiteUrl: string;
  }) {
    super();
    this.title = data.title;
    this.summary = data.summary;
    this.slug = data.slug;
    this.eventType = data.eventType;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.coverImageUrl = data.coverImageUrl;
    this.websiteUrl = data.websiteUrl;
  }
}
