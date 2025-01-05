import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberLocationResponseDto } from '../../../common/dtos/member-location-response.dto';

export class ProfessionalListItemDto {
  @ApiProperty()
  public readonly handle: string;

  @ApiProperty()
  public readonly fullName: string;

  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly bio: string;

  @ApiPropertyOptional()
  public readonly avatarUrl: string;

  @ApiProperty({
    type: MemberLocationResponseDto,
  })
  public readonly location: MemberLocationResponseDto;

  @ApiProperty()
  public readonly isOpenToWork: boolean;

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
    location: MemberLocationResponseDto;
    isOpenToWork: boolean;
    requiresVisaSponsorship: boolean;
    skills?: string[];
  }) {
    Object.assign(this, data);
  }
}

export class GetProfessionalListResponseDto {
  @ApiProperty({
    type: [ProfessionalListItemDto],
  })
  public readonly professionals: ProfessionalListItemDto[];

  @ApiProperty()
  public readonly total: number;

  public constructor(professionals: ProfessionalListItemDto[], total: number) {
    this.professionals = professionals;
    this.total = total;
  }
}
