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
import { UpdateTalentCommand } from '../commands/upsert-talent/update-talent.command';
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
import { GetImageUploadUrlResponseDto } from '../../common/dtos/get-image-upload-url-response.dto';
import { CompanyError } from '../../company/company.error';
import { GetImageUploadUrlRequestDto } from '../../common/dtos/get-image-upload-url-request.dto';
import { GetMyAvatarUploadUrlCommand } from '../commands/get-my-avatar-upload-url/get-my-avatar-upload-url.command';
import { SessionResponseDto } from '../../auth/dtos/session-response.dto';
import { GetMyTalentQuery } from '../queries/get-my-talent/get-my-talent.query';
import { GetMyTalentResponseDto } from '../dtos/responses/get-my-talent-response.dto';

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

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ type: GetTalentResponseDto })
  @ApiNotFoundResponse({
    example: TalentError.ProfileNotFound,
  })
  public async getTalent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<GetTalentResponseDto> {
    const command = new GetTalentQuery(user, id);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

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
  public async updateTalent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateTalentRequestDto,
  ): Promise<void> {
    const command = new UpdateTalentCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Put('me/avatar')
  @Roles(UserRole.TALENT)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GetImageUploadUrlResponseDto,
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
  public async getMyAvatarUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GetImageUploadUrlRequestDto,
  ): Promise<GetImageUploadUrlResponseDto> {
    const command = new GetMyAvatarUploadUrlCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
