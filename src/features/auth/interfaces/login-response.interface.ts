import { UserResponse } from '../dtos/login-response.dto';

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}
