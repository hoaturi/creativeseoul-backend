import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';
import { TalentSocialLinksDto } from './talent-social-links.dto';

export class GetTalentAsMemberItemDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiPropertyOptional()
  public readonly avatarUrl?: string;

  @ApiProperty({
    type: TalentLocationDto,
  })
  public readonly location: TalentLocationDto;

  @ApiProperty({
    type: TalentSocialLinksDto,
  })
  public readonly socialLinks?: TalentSocialLinksDto;

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    avatarUrl?: string;
    location: TalentLocationDto;
    socialLinks?: TalentSocialLinksDto;
  }) {
    this.handle = data.handle;
    this.fullName = data.fullName;
    this.title = data.title;
    this.avatarUrl = data.avatarUrl;
    this.location = data.location;
    this.socialLinks = data.socialLinks;
  }
}

export class GetTalentAsMemberListResponseDto {
  @ApiProperty({ type: [GetTalentAsMemberItemDto] })
  public readonly members: GetTalentAsMemberItemDto[];

  public constructor(members: GetTalentAsMemberItemDto[]) {
    this.members = members;
  }
}
