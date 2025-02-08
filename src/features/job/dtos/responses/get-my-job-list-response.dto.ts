import { ApiProperty } from '@nestjs/swagger';

export class GetMyJobListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly slug: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly applicationClickCount: number;

  @ApiProperty()
  public readonly isPublished: boolean;

  @ApiProperty()
  public readonly isFeatured: boolean;

  @ApiProperty()
  public readonly createdAt: Date;

  public constructor(data: {
    id: string;
    slug: string;
    title: string;
    applicationClickCount: number;
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: Date;
  }) {
    this.id = data.id;
    this.slug = data.slug;
    this.title = data.title;
    this.applicationClickCount = data.applicationClickCount;
    this.isPublished = data.isPublished;
    this.isFeatured = data.isFeatured;
    this.createdAt = data.createdAt;
  }
}

export class GetMyJobListResponseDto {
  @ApiProperty({ type: [GetMyJobListItemDto] })
  public readonly jobs: GetMyJobListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(jobs: GetMyJobListItemDto[], total: number) {
    this.jobs = jobs;
    this.total = total;
  }
}
