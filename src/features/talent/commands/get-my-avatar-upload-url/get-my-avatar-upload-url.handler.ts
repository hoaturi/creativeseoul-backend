import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyAvatarUploadUrlCommand } from './get-my-avatar-upload-url.command';
import { Result } from '../../../../common/result/result';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';
import { GetImageUploadUrlResponseDto } from '../../../common/dtos/get-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { TalentError } from '../../talent.error';

@CommandHandler(GetMyAvatarUploadUrlCommand)
export class GetMyAvatarUploadUrlHandler
  implements ICommandHandler<GetMyAvatarUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GetMyAvatarUploadUrlCommand,
  ): Promise<Result<GetImageUploadUrlResponseDto, ResultError>> {
    const { currentUser, dto } = command;

    if (!currentUser.profile.id) {
      return Result.failure(TalentError.ProfileNotFound);
    }

    const fileName = `avatars/${currentUser.profile.id}-${Date.now()}`;
    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto,
    );

    return Result.success(new GetImageUploadUrlResponseDto(presignedUrl));
  }
}
