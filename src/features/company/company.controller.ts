import {
  Body,
  Controller,
  Get,
  HttpException,
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
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';
import { GetCompanyListQuery } from './queries/get-company-list/get-company-list.query';
import { GetCompanyListResponseDto } from './dtos/get-company-list-response.dto';
import { GetCompanyListQueryDto } from './dtos/requests/get-company-list-query.dto';
import { SendInvitationRequestDto } from './dtos/requests/send-invitation-request.dto';
import { SendInvitationCommand } from './commands/send-invitation/send-invitation.command';

@Controller('companies')
export class CompanyController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('invitations')
  @Roles(UserRole.ADMIN)
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
  public async sendInvitation(
    @Body() dto: SendInvitationRequestDto,
  ): Promise<void> {
    const command = new SendInvitationCommand(dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
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

    return result.value;
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
}
