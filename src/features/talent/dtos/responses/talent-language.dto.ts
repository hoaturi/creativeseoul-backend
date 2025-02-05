import { ApiProperty } from '@nestjs/swagger';

export class TalentLanguageDto {
  @ApiProperty()
  public readonly label: string;

  @ApiProperty()
  public readonly level: string;

  public constructor(label: string, level: string) {
    this.label = label;
    this.level = level;
  }
}
