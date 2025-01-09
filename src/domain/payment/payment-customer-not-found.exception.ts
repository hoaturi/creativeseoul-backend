import { CustomException } from '../../common/exceptions/custom.exception';
import { PaymentErrorCode } from './payment-error-code.enum';

export class PaymentCustomerNotFoundException extends CustomException {
  public constructor(customerId: string) {
    super(
      PaymentErrorCode.CUSTOMER_NOT_FOUND,
      {
        customerId,
      },
      `Payment customer with id ${customerId} not found`,
    );
  }
}
