import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TalentLocationDto } from './talent-location.dto';

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

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    avatarUrl?: string;
    location: TalentLocationDto;
  }) {
    this.handle = data.handle;
    this.fullName = data.fullName;
    this.title = data.title;
    this.avatarUrl = data.avatarUrl;
    this.location = data.location;
  }
}

export class GetTalentAsMemberListResponseDto {
  @ApiProperty({ type: [GetTalentAsMemberItemDto] })
  public readonly members: GetTalentAsMemberItemDto[];

  public constructor(members: GetTalentAsMemberItemDto[]) {
    this.members = members;
  }
}
