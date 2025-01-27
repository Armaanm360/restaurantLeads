import { body } from "express-validator";

class AuthValidator {
  // member reg validator
  public registrationMemberValidator() {
    return [
      body("name").exists().notEmpty().isString(),
      body("address").exists().notEmpty().isString(),
      body("email").exists().notEmpty().isEmail(),
      body("user_name").exists().notEmpty().isString(),
      body("user_email").exists().notEmpty().isEmail(),
      body("password").exists().notEmpty().isString(),
    ];
  }

  public loginValidator() {
    return [
      body("email", "Enter valid email").exists().isEmail(),
      body("password").exists().isString(),
    ];
  }
}

export default AuthValidator;
