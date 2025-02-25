import { GenerateImageUploadUrlRequestDto } from '../../common/dtos/generate-image-upload-url-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateEventImageUploadUrlRequestDto extends GenerateImageUploadUrlRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly eventTitle!: string;
}
