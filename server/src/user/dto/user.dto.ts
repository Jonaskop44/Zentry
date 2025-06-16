import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @Matches(/[0-9]/)
  @Matches(/[A-Z]/)
  @Matches(/[^a-zA-Z0-9]/)
  readonly password: string;
}
