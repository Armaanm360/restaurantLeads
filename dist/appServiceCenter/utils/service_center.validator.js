"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ServiceCenterValidator {
    constructor() {
        this.updateServiceCenterValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            service_center_name: joi_1.default.string().optional(),
            location: joi_1.default.string().optional(),
            type: joi_1.default.string().optional(),
        }).optional();
    }
}
exports.default = ServiceCenterValidator;
