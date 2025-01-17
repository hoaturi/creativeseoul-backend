import { CustomException } from '../../../common/exceptions/custom.exception';
import { CompanyErrorCode } from '../company-error-code.enum';

export class CompanyNotFoundException extends CustomException {
  public constructor(companyId: string) {
    super(
      CompanyErrorCode.PROFILE_NOT_FOUND,
      {
        companyId,
      },
      `Company profile with id ${companyId} not found`,
    );
  }
}
