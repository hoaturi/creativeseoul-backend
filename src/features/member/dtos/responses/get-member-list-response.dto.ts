import { ApiProperty } from '@nestjs/swagger';
import { LocationResponseDto } from '../../../common/dtos/location-response.dto';

export class MemberListItemDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly avatarUrl: string;

  @ApiProperty()
  public readonly tags: string[];

  @ApiProperty()
  public readonly location: LocationResponseDto;

  public constructor(data: {
    handle: string;
    fullName: string;
    title: string;
    avatarUrl: string;
    tags: string[];
    location: LocationResponseDto;
  }) {
    Object.assign(this, data);
  }
}

export class GetMemberListResponseDto {
  @ApiProperty({ type: [MemberListItemDto] })
  public readonly members: MemberListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(members: MemberListItemDto[], total: number) {
    this.members = members;
    this.total = total;
  }
}
