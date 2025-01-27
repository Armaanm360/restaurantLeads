"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminEmployeeValidator {
    constructor() {
        //Create Employee Validator
        this.createEmployeeValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            email: joi_1.default.string().lowercase().required(),
            phone: joi_1.default.string().required(),
            designation: joi_1.default.string().optional(),
            password: joi_1.default.string().required(),
            type: joi_1.default.string().valid('employee', 'guest').optional(),
            shift_id: joi_1.default.number().optional(),
            permission_auth: joi_1.default.string().optional(),
            product_lead_permission: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    for (const item of parsedArray) {
                        if (typeof item !== 'number') {
                            return helpers.message({
                                custom: 'invalid permission array item type, item type will be number',
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: 'invalid permission, permission will be json array of number',
                    });
                }
            })
                .optional(),
        });
        //Get All Employee Validator
        this.getAllEmployeeValidator = joi_1.default.object({
            limit: joi_1.default.string(),
            skip: joi_1.default.string(),
            key: joi_1.default.string(),
            status: joi_1.default.string().valid('active', 'inactive'),
            type: joi_1.default.string().lowercase(),
        });
        //Update Employee Validator
        this.updateEmployeeValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            designation: joi_1.default.string().optional(),
            status: joi_1.default.string().optional(),
            shift_id: joi_1.default.number().optional(),
            permission_auth: joi_1.default.string().optional(),
            product_lead_permission: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedArray = JSON.parse(value);
                    for (const item of parsedArray) {
                        if (typeof item !== 'number') {
                            return helpers.message({
                                custom: 'invalid permission array item type, item type will be number',
                            });
                        }
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: 'invalid permission, permission will be json array of number',
                    });
                }
            })
                .optional(),
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
exports.default = AdminEmployeeValidator;
