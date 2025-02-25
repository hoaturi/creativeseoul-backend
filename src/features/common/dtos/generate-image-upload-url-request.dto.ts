import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ALLOWED_IMAGE_TYPES } from '../../../domain/common/constants/allowed-image-type.constant';

export class GenerateImageUploadUrlRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_IMAGE_TYPES)
  public readonly mimeType!: string;

  @ApiProperty()
  @IsNumber()
  public readonly fileSize!: number;
}
