import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly priceId!: string;
}
