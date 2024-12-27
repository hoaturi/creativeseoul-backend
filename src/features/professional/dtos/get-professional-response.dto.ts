import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfessionalExperienceResponseDto } from './professional-experience-response.dto';
import { ProfessionalProjectResponseDto } from './professional-project-response.dto';
import { ProfessionalMemberResponseDto } from './professional-member-response.dto';

export class GetProfessionalResponseDto {
  @ApiProperty()
  public readonly member: ProfessionalMemberResponseDto;

  @ApiProperty()
  public readonly isOpenToWork: boolean;

  @ApiPropertyOptional()
  public readonly salaryRange?: string;

  @ApiPropertyOptional()
  public readonly hourlyRateRange?: string;

  @ApiProperty()
  public readonly locationTypes: string[];

  @ApiProperty()
  public readonly employmentTypes: string[];

  @ApiPropertyOptional({
    type: [ProfessionalExperienceResponseDto],
  })
  public readonly experiences?: ProfessionalExperienceResponseDto[];

  @ApiPropertyOptional({
    type: [ProfessionalProjectResponseDto],
  })
  public readonly projects?: ProfessionalProjectResponseDto[];

  @ApiPropertyOptional()
  public readonly skills?: string[];

  @ApiPropertyOptional()
  public readonly resumeUrl?: string;

  @ApiPropertyOptional()
  public readonly email?: string;

  @ApiPropertyOptional()
  public readonly phone?: string;

  public constructor(
    member: ProfessionalMemberResponseDto,
    data: {
      isOpenToWork: boolean;
      salaryRange?: string;
      hourlyRateRange?: string;
      locationTypes: string[];
      employmentTypes: string[];
      experiences?: ProfessionalExperienceResponseDto[];
      projects?: ProfessionalProjectResponseDto[];
      skills?: string[];
      resumeUrl?: string;
      email?: string;
      phone?: string;
    },
  ) {
    Object.assign(this, { member, ...data });
  }
}
