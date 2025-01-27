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
class memberDashboardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    getDashboardData(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const activities_total = yield this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .where({ employee_id: employee_id })
                .count('log_id as total_activities');
            const verified_activities = yield this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .where({ employee_id: employee_id })
                .andWhere({ team_leader_verification: true })
                .count('log_id as verified');
            const unverified_activities = yield this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .where({ employee_id: employee_id })
                .andWhere({ team_leader_verification: false })
                .count('log_id as unverified');
            const today_activities = yield this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .where({ employee_id: employee_id })
                .andWhereRaw(`DATE(log_datetime) = CURRENT_DATE`) // Filter for today's date
                .count('log_id as today_activities');
            return {
                activities_total,
                verified_activities,
                unverified_activities,
                today_activities,
            };
        });
    }
}
exports.default = memberDashboardModel;
