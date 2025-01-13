import { ApiProperty } from '@nestjs/swagger';

export class TalentLanguageProficiencyDto {
  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly level: string;

  public constructor(name: string, level: string) {
    this.name = name;
    this.level = level;
  }
}
