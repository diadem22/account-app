// create-account.dto.ts

import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class AccountDto {
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
