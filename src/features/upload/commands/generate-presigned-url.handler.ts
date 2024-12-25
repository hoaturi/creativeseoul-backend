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
import { CandidateError } from '../../candidate/candidate.error';
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
      fields: ['member.id', 'member.candidate.id'],
    });

    let filePrefix: string;

    switch (command.assetType) {
      case AssetType.Resume: {
        if (!user.member.candidate.id) {
          return Result.failure(CandidateError.NotFound);
        }

        filePrefix = user.member.candidate.id;
        break;
      }
      default: {
        filePrefix = user.member.id;
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
