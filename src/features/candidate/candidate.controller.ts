import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { CreateCandidateProfileRequestDto } from './dtos/create-candidate-profile-request.dto';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateCandidateProfileCommand } from './commands/create-cnadidate-profile/create-candidate-profile.command';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { UserRole } from '../../domain/user/user.entity';
import { CandidateError } from './candidate.error';
import { GetCandidateListResponseDto } from './dtos/get-candidate-list-response.dto';
import { GetCandidateListQuery } from './query/get-candidate-list/get-candidate-list.query';
import { GetCandidateListQueryDto } from './dtos/get-candidate-list-query.dto';
import { GetCandidateQuery } from './query/get-candidate/get-candidate.query';
import { GetCandidateResponseDto } from './dtos/get-candidate-response.dto';

@Controller('candidate')
export class CandidateController {
  public constructor(
    private readonly commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.CANDIDATE)
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
    example: CandidateError.ProfileAlreadyExists,
  })
  public async createCandidateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCandidateProfileRequestDto,
  ): Promise<void> {
    const command = new CreateCandidateProfileCommand(user.id, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get()
  @ApiOkResponse({
    type: GetCandidateListResponseDto,
  })
  public async getCandidateList(
    @Query() queryDto: GetCandidateListQueryDto,
  ): Promise<GetCandidateListResponseDto> {
    const query = new GetCandidateListQuery(
      queryDto.page,
      queryDto.search,
      queryDto.categories,
      queryDto.employment_types,
      queryDto.work_location_types,
      queryDto.states,
      queryDto.languages,
    );

    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Get(':id')
  @ApiOkResponse({
    type: GetCandidateResponseDto,
  })
  @ApiNotFoundResponse({
    example: CandidateError.ProfileNotFound,
  })
  @ApiForbiddenResponse({
    example: CandidateError.ProfileNotAvailable,
  })
  public async GetCandidate(
    @Param('id') candidateId: string,
    @CurrentUser() user?: AuthenticatedUser,
  ): Promise<GetCandidateResponseDto> {
    console.log(user);
    const query = new GetCandidateQuery(candidateId, user?.id);
    const result = await this.queryBus.execute(query);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
