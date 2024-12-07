import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  readonly token: string;
}
