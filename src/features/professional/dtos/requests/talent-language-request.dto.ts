import { ApiProperty } from '@nestjs/swagger';
import { IsString, Max, Min } from 'class-validator';
import { LANGUAGE_LEVELS } from '../../../../domain/common/constants';

export class TalentLanguageRequestDto {
  @ApiProperty()
  @IsString()
  public readonly languageId: number;

  @ApiProperty()
  @IsString()
  @Min(1)
  @Max(LANGUAGE_LEVELS.length)
  public readonly level: number;
}
