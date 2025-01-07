import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
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
import { CreateCompanyRequestDto } from './dtos/create-company-request.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateCompanyCommand } from './commands/create-company/create-company.command';
import { GetCompanyListQuery } from './queries/get-company-list/get-company-list.query';
import { GetCompanyListResponseDto } from './dtos/get-company-list-response.dto';
import { GetCompanyListQueryDto } from './dtos/get-company-list-query.dto';

@Controller('companies')
export class CompanyController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('me')
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
  public async createCompany(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCompanyRequestDto,
  ): Promise<void> {
    const command = new CreateCompanyCommand(user, dto);

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
