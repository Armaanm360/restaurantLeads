"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ClientValidator {
    constructor() {
        //login validator
        this.clientLoginValidator = joi_1.default.object({
            email: joi_1.default.string().lowercase().required(),
            password: joi_1.default.string().required(),
        });
        this.clientProfileUpdateValidator = joi_1.default.object({
            name: joi_1.default.string(),
            phone: joi_1.default.string(),
            designation: joi_1.default.string(),
            photo: joi_1.default.string(),
        });
        this.clientForgetPasswordValidator = joi_1.default.object({
            token: joi_1.default.string().required().messages({
                'any.required': 'Provide valid token',
                'string.base': 'Provide valid token',
            }),
            email: joi_1.default.string().required().messages({
                'any.required': 'Provide valid email',
                'string.base': 'Provide valid email',
            }),
            password: joi_1.default.string().min(8).required().messages({
                'any.required': 'Please provide a valid password',
                'string.min': 'Password length must be at least 8 characters',
                'string.base': 'Please provide a valid password',
            }),
        });
    }
}
exports.default = ClientValidator;
