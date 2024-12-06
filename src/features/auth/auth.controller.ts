import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignUpRequestDto } from './dtos/sign-up-request.dto';
import { SignUpCommand } from './commands/signUp/sign-up.command';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('signup')
  @ApiResponse({
    status: 201,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  async signUp(@Body() dto: SignUpRequestDto): Promise<void> {
    const result = await this.commandBus.execute(new SignUpCommand(dto));

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
