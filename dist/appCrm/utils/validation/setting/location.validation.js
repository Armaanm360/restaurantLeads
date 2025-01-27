"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class LocationValidator {
    constructor() {
        // add country validator
        this.addCountryvalidator = joi_1.default.object({
            name: joi_1.default.string().trim().required(),
        });
        // update country validator
        this.updateCountryvalidator = joi_1.default.object({
            name: joi_1.default.string().trim().required(),
        });
        // addCity validator
        this.addCityvalidator = joi_1.default.object({
            name: joi_1.default.string().trim().required(),
            country_id: joi_1.default.number().required(),
        });
        // update city
        this.updateCityvalidator = joi_1.default.object({
            name: joi_1.default.string().trim().optional(),
            country_id: joi_1.default.number().optional(),
        });
        // update area
        this.addAreavalidator = joi_1.default.object({
            name: joi_1.default.string().trim().required(),
            city_id: joi_1.default.number().required(),
        });
    }
}
exports.default = LocationValidator;
