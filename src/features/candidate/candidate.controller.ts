import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateCandidateProfileRequestDto } from './dtos/create-candidate-profile-request.dto';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateCandidateProfileCommand } from './commands/create-candidate-profile.command';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { UserRole } from '../../domain/user/user.entity';
import { CandidateError } from './candidate.error';

@Controller('candidate')
export class CandidateController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
  @UseGuards(AuthGuard)
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  @ApiConflictResponse({
    example: CandidateError.ProfileAlreadyExists,
  })
  public async createCandidateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCandidateProfileRequestDto,
  ): Promise<void> {
    const command = new CreateCandidateProfileCommand(user.id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
