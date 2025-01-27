"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class EvaluationValidator {
    constructor() {
        //Create Team Validator
        this.createEvaluation = joi_1.default.object({
            evaluation_name: joi_1.default.string().required(),
            evaluation_description: joi_1.default.string().optional(),
            evaluation_date_start: joi_1.default.string().required(),
            evaluation_date_end: joi_1.default.string().required(),
        });
        //update evaluation to team
        this.updateEvaluation = joi_1.default.object({
            evaluation_name: joi_1.default.string().optional(),
            evaluation_description: joi_1.default.string().optional(),
            evaluation_date_start: joi_1.default.string().optional(),
            evaluation_date_end: joi_1.default.string().optional(),
            status: joi_1.default.string().optional(),
        });
        //Get All Evaluations
        this.getAllEvaluation = joi_1.default.object({
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            key: joi_1.default.string(),
        });
        //Get All Evaluation Questions
        this.getAllQuestions = joi_1.default.object({
            limit: joi_1.default.number(),
            skip: joi_1.default.number(),
            key: joi_1.default.string(),
        });
        // create evaluation question validation
        this.createEvaluationQuestionValidator = joi_1.default.object({
            question: joi_1.default.string().required(),
            evaluation_id: joi_1.default.number().required(),
            options: joi_1.default.array()
                .items(joi_1.default.object({
                options: joi_1.default.string().required(),
                option_mark: joi_1.default.number().required(),
            }))
                .required(),
        });
        // update evaluation question validation
        this.updateQuestionValidator = joi_1.default.object({
            question: joi_1.default.string().required(),
            evaluation_id: joi_1.default.number().required(),
            options: joi_1.default.array()
                .items(joi_1.default.object({
                options: joi_1.default.string().required(),
                option_mark: joi_1.default.number().required(),
            }))
                .required(),
        });
        //create assign evaluation validator
        this.assignEvaluationTeamValidator = joi_1.default.object({
            evaluation_id: joi_1.default.number().required(),
            team_id: joi_1.default.number().required(),
        });
        //update evaluation validator
        this.updateTeamWiseEvaluationValidator = joi_1.default.object({
            status: joi_1.default.string().optional(),
        });
        //evaluation response validator
        this.evaluationResponseValidator = joi_1.default.array().items(joi_1.default.object({
            evaluation_id: joi_1.default.number().required(),
            evaluate_to: joi_1.default.number().required(),
            evaluate_by: joi_1.default.number().required(),
            question_id: joi_1.default.number().required(),
            option_id: joi_1.default.number().required(),
            response: joi_1.default.string().required(),
            evaluation_text: joi_1.default.string().required(),
        }));
    }
}
exports.default = EvaluationValidator;
