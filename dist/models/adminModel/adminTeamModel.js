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
class TeamModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create team
    createTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams').withSchema(this.EVO).insert(payload);
        });
    }
    //add verifier
    addVerifier(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('activity_verifier')
                .withSchema(this.EVO)
                .insert(payload);
        });
    }
    removeVerifier(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('activity_verifier')
                .withSchema(this.EVO)
                .where({
                team_id: params.team_id,
                employee_id: params.employee_id,
            })
                .delete();
        });
    }
    // update team
    updateTeam(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams')
                .withSchema(this.EVO)
                .update(payload)
                .where({ team_id: id });
        });
    }
    // get all team
    getTeam(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams as tm')
                .withSchema(this.EVO)
                .where('tm.organization_id', organization_id)
                .joinRaw('JOIN crm.employee AS employee ON tm.team_leader_id = employee.id')
                .select('tm.team_name', 'tm.team_id', 'tm.created_at', 'tm.team_leader_id', 'employee.name As team_leader_name')
                .orderBy('tm.team_id', 'desc');
        });
    }
    getAllTeam(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db('teams as tm');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .joinRaw('LEFT JOIN crm.employee AS e ON tm.team_leader_id = e.id')
                .where('tm.organization_id', organization_id)
                .select('tm.team_name', 'tm.team_id', 'tm.created_at', 'tm.team_leader_id', 'e.name AS team_leader_name')
                .andWhere(function () {
                if (key) {
                    this.andWhere('tm.team_name', 'ilike', `%${key}%`);
                }
            })
                .orderBy('tm.team_id', 'desc');
            const total = yield this.db('teams as tm')
                .withSchema(this.EVO)
                .count('tm.team_id as total')
                .where('tm.organization_id', organization_id)
                .joinRaw('LEFT JOIN crm.employee AS e ON tm.team_leader_id = e.id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('tm.team_name', 'ilike', `%${key}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    //check verifier
    checkVerifiers(team_id, verifier_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiers = yield this.db('activity_verifier as av')
                .withSchema(this.EVO)
                .where('av.team_id', team_id)
                .whereIn('av.employee_id', verifier_ids)
                .select('av.employee_id');
            return verifiers.map((v) => v.employee_id);
        });
    }
    // get team wise evaluation
    getTeamWiseEvaluations(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluations = yield this.db('eligible_evaluation_teams as eg')
                .withSchema(this.EVO)
                .where('eg.team_id', team_id)
                .leftJoin('evaluations', 'evaluations.evaluation_id', '=', 'eg.evaluation_id')
                .where('evaluations.status', 'OPENED')
                .select('eg.evaluation_id');
            return evaluations;
        });
    }
    // get test average of team
    getTestAvarageOfTeam(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluations = yield this.db('eligible_evaluation_teams as eg')
                .withSchema(this.EVO)
                .where('eg.team_id', team_id)
                .leftJoin('evaluations', 'evaluations.evaluation_id', '=', 'eg.evaluation_id')
                .where('evaluations.status', 'OPENED')
                .select('eg.evaluation_id');
            if (evaluations.length === 0) {
                // Handle the case when evaluations array is empty
                return {
                    acheievedMarks: 0,
                    totalEvaluationMarks: 0,
                    avarageTeamPerformancePercentage: 0,
                };
            }
            const evaluation_id = evaluations[0].evaluation_id;
            const evaluation_option = yield this.db('responses_v2')
                .withSchema(this.EVO)
                .where('responses_v2.evaluation_id', evaluation_id)
                .leftJoin('option_v2', 'option_v2.option_id', '=', 'responses_v2.option_id')
                .sum('option_v2.option_mark');
            const countEvaluations = yield this.db('responses_v2')
                .withSchema(this.EVO)
                .where('responses_v2.evaluation_id', evaluation_id)
                .leftJoin('option_v2', 'option_v2.option_id', '=', 'responses_v2.option_id')
                .count();
            const acheievedMarks = Number(evaluation_option[0].sum);
            const totalEvaluationMarks = Number(countEvaluations[0].count) * 5;
            const averageTeamPerformancePercentage = (totalEvaluationMarks !== 0
                ? (100 * acheievedMarks) / totalEvaluationMarks
                : 0).toFixed(2);
            return {
                averageTeamPerformancePercentage,
            };
        });
    }
    getResponseMarks(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.db('responses_v2')
                .withSchema(this.EVO)
                .where('responses_v2.evaluation_id', evaluation_id)
                .leftJoin('option_v2', 'option_v2.option_id', '=', 'responses_v2.option_id')
                .sum('option_v2.option_mark')
                .groupBy('responses_v2.evaluation_id');
            // Extract the sum from the result object and convert it to a number
            const sumMarks = response.length > 0 ? Number(response[0].sum) : 0;
            return response;
        });
    }
    getTeamWiseMembers(organization_id, team_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db('teams_employee as tm');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .andWhere('tm.team_id', team_id)
                .joinRaw('LEFT JOIN crm.employee AS e ON tm.emp_id = e.id')
                .joinRaw('LEFT JOIN crm.shifts AS sh ON e.shift_id = sh.id')
                .select('tm.emp_id', 'tm.team_id', 'e.name', 'e.username', 'e.designation', 'e.phone', 'e.photo', 'e.email', 'sh.shift_start', 'sh.shift_end', 'sh.shift_name', 'e.status')
                .andWhere(function () {
                if (key) {
                    this.where('e.name', 'like', `%${key}%`);
                }
            })
                .orderBy('tm.emp_id', 'desc');
            const total = yield this.db('teams_employee as tm')
                .withSchema(this.EVO)
                .count('tm.emp_id as total')
                .where('tm.team_id', team_id)
                .joinRaw('LEFT JOIN crm.employee AS e ON tm.emp_id = e.id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('e.name', 'like', `%${key}%`).orWhere('e.name', 'like', `%${key}%`);
                }
                // }
            });
            const team = yield this.db('teams')
                .withSchema(this.EVO)
                .where({ organization_id })
                .andWhere({ team_id: team_id })
                .select('*');
            const teamLeaderInfo = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where({ id: team[0].team_leader_id })
                .select('*');
            const teaminfo = {
                team_id: team[0].team_id,
                team_name: team[0].team_name,
                team_leader_id: team[0].team_leader_id,
                // team_leader_name: teamLeaderInfo[0].name,
                // team_leader_designation: teamLeaderInfo[0].name,
            };
            const teamVerifiers = yield this.db('activity_verifier as av')
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .joinRaw('LEFT JOIN crm.employee AS e ON av.employee_id = e.id')
                .select('av.employee_id', 'e.name', 'e.socket_id');
            return {
                teaminfo,
                teamVerifiers,
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    checkTeams(organization_id, team_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams')
                .withSchema(this.EVO)
                .where({ organization_id })
                .andWhere({ team_name: team_name })
                .select('*');
        });
    }
    getEvaluationScore(employee_id, evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluations = yield this.db('responses_v2')
                .withSchema(this.EVO)
                .where({ evaluation_id })
                .andWhere({ evaluate_to: employee_id })
                .select('*');
            return evaluations;
        });
    }
    // get single team
    getSingleTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id } = payload;
            return yield this.db('teams')
                .withSchema(this.EVO)
                .where({ team_id })
                .select('*');
        });
    }
    //assign team member
    assignEmployeeToTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams_employee')
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    //Create Evaluate employee permission
    createEvaluateEmployePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('team_evaluation_emp')
                .withSchema(this.EVO)
                .insert(payload);
        });
    }
    //remove Evaluate employee permission
    removeEvaluateEmployePermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id, ev_associator, rmv_evaluate_emp } = payload;
            return yield this.db('team_evaluation_emp')
                .withSchema(this.EVO)
                .del()
                .whereIn('ev_emp', rmv_evaluate_emp)
                .andWhere({ team_id })
                .andWhere({ ev_associator });
        });
    }
    // remove employee from team
    removeEmployee(team_id, emp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams_employee')
                .withSchema(this.EVO)
                .where({ emp_id })
                .andWhere({ team_id })
                .delete();
        });
    }
    // get single team
    getEvaluateEmployePermissionByTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id, ev_associator_id } = payload;
            return yield this.db('team_ev_emp_view2')
                .withSchema(this.EVO)
                .select('*')
                .where({ team_id })
                .andWhere(function () {
                if (ev_associator_id) {
                    this.andWhere({ ev_associator_id });
                }
            });
        });
    }
}
exports.default = TeamModel;
