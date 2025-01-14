import { ApiProperty } from '@nestjs/swagger';

export class GetImageUploadUrlResponseDto {
  @ApiProperty()
  public readonly url: string;

  public constructor(url: string) {
    this.url = url;
  }
}
