"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class SourceValidator {
    constructor() {
        // create source validator
        this.createSourceValidator = joi_1.default.object({
            name: joi_1.default.string().required().empty(),
        });
        //  update source validator
        this.updateSourceValidator = joi_1.default.object({
            name: joi_1.default.string().required().empty(),
        });
    }
}
exports.default = SourceValidator;
