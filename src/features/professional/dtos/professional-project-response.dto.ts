import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalProjectResponseDto {
  @ApiProperty()
  public readonly title: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly url: string;

  public constructor(data: {
    title: string;
    description: string;
    url: string;
  }) {
    Object.assign(this, data);
  }
}
