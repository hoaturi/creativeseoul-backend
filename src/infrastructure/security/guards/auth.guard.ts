import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../authenticated-user.interface';
import { AuthError } from '../../../features/auth/auth.error';

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: AuthenticatedUser | undefined = request.session.user;

    if (user === undefined) {
      throw new HttpException(
        AuthError.Unauthenticated,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return true;
  }
}
