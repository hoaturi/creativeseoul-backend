import { GenerateImageUploadUrlRequestDto } from '../../../common/dtos/generate-image-upload-url-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateLogoUploadUrlRequestDto extends GenerateImageUploadUrlRequestDto {
  @ApiProperty()
  public readonly companyName!: string;
}
