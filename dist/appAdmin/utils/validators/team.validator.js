"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminTeamValidator {
    constructor() {
        //Create Team Validator
        this.createTeamValidator = joi_1.default.object({
            team_name: joi_1.default.string().required(),
        });
        this.assignTeamLeaderValidator = joi_1.default.object({
            employee_id: joi_1.default.number().required(),
            team_id: joi_1.default.number().required(),
        });
        this.updateTeamValidator = joi_1.default.object({
            team_name: joi_1.default.string().required(),
        });
        //Get All Teams
        this.getTeamValidator = joi_1.default.object({
            limit: joi_1.default.number().optional(),
            skip: joi_1.default.number().optional(),
            key: joi_1.default.string().optional(),
        });
        //assign employee to team
        this.assignEmployeeToTeam = joi_1.default.object({
            team_id: joi_1.default.number().required(),
            emp_id: joi_1.default.number().required(),
        });
        //evaluate permission
        this.evaluatePermisson = joi_1.default.object({
            team_id: joi_1.default.number().required(),
            ev_associator: joi_1.default.number().required(),
            added_evaluate_emp: joi_1.default.array().required(),
        });
        //shift validator
    }
}
exports.default = AdminTeamValidator;
