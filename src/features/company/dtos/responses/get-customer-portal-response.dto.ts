import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerPortalResponseDto {
  @ApiProperty()
  public readonly customerPortalUrl: string;

  public constructor(customerPortalUrl: string) {
    this.customerPortalUrl = customerPortalUrl;
  }
}
