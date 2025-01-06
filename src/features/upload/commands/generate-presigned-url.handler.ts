import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AssetType,
  GeneratePresignedUrlCommand,
} from './generate-presigned-url.command';
import { EntityManager } from '@mikro-orm/postgresql';
import { Result } from '../../../common/result/result';
import { StorageService } from '../../../infrastructure/services/storage/storage.service';
import { GeneratePresignedUrlResponseDto } from '../dtos/generate-presigned-url-response.dto';
import { ResultError } from '../../../common/result/result-error';
import { TalentError } from '../../professional/talent.error';
import { User } from '../../../domain/user/user.entity';

@CommandHandler(GeneratePresignedUrlCommand)
export class GeneratePresignedUrlHandler
  implements ICommandHandler<GeneratePresignedUrlCommand>
{
  public constructor(
    private readonly em: EntityManager,
    private readonly storageService: StorageService,
  ) {}

  public async execute(
    command: GeneratePresignedUrlCommand,
  ): Promise<Result<GeneratePresignedUrlResponseDto, ResultError>> {
    const user = await this.em.findOne(User, command.userId, {
      fields: ['talent'],
    });

    let filePrefix: string;

    switch (command.assetType) {
      case AssetType.Avatar: {
        if (!user.talent.id) {
          return Result.failure(TalentError.NotFound);
        }

        filePrefix = user.talent.id;
        break;
      }
      default: {
        filePrefix = user.talent.id;
      }
    }

    const fileName = `${command.assetType}/${filePrefix}-${Date.now()}`;

    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      command.dto,
    );

    const response = new GeneratePresignedUrlResponseDto(presignedUrl);

    return Result.success(response);
  }
}
