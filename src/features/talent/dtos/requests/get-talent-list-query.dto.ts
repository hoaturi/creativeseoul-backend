import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTalentListQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly employmentTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((v) => parseInt(v)) : [parseInt(value)],
  )
  public readonly workLocationTypeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  public readonly page?: number;
}
