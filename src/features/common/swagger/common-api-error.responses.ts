import { ApiErrorResponses } from './error-responses.interface';
import { CommonError } from '../common.error';

export const CommonApiErrorResponses: ApiErrorResponses = {
  ValidationError: {
    example: CommonError.ValidationFailed,
  },
};
