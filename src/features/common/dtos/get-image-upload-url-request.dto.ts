import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetImageUploadUrlRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly mimeType!: string;

  @ApiProperty()
  @IsNumber()
  public readonly fileSize!: number;
}
