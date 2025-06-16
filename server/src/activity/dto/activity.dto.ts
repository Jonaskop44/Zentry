import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ActivityType } from 'generated/prisma';

export class StartActivityDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  readonly activityType: ActivityType;

  @IsNumber()
  @IsNotEmpty()
  readonly employeeId: number;
}

export class UpdateActivityDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  readonly activityType: ActivityType;

  @IsNumber()
  @IsNotEmpty()
  readonly employeeId: number;
}
