import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreditTransactionType } from '../../../../domain/company/credit-transaction-type.enum';

export class GetCreditTransactionListItemDto {
  @ApiProperty()
  public readonly displayId: string;

  @ApiProperty()
  public readonly type: CreditTransactionType;

  @ApiProperty()
  public readonly amount: number;

  @ApiProperty()
  public readonly createdAt: Date;

  @ApiPropertyOptional()
  public readonly jobTitle?: string;

  @ApiPropertyOptional()
  public readonly jobSlug?: string;

  public constructor(data: {
    displayId: string;
    type: CreditTransactionType;
    amount: number;
    createdAt: Date;
    jobTitle?: string;
    jobSlug?: string;
  }) {
    this.displayId = data.displayId;
    this.type = data.type;
    this.amount = data.amount;
    this.createdAt = data.createdAt;
    this.jobTitle = data.jobTitle;
    this.jobSlug = data.jobSlug;
  }
}

export class GetCreditTransactionListResponseDto {
  @ApiProperty({ type: [GetCreditTransactionListItemDto] })
  public readonly transactions: GetCreditTransactionListItemDto[];

  public constructor(transactions: GetCreditTransactionListItemDto[]) {
    this.transactions = transactions;
  }
}
