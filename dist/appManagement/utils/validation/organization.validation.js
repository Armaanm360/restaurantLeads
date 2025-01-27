"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class OrganizationValidator {
    constructor() {
        //Create Restaurant Validator
        this.createOrganization = joi_1.default.object({
            name: joi_1.default.string().required().label('Name'),
            website: joi_1.default.string().uri().optional().label('Website'),
            sale_date: joi_1.default.string().optional(),
            expiry_date: joi_1.default.string().optional(),
            sale_by: joi_1.default.number().optional(),
            sale_amount: joi_1.default.number().optional(),
            sale_type: joi_1.default.string().optional(),
            password: joi_1.default.string().optional(),
            phone: joi_1.default.string()
                .pattern(/^[0-9]+$/)
                .required()
                .label('Phone'),
            country_id: joi_1.default.number().integer().optional().label('Country ID'),
            city_id: joi_1.default.number().integer().optional().label('City ID'),
            address: joi_1.default.string().optional().label('Address'),
            postal_code: joi_1.default.string().optional().label('Postal Code'),
            email: joi_1.default.string().email().required().label('Email'),
            permission_group: joi_1.default.string().required(),
            // permission_group_employee: Joi.string().required(),
            user_name: joi_1.default.string().required(),
            leave_allowance: joi_1.default.number().optional(),
            user_email: joi_1.default.string().email().required(),
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
exports.default = OrganizationValidator;
