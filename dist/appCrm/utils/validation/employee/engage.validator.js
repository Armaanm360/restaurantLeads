"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class EngageLeadValidator {
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
        this.EngageLead = joi_1.default.object({
            location: joi_1.default.object({
                area_id: joi_1.default.number().integer().optional(),
            }).optional(),
            ps: joi_1.default.object({
                product_id: joi_1.default.number().integer().optional(),
                source_id: joi_1.default.number().integer().optional(),
            }).optional(),
            organization: joi_1.default.object({
                org_type_id: joi_1.default.number().integer().optional(),
                org_name: joi_1.default.string().optional(),
                contact_person: joi_1.default.string().optional(),
                org_address: joi_1.default.string().optional(),
                contact_email: joi_1.default.string().email().optional(),
                contact_number: joi_1.default.string().optional(),
                additional_contact_number: joi_1.default.string().optional(),
            }).optional(),
            contact_lead: joi_1.default.object({
                status: joi_1.default.string()
                    .valid("positive_lead", "negative_lead", "no_status", "sold", "forwarded")
                    .optional(),
                description: joi_1.default.string().optional(),
                follow_up: joi_1.default.number().integer().optional(),
                follow_up_date: joi_1.default.date().required(),
                phone_call: joi_1.default.number().integer().optional(),
                call_note: joi_1.default.string().optional(),
            }).optional(),
            sale: joi_1.default.object({
                requirement: joi_1.default.string().optional(),
                sale_type: joi_1.default.string().valid("monthly", "yearly").optional(),
                sale_amount: joi_1.default.number().optional(),
                sale_time: joi_1.default.date().optional(),
            }).optional(),
            agreement: joi_1.default.object({
                paper_sent: joi_1.default.number().integer().optional(),
                paper_sent_note: joi_1.default.string().optional(),
            }).optional(),
            demo: joi_1.default.object({
                demo_sent: joi_1.default.number().integer().optional(),
                demo_sent_note: joi_1.default.string().optional(),
            }).optional(),
            visit: joi_1.default.object({
                visit_status: joi_1.default.number().integer().optional(),
                visit_date: joi_1.default.date().optional(),
                visit_note: joi_1.default.string().optional(),
            }).optional(),
            forward: joi_1.default.object({
                forward_status: joi_1.default.number().integer().optional(),
                forward_note: joi_1.default.string().optional(),
                forward_time: joi_1.default.date().optional(),
                forward_to: joi_1.default.number().integer().optional(),
            }).optional(),
        });
        // contact lead validator
        this.contactLeadValidator = joi_1.default.object({
            status: joi_1.default.string()
                .valid("positive_lead", "negative_lead", "no_status", "sold", "forwarded")
                .optional(),
            description: joi_1.default.string().optional(),
            follow_up: joi_1.default.number().integer().optional(),
            follow_up_date: joi_1.default.date().optional(),
            phone_call: joi_1.default.number().integer().optional(),
            call_note: joi_1.default.string().optional(),
        }).optional();
        this.SaleValidator = joi_1.default.object({
            requirement: joi_1.default.string().optional(),
            sale_type: joi_1.default.string()
                .valid("monthly", "yearly", "half-yearly")
                .optional(),
            sale_amount: joi_1.default.number().optional(),
            paid_amount: joi_1.default.number().optional(),
            sale_time: joi_1.default.date().optional(),
        }).optional();
        this.aggreementValidator = joi_1.default.object({
            paper_sent: joi_1.default.number().integer().optional(),
            paper_sent_note: joi_1.default.string().optional(),
        }).optional();
        this.VisitValidator = joi_1.default.object({
            visit_status: joi_1.default.number().integer().optional(),
            visit_date: joi_1.default.date().optional(),
            visit_note: joi_1.default.string().optional(),
        }).optional();
        this.DemoValidator = joi_1.default.object({
            demo_sent: joi_1.default.number().integer().optional(),
            demo_sent_note: joi_1.default.string().optional(),
        }).optional();
        this.ForwardValidator = joi_1.default.object({
            forward_status: joi_1.default.number().integer().optional(),
            forward_note: joi_1.default.string().optional(),
            forward_time: joi_1.default.date().optional(),
            forward_to: joi_1.default.array().items(joi_1.default.number().required()).required(),
        }).required();
        this.monthlyTargetValidator = joi_1.default.object({
            month: joi_1.default.number().integer().required(),
        });
    }
}
exports.default = EngageLeadValidator;
