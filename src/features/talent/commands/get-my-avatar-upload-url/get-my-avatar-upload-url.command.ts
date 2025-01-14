import { Result } from '../../../../common/result/result';
import { GetImageUploadUrlResponseDto } from '../../../common/dtos/get-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { Command } from '@nestjs/cqrs';
import { GetImageUploadUrlRequestDto } from '../../../common/dtos/get-image-upload-url-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GetMyAvatarUploadUrlCommand extends Command<
  Result<GetImageUploadUrlResponseDto, ResultError>
> {
  public constructor(
    public readonly currentUser: AuthenticatedUser,
    public readonly dto: GetImageUploadUrlRequestDto,
  ) {
    super();
  }
}
