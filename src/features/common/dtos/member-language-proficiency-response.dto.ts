import { ApiProperty } from '@nestjs/swagger';

export class MemberLanguageProficiencyResponseDto {
  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly level: number;

  public constructor(name: string, level: number) {
    this.name = name;
    this.level = level;
  }
}
