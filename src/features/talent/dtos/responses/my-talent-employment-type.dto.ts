import { ApiProperty } from '@nestjs/swagger';

export class MyTalentEmploymentTypeDto {
  @ApiProperty()
  public readonly id: number;

  public constructor(id: number) {
    this.id = id;
  }
}
