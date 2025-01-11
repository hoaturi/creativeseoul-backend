import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetTalentAsMemberResponseDto } from '../dtos/responses/get-talent-as-member-response.dto';
import { TalentError } from '../talent.error';
import { GetTalentAsMemberQuery } from '../queries/get-talent-as-member/get-talent-as-member.query';
import { CurrentUser } from '../../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../infrastructure/security/authenticated-user.interface';
import { GetTalentAsMemberListResponseDto } from '../dtos/responses/get-talent-as-member-list-response.dto';
import { GetTalentAsMemberListQuery } from '../queries/get-talent-as-member-list/get-talent-as-member-list.query';

@Controller('members')
export class MemberController {
  public constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOkResponse({
    type: [GetTalentAsMemberListResponseDto],
  })
  public async GetTalentAsMemberList(
    @Query('page') page?: number,
  ): Promise<GetTalentAsMemberListResponseDto> {
    const command = new GetTalentAsMemberListQuery(page);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':handle')
  @ApiOkResponse({
    type: GetTalentAsMemberResponseDto,
  })
  @ApiNotFoundResponse({
    example: TalentError.ProfileNotFound,
  })
  public async GetTalentAsMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('handle') handle: string,
  ): Promise<GetTalentAsMemberResponseDto> {
    const command = new GetTalentAsMemberQuery(user, handle);

    const result = await this.queryBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
