import { ApiProperty } from '@nestjs/swagger';
import { ReferenceDataDto } from './reference-data.dto';

export class LanguageWithLevelDto extends ReferenceDataDto {
  @ApiProperty()
  public readonly level: number;

  public constructor(id: number, name: string, slug: string, level: number) {
    super(id, name, slug);
    this.level = level;
  }
}
