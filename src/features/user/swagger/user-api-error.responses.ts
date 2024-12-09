import { ApiErrorResponses } from '../../common/swagger/error-responses.interface';
import { UserError } from '../user.error';

export const UserApiErrorResponses: ApiErrorResponses = {
  UserNotFound: {
    example: UserError.UserNotFound,
  },
};
