import { ApiErrorResponses } from 'src/features/common/swagger/error-responses.interface';
import { AuthError } from '../auth.error';

export const AuthApiErrorResponses: ApiErrorResponses = {
  EmailAlreadyExists: {
    example: AuthError.EmailAlreadyExists,
  },
  InvalidToken: {
    example: AuthError.InvalidToken,
  },
  InvalidCredentials: {
    example: AuthError.InvalidCredentials,
  },
  EmailNotVerified: {
    example: AuthError.EmailNotVerified,
  },
};
