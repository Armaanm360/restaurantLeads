"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AgentValidator {
    constructor() {
        //login validator
        this.agentLoginValidator = joi_1.default.object({
            email: joi_1.default.string().lowercase().required(),
            password: joi_1.default.string().required(),
        });
        this.agentRegistrationValidator = joi_1.default.object({
            // Name: required, string, min length 3
            name: joi_1.default.string().min(3).required().messages({
                "string.base": "Name must be a string",
                "string.empty": "Name is required",
                "string.min": "Name must be at least 3 characters long",
                "any.required": "Name is required",
            }),
            // Email: required, must be a valid email
            email: joi_1.default.string().email().required().messages({
                "string.email": "Email must be a valid email address",
                "any.required": "Email is required",
            }),
            // Phone: optional, valid phone number format
            phone: joi_1.default.string()
                .optional()
                .pattern(/^[0-9]{10,15}$/)
                .messages({
                "string.pattern.base": "Phone number must be between 10 and 15 digits",
            }),
            // Password: required, string, min length 6
            password: joi_1.default.string().min(6).required().messages({
                "string.base": "Password must be a string",
                "string.empty": "Password is required",
                "string.min": "Password must be at least 6 characters long",
                "any.required": "Password is required",
            }),
            // Commission rate: optional, decimal between 0 and 100
            commission_rate: joi_1.default.number().optional().min(0).max(100).messages({
                "number.base": "Commission rate must be a number",
                "number.min": "Commission rate cannot be less than 0",
                "number.max": "Commission rate cannot be more than 100",
            }),
            // Avatar: optional, valid URL format
            avatar: joi_1.default.string().optional().messages({
                "string.uri": "Avatar must be a valid URL",
            }),
        });
        this.agentProfileUpdateValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            commission_rate: joi_1.default.number().optional(),
        });
        // change password
        this.changePassword = joi_1.default.object({
            old_password: joi_1.default.string(),
            new_password: joi_1.default.string(),
        });
        this.agentForgetPasswordValidator = joi_1.default.object({
            token: joi_1.default.string().required().messages({
                "any.required": "Provide valid token",
                "string.base": "Provide valid token",
            }),
            email: joi_1.default.string().required().messages({
                "any.required": "Provide valid email",
                "string.base": "Provide valid email",
            }),
            password: joi_1.default.string().min(8).required().messages({
                "any.required": "Please provide a valid password",
                "string.min": "Password length must be at least 8 characters",
                "string.base": "Please provide a valid password",
            }),
        });
    }
}
exports.default = AgentValidator;
