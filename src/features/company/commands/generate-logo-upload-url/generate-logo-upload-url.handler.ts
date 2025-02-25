import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateLogoUploadUrlCommand } from './generate-logo-upload-url.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GenerateImageUploadUrlResponseDto } from 'src/features/common/dtos/generate-image-upload-url-response.dto';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';
import slugify from 'slugify';

@CommandHandler(GenerateLogoUploadUrlCommand)
export class GenerateLogoUploadUrlHandler
  implements ICommandHandler<GenerateLogoUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GenerateLogoUploadUrlCommand,
  ): Promise<Result<GenerateImageUploadUrlResponseDto, ResultError>> {
    const { dto } = command;

    const fileName = `logos/${slugify(dto.companyName)}-${Date.now()}`;

    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto.mimeType,
      dto.fileSize,
    );

    return Result.success(new GenerateImageUploadUrlResponseDto(presignedUrl));
  }
}
