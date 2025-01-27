"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validatorConstants_1 = require("./validatorConstants");
class CommonValidator {
    // commin login input validator
    loginValidator() {
        return [
            (0, express_validator_1.body)("email", "Enter valid email or phone").exists().isEmail(),
            (0, express_validator_1.body)("password", "Enter valid password minimun length 8")
                .exists()
                .isString()
                .isLength({ min: 8 }),
        ];
    }
    // common registration input validator
    registrationValidator() {
        return [
            (0, express_validator_1.body)("email", "Enter a valid email address").isEmail(),
            (0, express_validator_1.body)("password", "Password length must be minimum 8 length").isLength({
                min: 8,
            }),
            (0, express_validator_1.body)("name", "Enter a valid name").exists(),
            (0, express_validator_1.body)("mobileNumber", "Enter valid mobileNumber").exists(),
            (0, express_validator_1.body)("companyName", "Enter a valid company name").exists(),
        ];
    }
    // common single param id input validator
    commonSingleParamsIdInputValidator(id = "id", errMsg = "Provide a valid id in params") {
        return [(0, express_validator_1.param)(id, errMsg).exists().isInt()];
    }
    // common single param id input validator
    commonDoubleParamsIdInputValidator(id = "id", errMsg = "Provide a valid id in params", id2 = "id", errMsg2 = "Provide a valid id in params") {
        return [
            (0, express_validator_1.param)(id, errMsg).exists().isInt(),
            (0, express_validator_1.param)(id2, errMsg2).exists().isInt(),
        ];
    }
    // common forget password input validator
    commonForgetPassInputValidation() {
        return [
            (0, express_validator_1.body)("token", "Provide valid token").isString(),
            (0, express_validator_1.body)("email", "Provide valid email").isString(),
            (0, express_validator_1.body)("password", "Please provide valid password thats length must be min 8").isLength({ min: 8 }),
        ];
    }
    // send email otp input validator
    sendOtpInputValidator() {
        return [
            (0, express_validator_1.body)("type", "Please enter valid OTP type").isIn(validatorConstants_1.SEND_OTP_TYPES),
            (0, express_validator_1.body)("email", "Enter valid email address").isEmail(),
        ];
    }
    // match email otp input validator
    matchEmailOtpInputValidator() {
        return [
            (0, express_validator_1.body)("email", "Enter valid email").isEmail(),
            (0, express_validator_1.body)("otp", "Enter valid otp").isString(),
            (0, express_validator_1.body)("type", "Enter valid otp type").isIn(validatorConstants_1.SEND_OTP_TYPES),
        ];
    }
    // common change password input validation
    commonChangePassInputValidation() {
        return [
            (0, express_validator_1.body)("old_password", "Body must be include old password").isString(),
            (0, express_validator_1.body)("new_password", "Body must be include old password").isString(),
        ];
    }
}
exports.default = CommonValidator;
