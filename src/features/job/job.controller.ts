import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateFeaturedJobRequestDto } from './dtos/create-featured-job-request.dto';
import { UserRole } from '../../domain/user/user-role.enum';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { AuthError } from '../auth/auth.error';
import { CompanyError } from '../company/company.error';
import { CreateFeaturedJobCommand } from './commands/create-featured-job/create-featured-job.command';
import { CreateRegularJobCommand } from './commands/create-regular-job/create-regular-job.command';
import { CommonError } from '../common/common.error';
import { CreateRegularJobRequestDto } from './dtos/create-regular-job-request.dto';

@Controller('jobs')
export class JobController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post('featured')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    examples: {
      InsufficientCreditBalance: {
        summary: 'Insufficient credit balance',
        value: CompanyError.InsufficientCreditBalance,
      },
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
    },
  })
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async createFeaturedJob(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFeaturedJobRequestDto,
  ) {
    const command = new CreateFeaturedJobCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Post('regular')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
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
  public async createRegularJob(@Body() dto: CreateRegularJobRequestDto) {
    const command = new CreateRegularJobCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
