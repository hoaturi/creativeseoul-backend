import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TalentActivityService } from '../services/talent-activity/talent-activity.service';
import { UserRole } from '../../domain/user/user-role.enum';
import { AuthenticatedUser } from '../security/authenticated-user.interface';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UserActivityInterceptor.name);

  public constructor(
    private readonly talentActivityService: TalentActivityService,
  ) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = request.session?.user as AuthenticatedUser;

    response.on('finish', () => {
      const profileId = user?.profileId;

      if (user?.role === UserRole.TALENT && profileId) {
        this.talentActivityService
          .updateLastActive(profileId)
          .catch((err) =>
            this.logger.error(
              'interceptor.talent-activity: Unable to update talent last active time',
              err,
            ),
          );
      }
    });

    return next.handle();
  }
}
