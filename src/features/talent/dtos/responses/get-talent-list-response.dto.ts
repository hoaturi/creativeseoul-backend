import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationResponseDto } from './talent-location-response.dto';

export class GetTalentListItemDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl: string;

  @ApiProperty({
    type: TalentLocationResponseDto,
  })
  public readonly location: TalentLocationResponseDto;

  @ApiProperty()
  public readonly isAvailable: boolean;

  @ApiProperty()
  public readonly requiresVisaSponsorship: boolean;

  @ApiPropertyOptional()
  public readonly skills?: string[];

  public constructor(data: {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    location: TalentLocationResponseDto;
    isAvailable: boolean;
    skills?: string[];
  }) {
    Object.assign(this, data);
  }
}

export class GetTalentListResponseDto {
  @ApiProperty({
    type: [GetTalentListItemDto],
  })
  public readonly talents: GetTalentListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(talents: GetTalentListItemDto[], total: number) {
    this.talents = talents;
    this.total = total;
  }
}
