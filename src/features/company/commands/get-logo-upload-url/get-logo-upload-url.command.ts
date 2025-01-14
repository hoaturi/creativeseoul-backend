import { Command } from '@nestjs/cqrs';
import { Result } from '../../../../common/result/result';
import { GetImageUploadUrlResponseDto } from '../../../common/dtos/get-image-upload-url-response.dto';
import { ResultError } from '../../../../common/result/result-error';
import { GetImageUploadUrlRequestDto } from '../../../common/dtos/get-image-upload-url-request.dto';

export class GetLogoUploadUrlCommand extends Command<
  Result<GetImageUploadUrlResponseDto, ResultError>
> {
  public constructor(
    public readonly companyId: string,
    public readonly dto: GetImageUploadUrlRequestDto,
  ) {
    super();
  }
}
