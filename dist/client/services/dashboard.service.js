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
class MemberDashboardService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getDashboard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const model = this.Model.memberDashboardModel();
                const leaveModel = this.Model.adminLeaveModel();
                const teams = yield leaveModel.getMyTeams(id);
                const members = teams.map((team_id) => team_id.team_id);
                //teamMembers
                const teamMembers = yield leaveModel.getMyTeamMembers(id, members);
                //final team members
                const finalMembers = teamMembers.map((employee) => employee.emp_id);
                const leaves = yield leaveModel.getMyTeamMembersApplications(finalMembers);
                const { activities_total, verified_activities, unverified_activities, today_activities, } = yield model.getDashboardData(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    total_activities: activities_total[0].total_activities,
                    verified_activities: verified_activities[0].verified,
                    unverified_activities: unverified_activities[0].unverified,
                    today_activities: today_activities[0].today_activities,
                    leaves: leaves,
                };
            }));
        });
    }
}
exports.default = MemberDashboardService;
