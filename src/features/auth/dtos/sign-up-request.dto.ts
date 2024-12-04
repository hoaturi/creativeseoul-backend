import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
  @ApiProperty()
  @IsEmail()
  @MaxLength(256)
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
    message:
      'Password can only contain letters, numbers and special characters',
  })
  @MinLength(8)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  readonly fullName: string;

  @ApiProperty({
    enum: ['CANDIDATE', 'EMPLOYER'],
  })
  @IsEnum(['CANDIDATE', 'EMPLOYER'])
  readonly role: 'CANDIDATE' | 'EMPLOYER';
}
