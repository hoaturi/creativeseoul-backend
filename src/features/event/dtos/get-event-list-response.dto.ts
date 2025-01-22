import { ApiProperty } from '@nestjs/swagger';

export class EventListItemDto {
  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly eventType: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiProperty()
  public readonly startDate: Date;

  @ApiProperty()
  public readonly endDate: Date;

  @ApiProperty()
  public readonly coverImageUrl: string;

  public constructor(data: {
    slug: string;
    eventType: string;
    summary: string;
    title: string;
    startDate: Date;
    endDate: Date;
    coverImageUrl: string;
  }) {
    this.slug = data.slug;
    this.eventType = data.eventType;
    this.title = data.title;
    this.summary = data.summary;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.coverImageUrl = data.coverImageUrl;
  }
}

export class GetEventListResponseDto {
  @ApiProperty({ type: [EventListItemDto] })
  public readonly events: EventListItemDto[];

  public constructor(events: EventListItemDto[]) {
    this.events = events;
  }
}
