import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalExperienceResponseDto {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly yearsOfExperience: number;

  @ApiProperty()
  public readonly description: string;

  public constructor(data: {
    title: string;
    yearsOfExperience: number;
    description: string;
  }) {
    Object.assign(this, data);
  }
}
