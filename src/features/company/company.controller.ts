import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { UserRole } from '../../domain/user/user-role.enum';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { UpdateCompanyRequestDto } from './dtos/requests/update-company-request.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';
import { GetCompanyListQuery } from './queries/get-company-list/get-company-list.query';
import { GetCompanyListResponseDto } from './dtos/responses/get-company-list-response.dto';
import { GetCompanyListQueryDto } from './dtos/requests/get-company-list-query.dto';
import { SendInvitationRequestDto } from './dtos/requests/send-invitation-request.dto';
import { SendInvitationCommand } from './commands/send-invitation/send-invitation.command';
import { AcceptInvitationRequestDto } from './dtos/requests/accept-invitation-request.dto';
import { AcceptInvitationCommand } from './commands/accept-invitation/accept-invitation.command';
import { CompanyError } from './company.error';
import { GetCompanyResponseDto } from './dtos/responses/get-company-response.dto';
import { GetCompanyQuery } from './queries/get-company/get-company.query';
import { GetImageUploadUrlResponseDto } from '../common/dtos/get-image-upload-url-response.dto';
import { GetMyLogoUploadUrlCommand } from './commands/get-my-logo-upload-url/get-my-logo-upload-url.command';
import { GetImageUploadUrlRequestDto } from '../common/dtos/get-image-upload-url-request.dto';
import { GetLogoUploadUrlCommand } from './commands/get-logo-upload-url/get-logo-upload-url.command';

@Controller('companies')
export class CompanyController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('invitations')
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
  public async sendInvitation(
    @Body() dto: SendInvitationRequestDto,
  ): Promise<void> {
    const command = new SendInvitationCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Post('invitations/accept')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiBadRequestResponse({
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      InvalidInvitationToken: {
        summary: 'Invalid invitation token',
        value: CompanyError.InvalidInvitationToken,
      },
      ProfileAlreadyClaimed: {
        summary: 'Profile already claimed',
        value: CompanyError.ProfileAlreadyClaimed,
      },
    },
  })
  @ApiConflictResponse({
    example: AuthError.EmailAlreadyExists,
  })
  public async acceptInvitation(
    @Body() dto: AcceptInvitationRequestDto,
  ): Promise<void> {
    const command = new AcceptInvitationCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Put('me')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
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
  public async updateCompany(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCompanyRequestDto,
  ): Promise<void> {
    const command = new UpdateCompanyCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }
  }

  @Get()
  @ApiOkResponse({
    type: GetCompanyListResponseDto,
  })
  public async getCompanyList(
    @Query() queryDto: GetCompanyListQueryDto,
  ): Promise<GetCompanyListResponseDto> {
    const command = new GetCompanyListQuery(queryDto);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async getCompany(
    @Param('id') id: string,
  ): Promise<GetCompanyResponseDto> {
    const command = new GetCompanyQuery(id);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put('me/logo')
  @Roles(UserRole.COMPANY)
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
  public async getMyLogoUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: GetImageUploadUrlRequestDto,
  ): Promise<GetImageUploadUrlResponseDto> {
    const command = new GetMyLogoUploadUrlCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put(':id/logo')
  @Roles(UserRole.ADMIN)
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
  public async getLogoUploadUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: GetImageUploadUrlRequestDto,
  ): Promise<GetImageUploadUrlResponseDto> {
    const command = new GetLogoUploadUrlCommand(id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
