import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';
import { AccountDto } from 'src/dto/account.dto';
import {
  createAccountSchema,
  updateAccountSchema,
} from 'src/schemas/account-schema';

@Injectable()
export class UserValidationPipe<Dto> implements PipeTransform<Dto> {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: Dto): Dto {
    const { error } = this.schema.validate(value, { stripUnknown: true });
    if (error) {
      throw new BadRequestException({
        message: error.message.replace(/"/g, ''),
        error: 'Bad Request',
        statusCode: 400,
      });
    }
    return value;
  }
}

@Injectable()
export class CreateAccountValidatorPipe implements PipeTransform<AccountDto> {
  public transform(value: AccountDto): AccountDto {
    const result = createAccountSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}

@Injectable()
export class UpdateAccountValidatorPipe implements PipeTransform<AccountDto> {
  public transform(value: AccountDto): AccountDto {
    const result = updateAccountSchema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
