"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminUserValidator {
    constructor() {
        //Create Employee Validator
        this.createAdminValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            password: joi_1.default.string().required(),
            avatar: joi_1.default.string().optional(),
            role: joi_1.default.string().required(),
        });
        //Get All Employee Validator
        this.getAllEmployeeValidator = joi_1.default.object({
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            key: joi_1.default.string(),
        });
        //Update Employee Validator
        this.updateEmployeeValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            designation: joi_1.default.string().optional(),
            status: joi_1.default.string().optional(),
            shift_id: joi_1.default.number().optional(),
        });
        this.employeeShiftValidator = joi_1.default.object({
            shift_name: joi_1.default.string().required(),
            shift_start: joi_1.default.string().required(),
            shift_end: joi_1.default.string().required(),
            working_days: joi_1.default.string().required(),
        });
        //create shift validator
        this.createShiftValidator = joi_1.default.object({
            shift_name: joi_1.default.string().required(),
            shift_start: joi_1.default.string().required(),
            shift_end: joi_1.default.string().required(),
            // photo: Joi.string().required(),
        });
        //get all shift validator
        this.getAllShiftValidator = joi_1.default.object({
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            key: joi_1.default.string(),
        });
        this.updateShiftValidator = joi_1.default.object({
            shift_name: joi_1.default.string().optional(),
            shift_start: joi_1.default.string().optional(),
            shift_end: joi_1.default.string().optional(),
        });
    }
}
exports.default = AdminUserValidator;
