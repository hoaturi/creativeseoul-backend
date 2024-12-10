import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const ENV_KEYS = {
  CLIENT: {
    BASE_URL: 'CLIENT_BASE_URL',
  },
  SESSION: {
    SECRET: 'SESSION_SECRET',
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
  public readonly [ENV_KEYS.CLIENT.BASE_URL]: string;

  @IsString()
  public readonly [ENV_KEYS.SESSION.SECRET]: string;

  @IsString()
  public readonly [ENV_KEYS.AWS.REGION]: string;
  @IsString()
  public readonly [ENV_KEYS.AWS.ACCESS_KEY_ID]: string;
  @IsString()
  public readonly [ENV_KEYS.AWS.SECRET_ACCESS_KEY]: string;

  @IsString()
  public readonly [ENV_KEYS.EMAIL.FROM]: string;
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
