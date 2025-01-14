import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetMyLogoUploadUrlCommand } from './get-my-logo-upload-url.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetImageUploadUrlResponseDto } from '../../../common/dtos/get-image-upload-url-response.dto';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';
import { CompanyError } from '../../company.error';

@CommandHandler(GetMyLogoUploadUrlCommand)
export class GetMyLogoUploadUrlHandler
  implements ICommandHandler<GetMyLogoUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GetMyLogoUploadUrlCommand,
  ): Promise<Result<GetImageUploadUrlResponseDto, ResultError>> {
    const { currentUser, dto } = command;

    if (!currentUser.profileId) {
      return Result.failure(CompanyError.ProfileNotFound);
    }

    const fileName = `logos/${currentUser.profileId}-${Date.now()}`;
    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto,
    );

    return Result.success(new GetImageUploadUrlResponseDto(presignedUrl));
  }
}
