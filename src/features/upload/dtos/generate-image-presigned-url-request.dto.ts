import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { IsLessThan } from '../../../common/decorators/is-less-than.decorator';

// Ensures proper image compression by comparing original and compressed file sizes
// Compressed files are limited to 512KB max, suitable for WebP images
// with dimensions up to 400px on either side
export class GenerateImagePresignedUrlRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly mimeType!: string;

  @ApiProperty()
  @IsNumber()
  public readonly originalFileSize!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(512 * 1024)
  @IsLessThan('originalFileSize')
  public readonly compressedFileSize!: number;
}
