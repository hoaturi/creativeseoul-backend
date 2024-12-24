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
import { Candidate } from '../../../domain/candidate/candidate.entity';
import { CandidateError } from '../../candidate/candidate.error';

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
    switch (command.assetType) {
      case AssetType.Resume: {
        const candidate = await this.em.findOne(Candidate, {
          user: command.userId,
        });

        if (!candidate) {
          return Result.failure(CandidateError.NotFound);
        }

        break;
      }
    }

    const fileName = `${command.assetType}/${command.userId}-${Date.now()}`;

    const presignedUrl = await this.storageService.generatePresignedUrl(
      fileName,
      command.dto,
    );

    const response = new GeneratePresignedUrlResponseDto(presignedUrl);

    return Result.success(response);
  }
}
