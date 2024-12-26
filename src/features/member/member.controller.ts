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
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
import { UpdateMemberCommand } from './commands/update-candidate/update-member.command';
import { UserRole } from '../../domain/user/user-role.enum';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { GetMemberResponseDto } from './dtos/get-member-response.dto';
import { GetMemberQuery } from './queries/get-member-query';
import { MemberError } from './member.error';

@Controller('members')
export class MemberController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':handle')
  @ApiOkResponse({
    type: GetMemberResponseDto,
  })
  @ApiNotFoundResponse({
    example: MemberError.NotFound,
  })
  public async getMember(
    @Param('handle') id: string,
  ): Promise<GetMemberResponseDto> {
    const command = new GetMemberQuery(id);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Put('me')
  @Roles(UserRole.MEMBER)
  @UseGuards(AuthGuard)
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
  public async updateMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateMemberRequestDto,
  ): Promise<void> {
    const command = new UpdateMemberCommand(user.profileId, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
