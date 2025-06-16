import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ActivityType } from 'generated/prisma';

export class StartActivityDto {
  @IsEnum(ActivityType)
  @IsNotEmpty()
  readonly activityType: ActivityType;

  @IsNumber()
  @IsNotEmpty()
  readonly employeeId: number;
}
