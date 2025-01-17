import { CustomException } from '../../../common/exceptions/custom.exception';
import { CompanyErrorCode } from '../company-error-code.enum';

export class CompanyNotFoundByCustomerIdException extends CustomException {
  public constructor(customerId: string) {
    super(
      CompanyErrorCode.CUSTOMER_NOT_FOUND,
      {
        customerId,
      },
      `Company with customer id ${customerId} not found`,
    );
  }
}
