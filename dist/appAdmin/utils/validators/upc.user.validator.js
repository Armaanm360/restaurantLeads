"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class UpcUserPanelValidator {
    constructor() {
        // card reedem validator
        this.cardReedemValidator = joi_1.default.object({
            card_id: joi_1.default.number().required(),
            service_id: joi_1.default.number().required(),
            check_in_items: joi_1.default.array()
                .items(joi_1.default.object({
                card_amenities_id: joi_1.default.number().required(),
                quantity: joi_1.default.number().required(),
            }))
                .required(),
        });
        // other card reedem validator
        this.otherCardReedemValidator = joi_1.default.object({
            card_id: joi_1.default.number().required(),
            service_id: joi_1.default.number().required(),
            check_in_items: joi_1.default.array()
                .items(joi_1.default.object({
                amenities_id: joi_1.default.number().required(),
                quantity: joi_1.default.number().required(),
            }))
                .required(),
        });
    }
}
exports.default = UpcUserPanelValidator;
