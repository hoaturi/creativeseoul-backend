import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class ProfessionalExperienceDto {
  @ApiProperty()
  @IsString()
  @Min(3)
  @MaxLength(32)
  public readonly title: string;

  @ApiProperty()
  @Min(0)
  @IsNumber()
  public readonly yearsOfExperience: number;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  public readonly description: string;
}
