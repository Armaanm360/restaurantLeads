import Joi from "joi";

class CommonValidator {
  // single param validator
  public singleParamValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().required();
    return Joi.object(schemaObject);
  };

  // single param string validator
  public singleParamStringValidator = (idFieldName: string = "id") => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().required();
    return Joi.object(schemaObject);
  };
  public doubleParamStringValidator = (
    idFieldName: string = "id",
    secidFieldName: string = "id"
  ) => {
    const schemaObject: any = {};
    schemaObject[idFieldName] = Joi.number().required();
    schemaObject[secidFieldName] = Joi.number().required();
    return Joi.object(schemaObject);
  };

  public changePasswordValidator = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
  });
  public queryListLimitSkip = Joi.object({
    limit: Joi.number().optional(),
    skip: Joi.number().optional(),
    from_date: Joi.string().allow("").optional(),
    to_date: Joi.string().allow("").optional(),
    employee: Joi.number().optional(),
    key: Joi.string().optional(),
  });
  public sendEmailOtpValidator = Joi.object({
    email: Joi.string().required(),
    type: Joi.string().required(),
  });
  public matchEmailOtpValidator = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
    type: Joi.string().required(),
  });

  public cnvEmpQueryValidator = Joi.object({
    type: Joi.string().valid("admin", "employee").required(),
  });
}

export default CommonValidator;
