import Joi from 'joi';

export const createAccountSchema = Joi.object({
  companyName: Joi.string().required(),
  numberOfUsers: Joi.number().required(),
  numberOfProducts: Joi.number().required(),
});

export const updateAccountSchema = Joi.object({
  companyName: Joi.string(),
  numberOfUsers: Joi.number(),
  numberOfProducts: Joi.number(),
});
