import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';

export class ProfessionalExperienceRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Trim()
  public readonly title: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  public readonly yearsOfExperience: number;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  @Trim()
  public readonly description: string;
}
