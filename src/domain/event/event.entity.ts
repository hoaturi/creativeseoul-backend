import { Check, Entity, Index, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { EventType } from './event-type.entity';

// Check if either registrationUrl or websiteUrl is not null and end date is greater than start date
@Check({
  expression:
    'COALESCE(registration_url, website_url) IS NOT NULL AND start_date < end_date',
})
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

  @Property({ type: 'text' })
  public description: string;

  @Property()
  @Index()
  public startDate: Date;

  @Property()
  public endDate: Date;

  @Property()
  public coverImageUrl: string;

  @Property({ nullable: true })
  public registrationUrl?: string;

  @Property({ nullable: true })
  public websiteUrl?: string;

  public constructor(data: {
    title: string;
    slug: string;
    eventType: EventType;
    description: string;
    startDate: Date;
    endDate: Date;
    coverImageUrl: string;
    registrationUrl?: string;
    websiteUrl?: string;
  }) {
    super();
    this.title = data.title;
    this.slug = data.slug;
    this.eventType = data.eventType;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.coverImageUrl = data.coverImageUrl;
    this.registrationUrl = data.registrationUrl;
    this.websiteUrl = data.websiteUrl;
  }
}
