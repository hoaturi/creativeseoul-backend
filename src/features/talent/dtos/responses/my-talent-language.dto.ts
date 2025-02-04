import { ApiProperty } from '@nestjs/swagger';

export class MyTalentLanguageDto {
  @ApiProperty()
  public readonly languageId: number;

  @ApiProperty()
  public readonly levelId: number;

  public constructor(languageId: number, levelId: number) {
    this.languageId = languageId;
    this.levelId = levelId;
  }
}
