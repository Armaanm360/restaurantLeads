"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class NoticeValidator {
    constructor() {
        // create notice validator
        this.creatNoticeValidator = joi_1.default.object({
            title: joi_1.default.string().required(),
            description: joi_1.default.string().required(),
        });
        // update notice validator
        this.updateNoticeValidator = joi_1.default.object({
            title: joi_1.default.string().optional(),
            description: joi_1.default.string().optional(),
            status: joi_1.default.number().valid(0, 1).optional(),
        });
    }
}
exports.default = NoticeValidator;
