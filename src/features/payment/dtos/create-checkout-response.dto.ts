import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutResponseDto {
  @ApiProperty()
  public readonly checkoutUrl: string;

  public constructor(checkoutUrl: string) {
    this.checkoutUrl = checkoutUrl;
  }
}
