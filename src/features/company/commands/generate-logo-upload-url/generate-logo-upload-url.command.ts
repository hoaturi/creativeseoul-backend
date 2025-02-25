import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { ResultError } from '../../../../common/result/result-error';
import { GenerateLogoUploadUrlRequestDto } from '../../dtos/requests/generate-logo-upload-url-request.dto';
import { GenerateImageUploadUrlResponseDto } from '../../../common/dtos/generate-image-upload-url-response.dto';

export class GenerateLogoUploadUrlCommand extends Command<
  Result<GenerateImageUploadUrlResponseDto, ResultError>
> {
  public constructor(public readonly dto: GenerateLogoUploadUrlRequestDto) {
    super();
  }
}
