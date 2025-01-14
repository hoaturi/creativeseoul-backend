import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetLogoUploadUrlCommand } from './get-logo-upload-url.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GetImageUploadUrlResponseDto } from 'src/features/common/dtos/get-image-upload-url-response.dto';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';

@CommandHandler(GetLogoUploadUrlCommand)
export class GetLogoUploadUrlHandler
  implements ICommandHandler<GetLogoUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GetLogoUploadUrlCommand,
  ): Promise<Result<GetImageUploadUrlResponseDto, ResultError>> {
    const { companyId, dto } = command;

    const fileName = `logos/${companyId}-${Date.now()}`;

    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto,
    );

    return Result.success(new GetImageUploadUrlResponseDto(presignedUrl));
  }
}
