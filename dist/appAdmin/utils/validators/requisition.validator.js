"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RequisitionValidator {
    constructor() {
        //Create Permission Group
        this.createItem = joi_1.default.object({
            name: joi_1.default.string().required(),
            description: joi_1.default.string().allow(''),
            category: joi_1.default.string().required(),
            // quantity: Joi.number().integer().min(0).required(),
            // reorder_level: Joi.number().integer().min(0).required(),
            // unit_price: Joi.number().precision(2).min(0), // Optional
        });
        this.updateItem = joi_1.default.object({
            name: joi_1.default.string().optional(),
            description: joi_1.default.string().allow(''),
            category: joi_1.default.string().optional(),
            // quantity: Joi.number().integer().min(0).required(),
            // reorder_level: Joi.number().integer().min(0).required(),
            // unit_price: Joi.number().precision(2).min(0), // Optional
        });
        this.createRequisition = joi_1.default.object({
            user_id: joi_1.default.number().optional(),
            item_id: joi_1.default.number().required(),
            quantity: joi_1.default.number().required(),
            require_reason: joi_1.default.string().allow(''), // Allow empty description
        });
        this.createNewStock = joi_1.default.object({
            item_id: joi_1.default.number().required(),
            quantity: joi_1.default.number().required(),
            transaction_date: joi_1.default.string().required(),
            remarks: joi_1.default.string().allow(''),
        });
        this.createPolls = joi_1.default.object({
            title: joi_1.default.string().max(255).required(),
            options: joi_1.default.string().required(),
            image: joi_1.default.string().max(255).allow(null, ''),
            poll_type: joi_1.default.string().max(50).required(),
            allow_multiple_answers: joi_1.default.boolean().default(false),
            close_poll_on_schedule: joi_1.default.boolean().default(false),
            schedule_close_time: joi_1.default.date().iso().allow(null).optional(),
            is_deleted: joi_1.default.boolean().default(false),
            result_visibility: joi_1.default.string().valid('always_public', 'public_after_end_date', 'private'),
        });
    }
}
exports.default = RequisitionValidator;
