import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { EVENT_TYPE } from '../../../domain/event/event-type.constant';
import { Type } from 'class-transformer';
import { IsDateGreaterThan } from '../../../common/decorators/is-date-greater-than.decorator';

export class CreateEventRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly summary!: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(EVENT_TYPE.length)
  public readonly eventTypeId!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  public readonly description!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  public readonly startDate!: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsDateGreaterThan('startDate', {
    message: 'endDate must be greater than startDate',
  })
  public readonly endDate!: Date;

  @ApiProperty()
  @IsUrl()
  public readonly coverImageUrl!: string;

  @ApiProperty()
  @IsUrl()
  public readonly websiteUrl!: string;
}
