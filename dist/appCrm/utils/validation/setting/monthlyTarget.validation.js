"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MonthlyTargetValidator {
    constructor() {
        // monthly target validator
        this.CreateMonthlyTarget = joi_1.default.object({
            phone_call: joi_1.default.number().required(),
            employee_ids: joi_1.default.array().items(joi_1.default.number().required()).required(),
            month: joi_1.default.date().iso().required(),
            visit: joi_1.default.number().required(),
            pd_target: joi_1.default.array()
                .items(joi_1.default.object({
                pd_id: joi_1.default.number().optional(),
                sale: joi_1.default.number().optional(),
            }))
                .optional(),
            sale_in_amount: joi_1.default.number().optional(),
        });
        // update monthly target
        this.updateMonthlyTarget = joi_1.default.object({
            phone_call: joi_1.default.number().optional(),
            employee_id: joi_1.default.number().optional(),
            month: joi_1.default.date().iso().optional(),
            visit: joi_1.default.number().optional(),
            sale_in_amount: joi_1.default.number().optional(),
            pd_target_remove: joi_1.default.array().items(joi_1.default.number().optional()).optional(),
            pd_target_update: joi_1.default.array()
                .items(joi_1.default.object({
                id: joi_1.default.number().required(),
                pd_id: joi_1.default.number().required(),
                sale: joi_1.default.number().required(),
            }))
                .optional(),
            pd_target_add: joi_1.default.array()
                .items(joi_1.default.object({
                pd_id: joi_1.default.number().required(),
                sale: joi_1.default.number().required(),
            }))
                .optional(),
        });
    }
}
exports.default = MonthlyTargetValidator;
