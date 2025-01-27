"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class PermissionValidator {
    constructor() {
        //Create Restaurant Validator
        this.createGroup = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        this.createGroupPermission = joi_1.default.object({
            permission_group_id: joi_1.default.number().required(),
            name: joi_1.default.string().required(),
        });
        //update restaurant validator
        this.updateRestaurantValidator = joi_1.default.object({
            restaurant_name: joi_1.default.string().required(),
            restaurant_version: joi_1.default.number().required(),
            restaurant_nbr_percentage: joi_1.default.number().required(),
            restaurant_bin_number: joi_1.default.string().required(),
            restaurant_address: joi_1.default.string().required(),
            restaurant_hotline: joi_1.default.string().required(),
            restaurant_owner_name: joi_1.default.string().optional(),
            // photo: Joi.string().required(),
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
exports.default = PermissionValidator;
