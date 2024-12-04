import { IsNumber, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class AppEnvironmentVariables {
  // JWT
  @IsString()
  JWT_ACCESS_SECRET: string;
  @IsString()
  JWT_REFRESH_SECRET: string;
  @IsNumber()
  JWT_ACCESS_EXPIRATION_IN_MS: number;
  @IsNumber()
  JWT_REFRESH_EXPIRATION_IN_MS: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(AppEnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
