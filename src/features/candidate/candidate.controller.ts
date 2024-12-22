import {
  Body,
  Controller,
  HttpException,
  Patch,
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
import { UserRole } from '../../domain/user/user.entity';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';

import { UpdateCandidateRequestDto } from './dtos/update-candidate-request.dto';
import { UpdateCandidateCommand } from './commands/update-candidate/update-candidate.command';

@Controller('candidates')
export class CandidateController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  @Roles(UserRole.CANDIDATE)
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
  public async updateCandidate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCandidateRequestDto,
  ): Promise<void> {
    const command = new UpdateCandidateCommand(user.id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
