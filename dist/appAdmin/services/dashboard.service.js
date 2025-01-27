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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class AdminDashboardService extends abstract_service_1.default {
    constructor() {
        super();
    }
    dashboardData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { id, organization_id } = req.admin;
                const model = this.Model.adminDashboardModel();
                const { total_employee, total_activity_log, total_teams, verified_log, unverified_log, active_users, top_teams, } = yield model.getDashboardData(organization_id);
                const teams = yield this.Model.adminTeamModel().getTeam(organization_id);
                // Calculate and add team_avg field to each team object
                for (let team of teams) {
                    const { averageTeamPerformancePercentage } = yield this.Model.adminTeamModel().getTestAvarageOfTeam(team.team_id);
                    team.team_avg = averageTeamPerformancePercentage;
                }
                const teamsArr = teams.map((id) => id.team_id);
                const teamMembers = yield this.Model.adminDashboardModel().getTeamMembersCount(teamsArr);
                // Sort teams array by team_avg in descending order
                teams.sort((a, b) => b.team_avg - a.team_avg);
                const top5Teams = teams.slice(0, 5);
                const bestTeam = teams.slice(0, 1);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    total_employee: total_employee,
                    total_activities: total_activity_log,
                    unverified_log: unverified_log,
                    verified_log: verified_log,
                    total_teams: total_teams,
                    active_users: active_users,
                    top_teams: top5Teams,
                    bestTeam: (_a = bestTeam[0]) === null || _a === void 0 ? void 0 : _a.team_name,
                    piechart: [7, 5, 4],
                    teamsArr: teamMembers,
                };
            }));
        });
    }
}
exports.default = AdminDashboardService;
