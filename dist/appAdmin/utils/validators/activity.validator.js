"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class activityValidator {
    constructor() {
        //Create Permission Group
        this.createLeaveTypes = joi_1.default.array().items(joi_1.default.object({
            name: joi_1.default.string().required(),
            deduct_from_allowance: joi_1.default.boolean().required(),
            is_enabled: joi_1.default.boolean().required(),
            tag_color: joi_1.default.string().required(),
        }));
        this.createActivity = joi_1.default.array().items(joi_1.default.object({
            log_datetime: joi_1.default.date().iso().required(),
            activity_description: joi_1.default.string().required(),
        }));
        this.createOtherActivity = joi_1.default.object({
            type: joi_1.default.string().valid("visit", "call").required(),
            visit_note: joi_1.default.string().optional(),
            visit_date: joi_1.default.string().optional(),
            call_note: joi_1.default.string().optional(),
        });
        this.createLeave = joi_1.default.object({
            employee_id: joi_1.default.number().integer().required(),
            leave_type: joi_1.default.number().integer().required(),
            status: joi_1.default.string().valid("pending", "approved", "rejected").required(),
            start_date: joi_1.default.date().iso().required(),
            end_date: joi_1.default.date().iso().required(),
            number_of_working_days: joi_1.default.number().required(),
            comments: joi_1.default.string().allow("").optional(),
            half_day: joi_1.default.boolean().optional(),
        });
        this.createLeaveEmployee = joi_1.default.object({
            leave_type: joi_1.default.number().integer().required(),
            start_date: joi_1.default.date().iso().required(),
            end_date: joi_1.default.date().iso().required(),
            number_of_working_days: joi_1.default.number().required(),
            comments: joi_1.default.string().allow("").optional(),
            half_day: joi_1.default.boolean().optional(),
        });
        this.updateLeaveEmployee = joi_1.default.object({
            leave_type: joi_1.default.number().integer().required(),
            start_date: joi_1.default.date().iso().required(),
            end_date: joi_1.default.date().iso().required(),
            number_of_working_days: joi_1.default.number().required(),
            comments: joi_1.default.string().allow("").optional(),
            half_day: joi_1.default.boolean().optional(),
        });
        this.updateLeave = joi_1.default.object({
            employee_id: joi_1.default.number().integer().optional(),
            leave_type: joi_1.default.number().integer().optional(),
            status: joi_1.default.string()
                .valid("pending", "approved", "rejected", "revoked")
                .optional(),
            start_date: joi_1.default.date().iso().optional(),
            end_date: joi_1.default.date().iso().optional(),
            number_of_working_days: joi_1.default.number().optional(),
            comments: joi_1.default.string().allow("").optional(),
            half_day: joi_1.default.boolean().optional(),
            revoked: joi_1.default.boolean().optional(),
            revoke_reason: joi_1.default.string().optional(),
            reject_reason: joi_1.default.string().optional(),
            leave_submission_time: joi_1.default.string().optional(),
        });
    }
}
exports.default = activityValidator;
