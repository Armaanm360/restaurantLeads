"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AgentDocumentValidator {
    constructor() {
        // create agent document
        this.createAGentDocuments = joi_1.default.object({
            business_name: joi_1.default.string().optional(),
            nid_number: joi_1.default.string().optional(),
            nid_card_file: joi_1.default.any().optional(),
            tin_number: joi_1.default.string().optional(),
            professional_license: joi_1.default.string().optional(),
            bank_statement_url: joi_1.default.any().optional(),
            proof_of_address_url: joi_1.default.any().optional(),
            company_profile_url: joi_1.default.any().optional(),
            reference_letters_url: joi_1.default.any().optional(),
            agreement_with_property_owners_url: joi_1.default.any().optional(),
            training_certificates_url: joi_1.default.any().optional(),
            profile_picture_url: joi_1.default.any().optional(),
        });
    }
}
exports.default = AgentDocumentValidator;
