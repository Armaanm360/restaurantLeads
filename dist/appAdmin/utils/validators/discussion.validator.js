"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class DiscussionValidator {
    constructor() {
        //Create Permission Group
        this.createDiscussion = joi_1.default.object({
            discussion: joi_1.default.string().required(),
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
exports.default = DiscussionValidator;
