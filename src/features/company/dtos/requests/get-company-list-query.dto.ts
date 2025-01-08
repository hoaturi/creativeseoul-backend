import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetCompanyListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public readonly page?: number;
}
