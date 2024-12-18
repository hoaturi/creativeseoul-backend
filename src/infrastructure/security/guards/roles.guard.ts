import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../domain/user/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../authenticated-user.interface';
import { AuthError } from '../../../features/auth/auth.error';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    const user: AuthenticatedUser | undefined = request.session.user;

    if (requiredRoles.some((role) => user.role.includes(role))) {
      throw new HttpException(AuthError.Unauthorized, HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
