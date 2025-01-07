import {
  Body,
  Controller,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateCompanyCommand } from './commands/create-company/create-company.command';

@Controller('companies')
export class CompanyController {
  public constructor(private readonly commandBus: CommandBus) {}

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
}
