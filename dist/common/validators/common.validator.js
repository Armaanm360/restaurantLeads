"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class CommonValidator {
    constructor() {
        // single param validator
        this.singleParamValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().required();
            return joi_1.default.object(schemaObject);
        };
        // single param string validator
        this.singleParamStringValidator = (idFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().required();
            return joi_1.default.object(schemaObject);
        };
        this.doubleParamStringValidator = (idFieldName = "id", secidFieldName = "id") => {
            const schemaObject = {};
            schemaObject[idFieldName] = joi_1.default.number().required();
            schemaObject[secidFieldName] = joi_1.default.number().required();
            return joi_1.default.object(schemaObject);
        };
        this.changePasswordValidator = joi_1.default.object({
            old_password: joi_1.default.string().required(),
            new_password: joi_1.default.string().required(),
        });
        this.queryListLimitSkip = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            from_date: joi_1.default.string().allow("").optional(),
            to_date: joi_1.default.string().allow("").optional(),
            employee: joi_1.default.number().optional(),
            key: joi_1.default.string().optional(),
        });
        this.sendEmailOtpValidator = joi_1.default.object({
            email: joi_1.default.string().required(),
            type: joi_1.default.string().required(),
        });
        this.matchEmailOtpValidator = joi_1.default.object({
            email: joi_1.default.string().required(),
            otp: joi_1.default.string().required(),
            type: joi_1.default.string().required(),
        });
        this.cnvEmpQueryValidator = joi_1.default.object({
            type: joi_1.default.string().valid("admin", "employee").required(),
        });
    }
}
exports.default = CommonValidator;
