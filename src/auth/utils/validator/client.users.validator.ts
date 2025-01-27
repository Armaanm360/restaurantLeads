import Joi from 'joi';

class ClientValidator {
  //login validator

  public clientLoginValidator = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  });

  public clientProfileUpdateValidator = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    designation: Joi.string(),
    photo: Joi.string(),
  });

  public clientForgetPasswordValidator = Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Provide valid token',
      'string.base': 'Provide valid token',
    }),
    email: Joi.string().required().messages({
      'any.required': 'Provide valid email',
      'string.base': 'Provide valid email',
    }),
    password: Joi.string().min(8).required().messages({
      'any.required': 'Please provide a valid password',
      'string.min': 'Password length must be at least 8 characters',
      'string.base': 'Please provide a valid password',
    }),
  });
}

export default ClientValidator;
