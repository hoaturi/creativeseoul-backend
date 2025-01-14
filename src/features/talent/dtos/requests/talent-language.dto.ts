import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';
import {
  LANGUAGE_LEVELS,
  LANGUAGES,
} from '../../../../domain/common/constants';

export class TalentLanguageDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(LANGUAGES.length)
  public readonly languageId!: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(LANGUAGE_LEVELS.length)
  public readonly levelId!: number;
}
