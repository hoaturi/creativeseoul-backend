import { ResultError } from '../../common/result/result-error';

export class UserError extends ResultError {
  constructor(code: string, statusCode: number, description: string) {
    super(code, statusCode, description);
  }
}
