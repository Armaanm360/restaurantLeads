"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class AuthValidator {
    // member reg validator
    registrationMemberValidator() {
        return [
            (0, express_validator_1.body)("name").exists().notEmpty().isString(),
            (0, express_validator_1.body)("address").exists().notEmpty().isString(),
            (0, express_validator_1.body)("email").exists().notEmpty().isEmail(),
            (0, express_validator_1.body)("user_name").exists().notEmpty().isString(),
            (0, express_validator_1.body)("user_email").exists().notEmpty().isEmail(),
            (0, express_validator_1.body)("password").exists().notEmpty().isString(),
        ];
    }
    loginValidator() {
        return [
            (0, express_validator_1.body)("email", "Enter valid email").exists().isEmail(),
            (0, express_validator_1.body)("password").exists().isString(),
        ];
    }
}
exports.default = AuthValidator;
