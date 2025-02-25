import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateAvatarUploadUrlCommand } from './generate-avatar-upload-url.command';
import { Result } from '../../../../common/result/result';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';
import { GenerateImageUploadUrlResponseDto } from '../../../common/dtos/generate-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';

@CommandHandler(GenerateAvatarUploadUrlCommand)
export class GenerateAvatarUploadUrlHandler
  implements ICommandHandler<GenerateAvatarUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GenerateAvatarUploadUrlCommand,
  ): Promise<Result<GenerateImageUploadUrlResponseDto, ResultError>> {
    const { user, dto } = command;

    const fileName = `avatars/${user.id}-${Date.now()}`;
    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto.mimeType,
      dto.fileSize,
    );

    return Result.success(new GenerateImageUploadUrlResponseDto(presignedUrl));
  }
}
