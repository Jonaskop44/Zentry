import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'generated/prisma';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;
}
