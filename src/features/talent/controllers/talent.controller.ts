import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../../auth/auth.error';
import { CommonError } from '../../common/common.error';
import { CurrentUser } from '../../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../infrastructure/security/authenticated-user.interface';
import { Roles } from '../../../infrastructure/security/decorators/roles.decorator';
import { RolesGuard } from '../../../infrastructure/security/guards/roles.guard';
import { UpdateTalentCommand } from '../commands/update-talent/update-talent.command';
import { UserRole } from '../../../domain/user/user-role.enum';
import { GetTalentQuery } from '../queries/get-talent/get-talent.query';
import { TalentError } from '../talent.error';
import { GetTalentListResponseDto } from '../dtos/responses/get-talent-list-response.dto';
import { GetTalentListQuery } from '../queries/get-talent-list/get-talent-list.query';
import { GetTalentListQueryDto } from '../dtos/requests/get-talent-list-query.dto';
import { UpdateTalentRequestDto } from '../dtos/requests/update-talent-request.dto';
import { GetTalentResponseDto } from '../dtos/responses/get-talent-response.dto';
import { CreateTalentCommand } from '../commands/create-talent/create-talent.command';
import { CreateTalentRequestDto } from '../dtos/requests/create-talent-request.dto';
import { GenerateImageUploadUrlResponseDto } from '../../common/dtos/generate-image-upload-url-response.dto';
import { CompanyError } from '../../company/company.error';
import { GenerateAvatarUploadUrlCommand } from '../commands/generate-avatar-upload-url/generate-avatar-upload-url.command';
import { SessionResponseDto } from '../../auth/dtos/session-response.dto';
import { GetMyTalentQuery } from '../queries/get-my-talent/get-my-talent.query';
import { GetMyTalentResponseDto } from '../dtos/responses/get-my-talent-response.dto';
import { UpdateJobPreferencesRequestDto } from '../dtos/requests/update-job-preferences-request.dto';
import { UpdateJobPreferencesCommand } from '../commands/update-job-preferences/update-job-preferences.command';
import { GenerateImageUploadUrlRequestDto } from '../../common/dtos/generate-image-upload-url-request.dto';

@Controller('talents')
export class TalentController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOkResponse({ type: GetTalentListResponseDto })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiBadRequestResponse({
    example: CommonError.ValidationFailed,
  })
  public async getTalentList(
    @Query() queryDto: GetTalentListQueryDto,
  ): Promise<GetTalentListResponseDto> {
    const command = new GetTalentListQuery(queryDto);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('me')
  @Roles(UserRole.TALENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({ type: GetMyTalentResponseDto })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiNotFoundResponse({
    example: TalentError.ProfileNotFound,
  })
  public async getMyTalent(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetMyTalentResponseDto> {
    const command = new GetMyTalentQuery(user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':handle')
  @ApiOkResponse({ type: GetTalentResponseDto })
  @ApiNotFoundResponse({
    example: TalentError.ProfileNotFound,
  })
  public async getTalent(
    @Param('handle') handle: string,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<GetTalentResponseDto> {
    const command = new GetTalentQuery(handle, user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get()
  @Post('me')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.TALENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: SessionResponseDto,
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
  @ApiConflictResponse({
    examples: {
      ProfileAlreadyExists: {
        summary: 'Profile already exists',
        value: TalentError.ProfileAlreadyExists,
      },
      HandleAlreadyExists: {
        summary: 'Handle already exists',
        value: TalentError.HandleAlreadyExists,
      },
    },
  })
  public async createTalent(
    @Session() session: Record<string, any>,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTalentRequestDto,
  ): Promise<SessionResponseDto> {
    const command = new CreateTalentCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    session.user = result.value.user;

    return result.value;
  }

  @Put('me')
  @Roles(UserRole.TALENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: SessionResponseDto,
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
  public async updateTalent(
    @Session() session: Record<string, any>,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateTalentRequestDto,
  ): Promise<SessionResponseDto> {
    const command = new UpdateTalentCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    session.user = result.value.user;

    return result.value;
  }

  @Put('me/job-preferences')
  @Roles(UserRole.TALENT)
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
  @ApiNotFoundResponse({
    example: TalentError.ProfileNotFound,
  })
  public async updateJobPreferences(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateJobPreferencesRequestDto,
  ): Promise<void> {
    const command = new UpdateJobPreferencesCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Put('avatar')
  @Roles(UserRole.TALENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GenerateImageUploadUrlResponseDto,
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
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async generateAvatarUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GenerateImageUploadUrlRequestDto,
  ): Promise<GenerateImageUploadUrlResponseDto> {
    const command = new GenerateAvatarUploadUrlCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
