import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
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
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateMemberRequestDto } from './dtos/create-member-request.dto';
import { CreateMemberCommand } from './commands/create-member/create-member.command';
import { UpdateMemberRequestDto } from './dtos/update-member-request.dto';
import { UpdateMemberCommand } from './commands/update-candidate/update-member.command';
import { MemberError } from './member.error';
import { GetMemberResponseDto } from './dtos/get-member-response.dto';
import { GetMemberQuery } from './queries/get-member/get-member.query';

@Controller('members')
export class MemberController {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id')
  @ApiOkResponse({
    type: GetMemberResponseDto,
  })
  @ApiNotFoundResponse({
    example: MemberError.NotFound,
  })
  public async getMember(
    @Param('id') id: string,
  ): Promise<GetMemberResponseDto> {
    const query = new GetMemberQuery(id);

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Post()
  @UseGuards(AuthGuard)
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
  @ApiConflictResponse({
    example: MemberError.AlreadyExists,
  })
  public async createMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateMemberRequestDto,
  ): Promise<void> {
    const command = new CreateMemberCommand(user.id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiOkResponse()
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  @ApiForbiddenResponse({
    example: AuthError.Unauthorized,
  })
  @ApiNotFoundResponse({
    example: MemberError.NotFound,
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
