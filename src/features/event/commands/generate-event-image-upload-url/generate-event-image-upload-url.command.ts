import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GenerateImageUploadUrlResponseDto } from '../../../common/dtos/generate-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GenerateEventImageUploadUrlRequestDto } from '../../dtos/generate-event-image-upload-url-request.dto';

export class GenerateEventImageUploadUrlCommand extends Command<
  Result<GenerateImageUploadUrlResponseDto, ResultError>
> {
  public constructor(
    public readonly dto: GenerateEventImageUploadUrlRequestDto,
  ) {
    super();
  }
}
