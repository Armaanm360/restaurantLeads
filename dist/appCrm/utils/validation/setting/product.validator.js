"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ProductValidator {
    constructor() {
        // create source validator
        this.createProductValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        this.updateProductValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
    }
}
exports.default = ProductValidator;
