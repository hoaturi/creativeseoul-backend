import { ApiProperty } from '@nestjs/swagger';

export class GetEventResponseDto {
  @ApiProperty()
  public readonly eventType: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly summary: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly startDate: Date;

  @ApiProperty()
  public readonly endDate: Date;

  @ApiProperty()
  public readonly coverImageUrl: string;

  @ApiProperty()
  public readonly registrationUrl?: string;

  @ApiProperty()
  public readonly websiteUrl?: string;

  public constructor(data: {
    eventType: string;
    title: string;
    summary: string;
    description: string;
    startDate: Date;
    endDate: Date;
    coverImageUrl: string;
    registrationUrl?: string;
    websiteUrl?: string;
  }) {
    this.eventType = data.eventType;
    this.title = data.title;
    this.summary = data.summary;
    this.description = data.description;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.coverImageUrl = data.coverImageUrl;
    this.registrationUrl = data.registrationUrl;
    this.websiteUrl = data.websiteUrl;
  }
}
