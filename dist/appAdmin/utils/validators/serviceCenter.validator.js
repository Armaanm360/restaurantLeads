"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminServiceCenterValidator {
    constructor() {
        //Create service center
        this.createServiceCenterValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            type: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            location: joi_1.default.string().required(),
        });
        //Update service center
        this.updateServiceCenterValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            type: joi_1.default.string().optional(),
            location: joi_1.default.string().optional(),
        });
    }
}
exports.default = AdminServiceCenterValidator;
