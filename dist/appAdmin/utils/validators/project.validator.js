"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class ProjectValidator {
    constructor() {
        //Create Permission Group
        this.createProject = joi_1.default.object({
            name: joi_1.default.string().required(),
            details: joi_1.default.string().optional(),
            start_date: joi_1.default.date().optional(),
            lead_id: joi_1.default.number().optional(),
            initial_complete_date: joi_1.default.date().optional(),
            logo: joi_1.default.string().optional(),
            // discussion: Joi.string().required(),
            teams: joi_1.default.string().required(),
            // teams: Joi.array()
            //   .items(
            //     Joi.object({
            //       employee_id: Joi.number().integer().required(),
            //       role: Joi.string()
            //         .valid(
            //           'LEAD',
            //           'FRONTEND',
            //           'BACKEND',
            //           'QA',
            //           'SYSTEM-DESIGNER',
            //           'DEV-OPS',
            //           'GRAPHICS-DESIGNER',
            //           'OTHER'
            //         ) // Replace with actual enum values
            //         .required(),
            //     })
            //   )
            //   .required(),
        });
        this.createProjectDocuments = joi_1.default.object({
            name: joi_1.default.string().required(),
            details: joi_1.default.string().optional(),
            filename: joi_1.default.string().optional(),
            project_id: joi_1.default.string().optional(),
        });
    }
}
exports.default = ProjectValidator;
