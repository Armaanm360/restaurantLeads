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
class adminDashboardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    getDashboardData(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const total_employee = yield this.db('employee')
                .where({ organization_id })
                .count('id AS total_employee')
                .withSchema(this.CRM_SCHEMA);
            const activity_log = yield this.db('work_logs')
                .count('log_id AS activity_log')
                .withSchema(this.EVO);
            const total_teams = yield this.db('teams')
                .count('team_id AS teams_count')
                .where({ organization_id })
                .withSchema(this.EVO);
            const top_teams = yield this.db('teams')
                .withSchema(this.EVO)
                .where({ organization_id })
                .limit(5)
                .select('*');
            // const top_teams_most_activity = await this.db('work_logs')
            //   .withSchema(this.EVO)
            //   .where({ log_association_id: association_id })
            //   .select('team_name');
            const verified_log = yield this.db('work_logs')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db('work_logs')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .andWhere({ team_leader_verification: false });
            // const unverified_log = await this.db('work_logs_user_team_view')
            //   .count('log_id AS activity_log')
            //   .withSchema(this.EVO)
            //   .where({ log_association_id: association_id })
            //   .andWhere({ team_leader_verification: false });
            return {
                total_employee: parseInt(total_employee[0].total_employee),
                total_activity_log: parseInt(activity_log[0].activity_log),
                verified_log: parseInt(verified_log[0].activity_log),
                unverified_log: parseInt(unverified_log[0].activity_log),
                total_teams: parseInt(total_teams[0].teams_count),
                active_users: parseInt(total_employee[0].total_employee),
                top_teams: top_teams,
            };
        });
    }
    getTeamMembersCount(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const total_evaluated_employees = yield this.db('teams_employee')
                .count('emp_id AS emp_id')
                .withSchema(this.EVO)
                .whereIn('team_id', team_id);
            return total_evaluated_employees;
        });
    }
}
exports.default = adminDashboardModel;
