import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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
import { UpsertProfessionalRequestDto } from './dtos/requests/upsert-professional-request.dto';
import { UpsertProfessionalCommand } from './commands/upsert-professional/upsert-professional.command';
import { UserRole } from '../../domain/user/user-role.enum';
import { GetProfessionalResponseDto } from './dtos/responses/get-professional-response.dto';
import { GetProfessionalQuery } from './queries/get-professional/get-professional.query';
import { ProfessionalError } from './professional.error';

@Controller('professionals')
export class ProfessionalController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':handle')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: GetProfessionalResponseDto })
  @ApiNotFoundResponse({
    example: ProfessionalError.NotFound,
  })
  public async getProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Param('handle') handle: string,
  ): Promise<GetProfessionalResponseDto> {
    const command = new GetProfessionalQuery(user, handle);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

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
