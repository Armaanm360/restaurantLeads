"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const responseMessage_1 = __importDefault(require("../../../utils/miscellaneous/responseMessage"));
class UserValidator {
    // member reg validator
    userValidator() {
        return [
            (0, express_validator_1.body)('name', responseMessage_1.default.HTTP_UNPROCESSABLE_ENTITY)
                .exists()
                .notEmpty()
                .isString(),
            (0, express_validator_1.body)('username', responseMessage_1.default.HTTP_UNPROCESSABLE_ENTITY)
                .exists()
                .notEmpty()
                .isLength({ min: 4, max: 14 })
                .isString(),
            (0, express_validator_1.body)('designation', responseMessage_1.default.HTTP_UNPROCESSABLE_ENTITY)
                .exists()
                .notEmpty()
                .isString(),
            (0, express_validator_1.body)('level', responseMessage_1.default.HTTP_UNPROCESSABLE_ENTITY)
                .exists()
                .notEmpty()
                .isNumeric(),
            (0, express_validator_1.body)('association_id', responseMessage_1.default.HTTP_UNPROCESSABLE_ENTITY)
                .exists()
                .notEmpty()
                .isNumeric(),
            (0, express_validator_1.body)('password', 'Enter valid password minimun length 8')
                .exists()
                .isString()
                .isLength({ min: 8 }),
            // body('phone', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
            //   .isString()
            //   .isLength({ min: 14, max: 14 })
            //   .custom((value) => {
            //     if (!value.startsWith('+88')) {
            //       return false;
            //     } else {
            //       return true;
            //     }
            //   }),
        ];
    }
    loginValidator() {
        return [
            (0, express_validator_1.body)('email', 'Enter valid email or phone').exists().isEmail(),
            (0, express_validator_1.body)('password', 'Enter valid password minimun length 8')
                .exists()
                .isString()
                .isLength({ min: 8 }),
        ];
    }
    adminValidator() {
        return [
        // body('email', ResMsg.HTTP_UNPROCESSABLE_ENTITY).exists().isString(),
        // body('password', ResMsg.HTTP_UNPROCESSABLE_ENTITY).exists().isString(),
        ];
    }
}
exports.default = UserValidator;
