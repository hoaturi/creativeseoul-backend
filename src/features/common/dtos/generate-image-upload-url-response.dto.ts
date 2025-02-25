import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageUploadUrlResponseDto {
  @ApiProperty()
  public readonly url: string;

  public constructor(url: string) {
    this.url = url;
  }
}
