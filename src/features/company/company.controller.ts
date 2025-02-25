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
  Session,
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
import { SendInvitationRequestDto } from './dtos/requests/send-invitation-request.dto';
import { SendInvitationCommand } from './commands/send-invitation/send-invitation.command';
import { AcceptInvitationRequestDto } from './dtos/requests/accept-invitation-request.dto';
import { AcceptInvitationCommand } from './commands/accept-invitation/accept-invitation.command';
import { CompanyError } from './company.error';
import { GetCompanyResponseDto } from './dtos/responses/get-company-response.dto';
import { GetCompanyQuery } from './queries/get-company/get-company.query';
import { GenerateImageUploadUrlResponseDto } from '../common/dtos/generate-image-upload-url-response.dto';
import { GetSponsorCompanyListResponseDto } from './dtos/responses/get-sponsor-company-list-response.dto';
import { GetSponsorCompanyListQuery } from './queries/get-sponsor-company-list/get-sponsor-company-list.query';
import { GetMyCompanyResponseDto } from './dtos/responses/get-my-company-response.dto';
import { GetMyCompanyQuery } from './queries/get-my-company/get-my-company.query';
import { SessionResponseDto } from '../auth/dtos/session-response.dto';
import { GetCustomerPortalResponseDto } from './dtos/responses/get-customer-portal-response.dto';
import { GetCustomerPortalQuery } from './queries/get-customer-portal/get-customer-portal.query';
import { GetCreditBalanceResponseDto } from './dtos/responses/get-credit-balance-response.dto';
import { GetCreditBalanceQuery } from './queries/get-credit-balance/get-credit-balance.query';
import { GetCreditTransactionListResponseDto } from './dtos/responses/get-credit-transaction-list-response.dto';
import { GetCreditTransactionListQuery } from './queries/get-credit-transaction-list/get-credit-transaction-list.query';
import { GetUnclaimedCompanyListResponseDto } from './dtos/responses/get-unclaimed-company-list-response.dto';
import { GetUnclaimedCompanyListQuery } from './queries/get-unclaimed-company-list/get-unclaimed-company-list.query';
import { SendInvitationByIdRequestDto } from './dtos/requests/send-invitation-by-id-request.dto';
import { SendInvitationByIdCommand } from './commands/send-invitation/send-invitation-by-id/send-invitation-by-id.command';
import { GenerateLogoUploadUrlCommand } from './commands/generate-logo-upload-url/generate-logo-upload-url.command';
import { GenerateLogoUploadUrlRequestDto } from './dtos/requests/generate-logo-upload-url-request.dto';

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

  @Post(':id/invitations')
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
    examples: {
      ValidationFailed: {
        summary: 'Validation failed',
        value: CommonError.ValidationFailed,
      },
      ProfileAlreadyClaimed: {
        summary: 'Profile already claimed',
        value: CompanyError.ProfileAlreadyClaimed,
      },
    },
  })
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async sendInvitationById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendInvitationByIdRequestDto,
  ): Promise<void> {
    const command = new SendInvitationByIdCommand(id, dto);

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
    @Session() session: Record<string, any>,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCompanyRequestDto,
  ): Promise<SessionResponseDto> {
    const command = new UpdateCompanyCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    session.user = result.value.user;

    return result.value;
  }

  @Get()
  @ApiOkResponse({
    type: GetCompanyListResponseDto,
  })
  public async getCompanyList(): Promise<GetCompanyListResponseDto> {
    const command = new GetCompanyListQuery();

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('unclaimed')
  @ApiOkResponse({
    type: GetUnclaimedCompanyListResponseDto,
  })
  public async getUnclaimedCompanyList(): Promise<GetUnclaimedCompanyListResponseDto> {
    const command = new GetUnclaimedCompanyListQuery();

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('me')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GetMyCompanyResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async getMyCompany(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetMyCompanyResponseDto> {
    const command = new GetMyCompanyQuery(user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('sponsors')
  @ApiOkResponse({
    type: GetSponsorCompanyListResponseDto,
  })
  public async getSponsorCompanyList(): Promise<GetSponsorCompanyListResponseDto> {
    const command = new GetSponsorCompanyListQuery();

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('me/billing')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GetCustomerPortalResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  public async getCustomerPortal(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetCustomerPortalResponseDto> {
    const command = new GetCustomerPortalQuery(user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('/me/credit-balance')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GetCreditBalanceResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  public async getCreditBalance(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetCreditBalanceResponseDto> {
    const command = new GetCreditBalanceQuery(user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get('/me/credit-transactions')
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: GetCreditTransactionListResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  public async getCreditTransactionList(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<GetCreditTransactionListResponseDto> {
    const command = new GetCreditTransactionListQuery(user);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':slug')
  @ApiOkResponse({
    type: GetCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    example: CompanyError.ProfileNotFound,
  })
  public async getCompany(
    @Param('slug') slug: string,
  ): Promise<GetCompanyResponseDto> {
    const command = new GetCompanyQuery(slug);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put('logo')
  @Roles(UserRole.COMPANY, UserRole.ADMIN)
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
  public async generateLogoUploadUrl(
    @Body() dto: GenerateLogoUploadUrlRequestDto,
  ): Promise<GenerateImageUploadUrlResponseDto> {
    const command = new GenerateLogoUploadUrlCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
