"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AgentPropertyValidator {
    constructor() {
        // create property validator
        this.createPropertyValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            title: joi_1.default.string().required(),
            description: joi_1.default.string().optional(),
            address: joi_1.default.string().required(),
            property_type: joi_1.default.number().integer().required(),
            property_area: joi_1.default.number().positive().required(),
            num_rooms: joi_1.default.number().integer().positive().optional(),
            num_bathrooms: joi_1.default.number().integer().positive().optional(),
            floor_number: joi_1.default.number().integer().optional(),
            latitude: joi_1.default.number().precision(8).required(),
            longitude: joi_1.default.number().precision(8).required(),
            price: joi_1.default.number().positive().required(),
            property_status: joi_1.default.number().integer().required(),
            amenities: joi_1.default.any(),
            features: joi_1.default.any(),
        });
        // update property validator
        this.updatePropertyValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            title: joi_1.default.string().optional(),
            description: joi_1.default.string().optional(),
            address: joi_1.default.string().optional(),
            property_type: joi_1.default.number().integer().optional(),
            property_area: joi_1.default.number().positive().optional(),
            num_rooms: joi_1.default.number().integer().positive().optional(),
            num_bathrooms: joi_1.default.number().integer().positive().optional(),
            floor_number: joi_1.default.number().integer().optional(),
            latitude: joi_1.default.number().precision(8).optional(),
            longitude: joi_1.default.number().precision(8).optional(),
            price: joi_1.default.number().positive().optional(),
            property_status: joi_1.default.number().integer().optional(),
            amenities: joi_1.default.any().optional(),
            features: joi_1.default.any().optional(),
            delete_images: joi_1.default.any().optional(),
            delete_documents: joi_1.default.any().optional(),
        });
    }
}
exports.default = AgentPropertyValidator;
