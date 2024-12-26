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
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { UpsertProfessionalRequestDto } from './dtos/upsert-professional-request.dto';
import { UpsertProfessionalCommand } from './commands/upsert-professional/upsert-professional.command';
import { UserRole } from '../../domain/user/user-role.enum';

@Controller('professionals')
export class ProfessionalController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Put('me')
  @Roles(UserRole.MEMBER)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async upsertCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertProfessionalRequestDto,
  ): Promise<void> {
    const command = new UpsertProfessionalCommand(user.profileId, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
