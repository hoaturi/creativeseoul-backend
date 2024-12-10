import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../authenticated-user.interface';

@Injectable()
export class SessionGuard implements CanActivate {
  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const user: AuthenticatedUser | undefined = request.session.user;

    if (user === undefined) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
