import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CandidateProjectDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  public readonly title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  public readonly description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  public readonly url: string;
}
