import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCheckoutRequestDto {
  @ApiProperty()
  @IsNumber()
  public readonly variantId: number;
}
