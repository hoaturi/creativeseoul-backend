import { ApiProperty } from '@nestjs/swagger';

export class TalentHourlyRateRangeResponseDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly label: string;

  public constructor(id: number, label: string) {
    this.id = id;
    this.label = label;
  }
}
