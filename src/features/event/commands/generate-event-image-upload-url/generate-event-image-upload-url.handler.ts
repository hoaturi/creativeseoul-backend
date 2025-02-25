import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateEventImageUploadUrlCommand } from './generate-event-image-upload-url.command';
import { Result } from 'src/common/result/result';
import { ResultError } from 'src/common/result/result-error';
import { GenerateImageUploadUrlResponseDto } from 'src/features/common/dtos/generate-image-upload-url-response.dto';
import { StorageService } from '../../../../infrastructure/services/storage/storage.service';
import slugify from 'slugify';

@CommandHandler(GenerateEventImageUploadUrlCommand)
export class GenerateEventImageUploadUrlHandler
  implements ICommandHandler<GenerateEventImageUploadUrlCommand>
{
  public constructor(private readonly storageService: StorageService) {}

  public async execute(
    command: GenerateEventImageUploadUrlCommand,
  ): Promise<Result<GenerateImageUploadUrlResponseDto, ResultError>> {
    const { dto } = command;

    const slug = slugify(dto.eventTitle, { lower: true });
    const fileName = `events/${slug}-${Date.now()}`;

    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      dto.mimeType,
      dto.fileSize,
    );

    return Result.success(new GenerateImageUploadUrlResponseDto(presignedUrl));
  }
}
