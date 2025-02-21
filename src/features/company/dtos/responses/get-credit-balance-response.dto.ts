import { ApiProperty } from '@nestjs/swagger';

export class GetCreditBalanceResponseDto {
  @ApiProperty()
  public readonly creditBalance: number;

  public constructor(creditBalance: number) {
    this.creditBalance = creditBalance;
  }
}
