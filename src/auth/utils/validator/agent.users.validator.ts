import Joi from "joi";

class AgentValidator {
  //login validator
  public agentLoginValidator = Joi.object({
    email: Joi.string().lowercase().required(),
    password: Joi.string().required(),
  });

  public agentRegistrationValidator = Joi.object({
    // Name: required, string, min length 3
    name: Joi.string().min(3).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters long",
      "any.required": "Name is required",
    }),

    // Email: required, must be a valid email
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),

    // Phone: optional, valid phone number format
    phone: Joi.string()
      .optional()
      .pattern(/^[0-9]{10,15}$/)
      .messages({
        "string.pattern.base": "Phone number must be between 10 and 15 digits",
      }),

    // Password: required, string, min length 6
    password: Joi.string().min(6).required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),

    // Commission rate: optional, decimal between 0 and 100
    commission_rate: Joi.number().optional().min(0).max(100).messages({
      "number.base": "Commission rate must be a number",
      "number.min": "Commission rate cannot be less than 0",
      "number.max": "Commission rate cannot be more than 100",
    }),

    // Avatar: optional, valid URL format
    avatar: Joi.string().optional().messages({
      "string.uri": "Avatar must be a valid URL",
    }),
  });

  public agentProfileUpdateValidator = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    commission_rate: Joi.number().optional(),
  });

  // change password
  public changePassword = Joi.object({
    old_password: Joi.string(),
    new_password: Joi.string(),
  });

  public agentForgetPasswordValidator = Joi.object({
    token: Joi.string().required().messages({
      "any.required": "Provide valid token",
      "string.base": "Provide valid token",
    }),
    email: Joi.string().required().messages({
      "any.required": "Provide valid email",
      "string.base": "Provide valid email",
    }),
    password: Joi.string().min(8).required().messages({
      "any.required": "Please provide a valid password",
      "string.min": "Password length must be at least 8 characters",
      "string.base": "Please provide a valid password",
    }),
  });
}

export default AgentValidator;
