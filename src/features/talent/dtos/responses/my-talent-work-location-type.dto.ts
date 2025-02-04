import { ApiProperty } from '@nestjs/swagger';

export class MyTalentWorkLocationTypeDto {
  @ApiProperty()
  public readonly id: number;

  public constructor(id: number) {
    this.id = id;
  }
}
