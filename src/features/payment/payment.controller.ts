import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ProcessWebhookCommand } from './commands/process-webhook/process-webhook.command';
import { CommandBus } from '@nestjs/cqrs';
import { CurrentUser } from '../../infrastructure/security/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../infrastructure/security/authenticated-user.interface';
import { CreateCheckoutRequestDto } from './dtos/create-checkout-request.dto';
import { CreateCreditCheckoutCommand } from './commands/create-credit-checkout/create-credit-checkout.command';
import { AuthGuard } from '../../infrastructure/security/guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateCheckoutResponseDto } from './dtos/create-checkout-response.dto';
import { AuthError } from '../auth/auth.error';
import { CommonError } from '../common/common.error';
import { applicationConfig } from '../../config/application.config';
import { ConfigType } from '@nestjs/config';
import { Roles } from '../../infrastructure/security/decorators/roles.decorator';
import { UserRole } from '../../domain/user/user-role.enum';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { StripeService } from '../../infrastructure/services/stripe/stripe.service';
import { CreateSponsorshipCheckoutCommand } from './commands/create-sponsorship-checkout/create-sponsorship-checkout.command';

@Controller('payments')
export class PaymentController {
  public constructor(
    private readonly commandBus: CommandBus,
    @Inject(applicationConfig.KEY)
    private readonly appConfig: ConfigType<typeof applicationConfig>,
    private readonly stripeService: StripeService,
  ) {}

  @Post('webhooks')
  public async processWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    const event = this.stripeService.verifyWebhook(req.rawBody!, signature);

    const command = new ProcessWebhookCommand(event);

    await this.commandBus.execute(command);
  }

  @Post('checkout/credit')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: CreateCheckoutResponseDto,
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
  public async createCreditCheckout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCheckoutRequestDto,
  ): Promise<CreateCheckoutResponseDto> {
    const command = new CreateCreditCheckoutCommand(user, dto);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }

  @Post('checkout/sponsorship')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.COMPANY)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOkResponse({
    type: CreateCheckoutResponseDto,
  })
  @ApiUnauthorizedResponse({
    example: AuthError.Unauthenticated,
  })
  public async createSponsorshipCheckout(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CreateCheckoutResponseDto> {
    const command = new CreateSponsorshipCheckoutCommand(user);

    const result = await this.commandBus.execute(command);

    if (!result.isSuccess) {
      throw new HttpException(result.error, result.error.statusCode);
    }

    return result.value;
  }
}
