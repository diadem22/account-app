// create-account.dto.ts

import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  @Min(1)
  user_id: number;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsInt()
  @Min(1)
  numberOfUsers: number;

  @IsInt()
  @Min(1)
  numberOfProducts: number;
}
