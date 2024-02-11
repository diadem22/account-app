import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';
import { UserType } from 'src/models/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['A', 'B']) // Assuming userType can be either 'A' or 'B'
  readonly userType: UserType;
}
