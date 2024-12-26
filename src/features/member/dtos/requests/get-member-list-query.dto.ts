import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { COUNTRIES } from '../../../../domain/common/constants';

export class GetMemberListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(COUNTRIES.length)
  public readonly countryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  public readonly page?: number;
}
