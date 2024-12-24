import {
  Body,
  Controller,
  HttpException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
import { UpdateMemberCommand } from './commands/update-candidate/update-member.command';

@Controller('members')
export class MemberController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Put('me')
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
    const command = new UpdateMemberCommand(user.id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
