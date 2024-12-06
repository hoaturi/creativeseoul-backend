import { IsNumber, IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const ENV_KEYS = {
  CLIENT: {
    BASE_URL: 'CLIENT_BASE_URL',
  },
  JWT: {
    ACCESS_SECRET: 'JWT_ACCESS_SECRET',
    REFRESH_SECRET: 'JWT_REFRESH_SECRET',
    ACCESS_EXPIRATION_IN_MS: 'JWT_ACCESS_EXPIRATION_IN_MS',
    REFRESH_EXPIRATION_IN_MS: 'JWT_REFRESH_EXPIRATION_IN_MS',
  },
  AWS: {
    REGION: 'AWS_REGION',
    ACCESS_KEY_ID: 'AWS_ACCESS_KEY_ID',
    SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
  },
  EMAIL: {
    FROM: 'EMAIL_FROM',
  },
} as const;

class EnvironmentVariables {
  @IsString()
  [ENV_KEYS.CLIENT.BASE_URL]: string;

  @IsString()
  [ENV_KEYS.JWT.ACCESS_SECRET]: string;
  @IsString()
  [ENV_KEYS.JWT.REFRESH_SECRET]: string;
  @IsNumber()
  [ENV_KEYS.JWT.ACCESS_EXPIRATION_IN_MS]: number;
  @IsNumber()
  [ENV_KEYS.JWT.REFRESH_EXPIRATION_IN_MS]: number;

  @IsString()
  [ENV_KEYS.AWS.REGION]: string;
  @IsString()
  [ENV_KEYS.AWS.ACCESS_KEY_ID]: string;
  @IsString()
  [ENV_KEYS.AWS.SECRET_ACCESS_KEY]: string;

  @IsString()
  [ENV_KEYS.EMAIL.FROM]: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
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
