"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class UserValidator {
    constructor() {
        //Create Restaurant Validator
        this.userCreation = joi_1.default.object({
            owner_name: joi_1.default.string().required(),
            company_name: joi_1.default.string().optional(),
            email: joi_1.default.string().email().required(),
            phone: joi_1.default.string().required(),
            password: joi_1.default.string().required().min(6).max(255),
            role_id: joi_1.default.number().optional(),
            address: joi_1.default.string().optional(),
            restaurant_id: joi_1.default.number().required(),
        });
        this.userUpdate = joi_1.default.object({
            owner_name: joi_1.default.string().optional(),
            company_name: joi_1.default.string().optional(),
            email: joi_1.default.string().email().optional(),
            phone: joi_1.default.string().optional(),
            role_id: joi_1.default.number().optional(),
            address: joi_1.default.string().optional(),
            restaurant_id: joi_1.default.number().optional(),
        });
    }
}
exports.default = UserValidator;
