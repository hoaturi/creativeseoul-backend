import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
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
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateFeaturedJobRequestDto } from './dtos/requests/create-featured-job-request.dto';
import { UserRole } from '../../domain/user/user-role.enum';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { AuthError } from '../auth/auth.error';
import { CompanyError } from '../company/company.error';
import { CreateFeaturedJobCommand } from './commands/create-featured-job/create-featured-job.command';
import { CreateRegularJobCommand } from './commands/create-regular-job/create-regular-job.command';
import { CommonError } from '../common/common.error';
import { CreateRegularJobRequestDto } from './dtos/requests/create-regular-job-request.dto';
import { GetJobListResponseDto } from './dtos/responses/get-job-list-response.dto';
import { GetJobListQueryDto } from './dtos/requests/get-job-list-query.dto';
import { GetJobListQuery } from './queries/get-job-list/get-job-list.query';
import { GetJobResponseDto } from './dtos/responses/get-job-response.dto';
import { JobError } from './job.error';
import { GetJobQuery } from './queries/get-job/get-job.query';
import { UpdateJobRequestDto } from './dtos/requests/update-job-request.dto';
import { UpdateJobCommand } from './commands/update-job/update-job.command';
import { TrackJobApplicationClickCommand } from './commands/track-job-application-click/track-job-application-click.command';
import { GetMyJobListResponseDto } from './dtos/responses/get-my-job-list-response.dto';
import { GetMyJobListQuery } from './queries/get-my-job-list/get-my-job-list.query';
import { DeleteJobCommand } from './commands/delete-job/delete-job.command';

@Controller('jobs')
export class JobController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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
  ): Promise<void> {
    const command = new CreateFeaturedJobCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
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
  public async createRegularJob(
    @Body() dto: CreateRegularJobRequestDto,
  ): Promise<void> {
    const command = new CreateRegularJobCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Get()
  @ApiOkResponse({
    type: [GetJobListResponseDto],
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async GetJobList(
    @Query() queryDto: GetJobListQueryDto,
  ): Promise<GetJobListResponseDto> {
    const query = new GetJobListQuery(queryDto);

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('my')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: [GetMyJobListResponseDto],
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  public async getMyJobList(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetMyJobListResponseDto> {
    const query = new GetMyJobListQuery(user);

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':slug')
  @ApiOkResponse({
    type: GetJobResponseDto,
  })
  @ApiNotFoundResponse({
    example: JobError.NotFound,
  })
  public async getJob(
    @Param('slug') slug: string,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<GetJobResponseDto> {
    const query = new GetJobQuery(slug, user);

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put(':slug')
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    examples: {
      PermissionDenied: {
        summary: 'Permission denied',
        value: JobError.PermissionDenied,
      },
      Unauthorized: {
        summary: 'Unauthorized',
        value: AuthError.Unauthorized,
      },
    },
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  @ApiNotFoundResponse({
    example: JobError.NotFound,
  })
  public async updateJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('slug') slug: string,
    @Body() dto: UpdateJobRequestDto,
  ): Promise<void> {
    const command = new UpdateJobCommand(user, slug, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Post(':jobId/apply-click')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  public async trackJobApplicationClick(
    @Param('jobId') jobId: string,
    @Ip() ipAddress: string,
  ): Promise<void> {
    const ipv4 = ipAddress.split(':').pop() as string;
    const command = new TrackJobApplicationClickCommand(jobId, ipv4);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Delete(':id')
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    examples: {
      PermissionDenied: {
        summary: 'Permission denied',
        value: JobError.PermissionDenied,
      },
      Unauthorized: {
        summary: 'Unauthorized',
        value: AuthError.Unauthorized,
      },
    },
  })
  @ApiNotFoundResponse({
    example: JobError.NotFound,
  })
  public async deleteJob(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    const command = new DeleteJobCommand(user, id);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }
}
