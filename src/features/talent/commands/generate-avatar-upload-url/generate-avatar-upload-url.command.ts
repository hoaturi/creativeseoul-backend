import { Result } from '../../../../common/result/result';
import { GenerateImageUploadUrlResponseDto } from '../../../common/dtos/generate-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { Command } from '@nestjs/cqrs';
import { GenerateImageUploadUrlRequestDto } from '../../../common/dtos/generate-image-upload-url-request.dto';
import { AuthenticatedUser } from '../../../../infrastructure/security/authenticated-user.interface';

export class GenerateAvatarUploadUrlCommand extends Command<
  Result<GenerateImageUploadUrlResponseDto, ResultError>
> {
  public constructor(
    public readonly user: AuthenticatedUser,
    public readonly dto: GenerateImageUploadUrlRequestDto,
  ) {
    super();
  }
}
