import Joi from 'joi';

export const accountSchema = Joi.object({
  uuser_id: Joi.number().required,
  companyName: Joi.string().required,
  numberOfUsers: Joi.number().required,
  numberOfProducts: Joi.number().required,
});
