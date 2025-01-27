import { body, param } from "express-validator";
import { SEND_OTP_TYPES } from "./validatorConstants";

class CommonValidator {
  // commin login input validator
  public loginValidator() {
    return [
      body("email", "Enter valid email or phone").exists().isEmail(),
      body("password", "Enter valid password minimun length 8")
        .exists()
        .isString()
        .isLength({ min: 8 }),
    ];
  }

  // common registration input validator
  public registrationValidator() {
    return [
      body("email", "Enter a valid email address").isEmail(),
      body("password", "Password length must be minimum 8 length").isLength({
        min: 8,
      }),
      body("name", "Enter a valid name").exists(),
      body("mobileNumber", "Enter valid mobileNumber").exists(),
      body("companyName", "Enter a valid company name").exists(),
    ];
  }

  // common single param id input validator
  public commonSingleParamsIdInputValidator(
    id: string = "id",
    errMsg: string = "Provide a valid id in params"
  ) {
    return [param(id, errMsg).exists().isInt()];
  }

  // common single param id input validator
  public commonDoubleParamsIdInputValidator(
    id: string = "id",
    errMsg: string = "Provide a valid id in params",
    id2: string = "id",
    errMsg2: string = "Provide a valid id in params"
  ) {
    return [
      param(id, errMsg).exists().isInt(),
      param(id2, errMsg2).exists().isInt(),
    ];
  }

  // common forget password input validator
  public commonForgetPassInputValidation() {
    return [
      body("token", "Provide valid token").isString(),
      body("email", "Provide valid email").isString(),
      body(
        "password",
        "Please provide valid password thats length must be min 8"
      ).isLength({ min: 8 }),
    ];
  }

  // send email otp input validator
  public sendOtpInputValidator() {
    return [
      body("type", "Please enter valid OTP type").isIn(SEND_OTP_TYPES),
      body("email", "Enter valid email address").isEmail(),
    ];
  }

  // match email otp input validator
  public matchEmailOtpInputValidator() {
    return [
      body("email", "Enter valid email").isEmail(),
      body("otp", "Enter valid otp").isString(),
      body("type", "Enter valid otp type").isIn(SEND_OTP_TYPES),
    ];
  }

  // common change password input validation
  public commonChangePassInputValidation() {
    return [
      body("old_password", "Body must be include old password").isString(),
      body("new_password", "Body must be include old password").isString(),
    ];
  }
}

export default CommonValidator;
