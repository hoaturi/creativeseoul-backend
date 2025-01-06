import {
  Body,
  Controller,
  HttpException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GeneratePresignedUrlResponseDto } from './dtos/generate-presigned-url-response.dto';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import {
  AssetType,
  GeneratePresignedUrlCommand,
} from './commands/generate-presigned-url.command';
import { GenerateImagePresignedUrlRequestDto } from './dtos/generate-image-presigned-url-request.dto';
import { CommonError } from '../common/common.error';
import { UserRole } from '../../domain/user/user-role.enum';

@Controller('upload')
export class UploadController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Put('avatar')
  @Roles(UserRole.Talent)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GeneratePresignedUrlResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async uploadCandidateAvatar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateImagePresignedUrlRequestDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const command = new GeneratePresignedUrlCommand(
      user.id,
      AssetType.Avatar,
      dto,
    );

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
