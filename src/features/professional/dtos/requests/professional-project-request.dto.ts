import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Trim } from '../../../../common/decorators/trim.decorator';

export class ProfessionalProjectRequestDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Trim()
  public readonly title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(512)
  @Trim()
  public readonly description: string;

  @ApiProperty()
  @IsUrl({
    protocols: ['https'],
    require_protocol: true,
  })
  @Trim()
  public readonly url: string;
}
