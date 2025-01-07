import { ApiProperty } from '@nestjs/swagger';

export class TalentWorkLocationTypeResponseDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly name: string;

  public constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
