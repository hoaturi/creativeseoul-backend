import { Result } from '../../../common/result/result';
import { GeneratePresignedUrlResponseDto } from '../dtos/generate-presigned-url-response.dto';
import { ResultError } from '../../../common/result/result-error';
import { Command } from '@nestjs/cqrs';
import { GenerateImagePresignedUrlRequestDto } from '../dtos/generate-image-presigned-url-request.dto';

export enum AssetType {
  Avatar = 'avatars',
  Logo = 'logos',
  Resume = 'resumes',
}

export class GeneratePresignedUrlCommand extends Command<
  Result<GeneratePresignedUrlResponseDto, ResultError>
> {
  public constructor(
    public readonly userId: string,
    public readonly assetType: AssetType,
    public readonly dto: GenerateImagePresignedUrlRequestDto,
  ) {
    super();
  }
}
