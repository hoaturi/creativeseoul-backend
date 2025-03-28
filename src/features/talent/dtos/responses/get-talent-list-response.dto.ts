import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';

export class GetTalentListItemDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl?: string;

  @ApiProperty({
    type: TalentLocationDto,
  })
  public readonly location: TalentLocationDto;

  @ApiProperty()
  public readonly availabilityStatus: string;

  @ApiProperty()
  public readonly requiresVisaSponsorship: boolean;

  @ApiPropertyOptional()
  public readonly skills?: string[];

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    bio: string;
    avatarUrl?: string;
    location: TalentLocationDto;
    availabilityStatus: string;
    requiresVisaSponsorship: boolean;
    skills?: string[];
  }) {
    this.handle = data.handle;
    this.fullName = data.fullName;
    this.title = data.title;
    this.bio = data.bio;
    this.avatarUrl = data.avatarUrl;
    this.location = data.location;
    this.availabilityStatus = data.availabilityStatus;
    this.requiresVisaSponsorship = data.requiresVisaSponsorship;
    this.skills = data.skills;
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
