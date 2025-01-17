import { Check, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../base.entity';
import { EventType } from './event-type.entity';

// Check if either rsvpUrl or websiteUrl is not null and end date is greater than start date
@Check({
  name: 'check_url_and_dates',
  expression:
    'COALESCE(rsvp_url, website_url) IS NOT NULL AND start_date < end_date',
})
@Entity()
export class Event extends BaseEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  public readonly id!: string;

  @ManyToOne(() => EventType)
  public eventType: EventType;

  @Property()
  public title: string;

  @Property()
  public description: string;

  @Property()
  public startDate: Date;

  @Property()
  public endDate: Date;

  @Property()
  public coverImageUrl: string;

  @Property({ nullable: true })
  public rsvpUrl?: string;

  @Property({ nullable: true })
  public websiteUrl?: string;

  public constructor(data: {
    title: string;
    eventType: EventType;
    description: string;
    startDate: Date;
    endDate: Date;
    coverImageUrl: string;
    rsvpUrl?: string;
    websiteUrl?: string;
  }) {
    super();
    this.title = data.title;
    this.eventType = data.eventType;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.coverImageUrl = data.coverImageUrl;
    this.rsvpUrl = data.rsvpUrl;
    this.websiteUrl = data.websiteUrl;
  }
}
