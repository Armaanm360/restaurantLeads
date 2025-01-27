"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class memberTeamModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    getTeam(emp_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db("teams_employee as tm");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .where({ emp_id: emp_id })
                .leftJoin("teams as t", "t.team_id", "=", "tm.team_id")
                .joinRaw("LEFT JOIN crm.employee AS employee ON t.team_leader_id = employee.id")
                .select("tm.id", "tm.emp_id", "t.team_name", "t.team_id", "t.is_deleted", "t.team_leader_id", "employee.organization_id", "employee.name as team_leader_name", "employee.designation", "employee.photo as employee_photo")
                .andWhere(function () {
                if (key) {
                    this.andWhere("t.team_name", "like", `%${key}%`).orWhere("t.team_name", "like", `%${key}%`);
                }
            })
                .orderBy("t.team_id", "desc");
            const total = yield this.db("teams_employee as tm")
                .withSchema(this.EVO)
                .where({ emp_id: emp_id })
                .count("tm.team_id as total")
                .leftJoin("teams as t", "t.team_id", "=", "tm.team_id")
                .joinRaw("LEFT JOIN crm.employee AS employee ON t.team_leader_id = employee.id")
                .where(function () {
                if (key) {
                    this.andWhere("t.team_name", "like", `%${key}%`).orWhere("t.team_name", "like", `%${key}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    //get teamleader
    getTeamLeader(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .joinRaw("JOIN crm.employee AS employee ON teams.team_leader_id = employee.id")
                .select("name", "team_leader_id");
            return userMember;
        });
    }
    checkTeamLeaderExsistence(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return userMember;
        });
    }
    getTeamIdWise(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return userMember;
        });
    }
    getTeamWiseLastEvaluation(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("eligible_evaluation_teams as eg")
                .withSchema(this.EVO)
                .where("eg.team_id", team_id)
                .leftJoin("evaluations as e", "e.evaluation_id", "=", "eg.evaluation_id")
                .andWhere("e.status", "OPENED")
                .select("eg.evaluation_id");
            return userMember;
        });
    }
    //get already evluated employees
    getAlreadyEvaluated(team_wise_last_evaluation, evaluate_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: team_wise_last_evaluation })
                .andWhere({ evaluate_by: evaluate_by })
                .groupBy("evaluate_to", "evaluate_by", "evaluation_id")
                .select("evaluate_to", "evaluate_by", "evaluation_id");
            return userMember;
        });
    }
    //check team,employee,evaluation_wise response
    checkEvTeamResponse(evaluation_id, evaluate_by, evaluate_to, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ team_id: team_id })
                .andWhere({ evaluate_by: evaluate_by })
                .andWhere({ evaluate_to: evaluate_to })
                .andWhere({ evaluate_by: evaluate_by })
                .groupBy("evaluate_to", "evaluate_by", "evaluation_id")
                .select("evaluate_to", "evaluate_by", "evaluation_id");
            return userMember;
        });
    }
    getTeamWiseMembers(team_id, searchPrm) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .andWhere({ team_id: team_id })
                .joinRaw("JOIN crm.employee AS employee ON teams_employee.emp_id = employee.id")
                .select("emp_id", "team_id", "name", "username", "designation", "phone", "photo", "email", "status")
                .where(function () {
                if (searchPrm) {
                    this.andWhere("name", "ilike", `%${searchPrm}%`);
                }
            });
            const team = yield this.db("teams")
                .withSchema(this.EVO)
                .andWhere({ team_id: team_id })
                .select("*");
            const teaminfo = {
                team_id: team[0].team_id,
                team_name: team[0].team_name,
                team_leader_id: team[0].team_leader_id,
            };
            return { userMember, teaminfo };
        });
    }
    getEvaluatedEmployee(emp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("team_evaluation_emp")
                .withSchema(this.EVO)
                .where({ ev_associator: emp_id })
                .groupBy("ev_emp", "ev_associator")
                .select("ev_emp", "ev_associator");
            return userMember;
        });
    }
    getEvaluationInfo(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .where({ evaluation_id })
                .select("evaluation_name");
            return userMember;
        });
    }
}
exports.default = memberTeamModel;
