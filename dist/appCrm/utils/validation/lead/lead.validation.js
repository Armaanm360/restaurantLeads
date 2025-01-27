"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class LeadValidator {
    constructor() {
        // create lead validator
        this.createLeadValidator = joi_1.default.object({
            lead: joi_1.default.object({
                status: joi_1.default.string()
                    .valid("sold", "negative_lead", "positive_lead", "no_status")
                    .default("no_status")
                    .required(),
                area_id: joi_1.default.number().integer().optional(),
                source_id: joi_1.default.number().integer().required(),
                org_type_id: joi_1.default.number().integer().required(),
                org_name: joi_1.default.string().optional(),
                reference: joi_1.default.string().allow("").optional(),
                contact_person: joi_1.default.string().optional(),
                org_address: joi_1.default.string().optional(),
                contact_email: joi_1.default.string().email().optional(),
                contact_number: joi_1.default.string().required(),
                additional_contact_number: joi_1.default.string().allow("").optional(),
                product_id: joi_1.default.number().required(),
                team_id: joi_1.default.number().optional(),
            }),
            contact_lead: joi_1.default.object({
                assign_lead: joi_1.default.array().items(joi_1.default.number().required()).required(),
                description: joi_1.default.string().optional(),
                follow_up: joi_1.default.number().integer().optional(),
                follow_up_date: joi_1.default.date().optional(),
                phone_call: joi_1.default.number().integer().optional(),
                call_note: joi_1.default.string().optional(),
                requirement: joi_1.default.string().optional(),
                sale_amount: joi_1.default.number().optional(),
                sale_time: joi_1.default.string().optional(),
                sale_by: joi_1.default.number().integer().optional(),
                paid_amount: joi_1.default.number().optional(),
                proposal_amount: joi_1.default.number().optional(),
                sale_type: joi_1.default.string()
                    .valid("monthly", "yearly", "half-yearly")
                    .optional(),
            }),
        });
        // update lead validator
        this.updateLeadValidator = joi_1.default.object({
            lead: joi_1.default.object({
                area_id: joi_1.default.number().integer().optional(),
                source_id: joi_1.default.number().integer().optional(),
                org_type_id: joi_1.default.number().integer().optional(),
                org_name: joi_1.default.string().optional(),
                reference: joi_1.default.string().optional(),
                contact_person: joi_1.default.string().optional(),
                org_address: joi_1.default.string().optional(),
                contact_email: joi_1.default.string().email().optional(),
                contact_number: joi_1.default.string().optional(),
                additional_contact_number: joi_1.default.string().allow("").optional(),
                product_id: joi_1.default.number().optional(),
            }),
            contact_lead: joi_1.default.object({
                status: joi_1.default.string()
                    .valid("sold", "negative_lead", "positive_lead", "no_status")
                    .optional(),
                assign_lead: joi_1.default.array().items(joi_1.default.number().optional()).optional(),
                remove_assign_lead: joi_1.default.array().items(joi_1.default.number().optional()).optional(),
                description: joi_1.default.string().optional(),
                follow_up: joi_1.default.number().integer().optional(),
                follow_up_date: joi_1.default.date().optional(),
                reference: joi_1.default.string().optional(),
                phone_call: joi_1.default.number().integer().optional(),
                call_note: joi_1.default.string().optional(),
                requirement: joi_1.default.string().optional(),
                sale_amount: joi_1.default.number().optional(),
                sale_time: joi_1.default.string().optional(),
                sale_by: joi_1.default.number().integer().optional(),
                paid_amount: joi_1.default.number().optional(),
                sale_type: joi_1.default.string()
                    .valid("monthly", "yearly", "half-yearly")
                    .optional(),
            }),
        });
        // contact lead validator
        this.contactLeadValidator = joi_1.default.object({
            lead_id: joi_1.default.number().integer().optional(),
            description: joi_1.default.string().optional(),
            assign_lead: joi_1.default.number().integer().optional(),
            follow_up: joi_1.default.number().integer().optional(),
            follow_up_date: joi_1.default.date().iso().optional(),
            phone_call: joi_1.default.number().integer().optional(),
            call_note: joi_1.default.string().optional(),
            status: joi_1.default.string().optional(),
            requirement: joi_1.default.string().optional(),
            sale_amount: joi_1.default.number().optional(),
            sale_time: joi_1.default.date().iso().optional(),
            sale_by: joi_1.default.number().integer().optional(),
            sale_type: joi_1.default.string().optional(),
        });
        // contact lead validator
        this.assignAfterSales = joi_1.default.object({
            lead_id: joi_1.default.number().integer().required(),
            assign_to: joi_1.default.number().integer().required(),
            follow_up_date: joi_1.default.date().iso().optional(),
            note: joi_1.default.string().optional(),
            paying_amount: joi_1.default.number().optional(),
            targeted_amount: joi_1.default.number().optional(),
            payment_collection_date: joi_1.default.date().iso().optional(),
            type: joi_1.default.string()
                .valid("general", "support", "maintenance", "upgrade", "training", "feedback", "renewal", "complaint_resolution", "payment_collection", "payment_refund", "admin_payment")
                .required(),
        });
    }
}
exports.default = LeadValidator;
