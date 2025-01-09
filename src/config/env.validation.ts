import { IsString, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables {
  @IsString()
  public readonly CLIENT_BASE_URL: string;

  @IsString()
  public readonly SESSION_SECRET: string;

  @IsString()
  public readonly AWS_REGION: string;

  @IsString()
  public readonly AWS_ACCESS_KEY_ID: string;

  @IsString()
  public readonly AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  public readonly CLOUDFLARE_R2_TOKEN: string;

  @IsString()
  public readonly CLOUDFLARE_R2_ACCESS_KEY: string;

  @IsString()
  public readonly CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;

  @IsString()
  public readonly CLOUDFLARE_R2_ENDPOINT: string;

  @IsString()
  public readonly CLOUDFLARE_R2_BUCKET: string;

  @IsString()
  public readonly CLOUDFLARE_R2_REGION: string;

  @IsString()
  public readonly EMAIL_FROM: string;

  @IsString()
  public readonly LEMON_SQUEEZY_API_KEY: string;

  @IsString()
  public readonly LEMON_SQUEEZY_STORE_ID: string;
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
