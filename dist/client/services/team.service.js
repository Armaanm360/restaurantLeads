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
class MemberTeamService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const { key, limit, skip } = req.query;
                const model = this.Model.memberTeamModel();
                const { data, total } = yield model.getTeam(id, {
                    key: key,
                    limit: limit,
                    skip: skip,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: data,
                    total,
                };
            }));
        });
    }
    // get employee team wise
    getEmployeeTeamWise(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const team_id = Number(req.params.team_id);
                const model = this.Model.memberTeamModel(trx);
                const { userMember, teaminfo } = yield model.getTeamWiseMembers(team_id, req.query.key);
                const permittedEvaluates = yield model.getEvaluatedEmployee(id);
                //check Team Leader
                //check member first
                let appointed_team_leader = ""; // Declare the variable outside the if-else blocks
                let appointed_team_leader_id = ""; // Declare the variable outside the if-else blocks
                if (userMember.length) {
                    const checkTeamHasTeamLeader = yield model.checkTeamLeaderExsistence(team_id);
                    if (checkTeamHasTeamLeader[0].team_leader_id != null) {
                        const checkTeamLeader = yield model.getTeamLeader(team_id);
                        appointed_team_leader = checkTeamLeader[0].name; // Assign value if team leader exists
                        appointed_team_leader_id = checkTeamLeader[0].team_leader_id; // Assign value if team leader exists
                    }
                    else {
                        appointed_team_leader = "Not Appointed Yet"; // Assign value if team leader doesn't exist
                        appointed_team_leader_id = "Not Appointed Yet"; // Assign value if team leader doesn't exist
                    }
                }
                else {
                    appointed_team_leader = "No Team Member Found"; // Assign value if no team members exist
                    appointed_team_leader_id = "No Team Member Found"; // Assign value if no team members exist
                }
                //check if there is any evaluation that is opened
                const checkEvaluationOpened = yield model.getTeamWiseLastEvaluation(team_id);
                //get team names
                const team_name = yield model.getTeamIdWise(team_id);
                if (!checkEvaluationOpened.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: userMember,
                        // evaluation_id: team_wise_last_evaluation,
                        team_name: team_name[0].team_name,
                        appointed_team_leader: appointed_team_leader,
                        appointed_team_leader_id: appointed_team_leader_id,
                        // team_ranking: "4",
                    };
                }
                //team wise last evaluation
                const team_wise_last_evaluation = yield model.getTeamWiseLastEvaluation(team_id);
                //already evaluated
                const evaluated = yield model.getAlreadyEvaluated(team_wise_last_evaluation[0].evaluation_id, id);
                const teamMates = userMember.map((item) => item.emp_id);
                const permitted = permittedEvaluates.map((item) => item.ev_emp);
                const alreadyEvaluated = evaluated.map((item) => item.evaluate_to); // Assuming this array is predefined
                const result = yield Promise.all(teamMates.map((member) => __awaiter(this, void 0, void 0, function* () {
                    // Additional proposed structure for alreadyEvaluated
                    const evaluations = team_wise_last_evaluation.map((item) => item.evaluation_id);
                    const evaluationResponses = yield Promise.all(evaluations.map((evaluation_id) => __awaiter(this, void 0, void 0, function* () {
                        const response = yield model.checkEvTeamResponse(evaluation_id, id, member, team_id);
                        const evaluation_info = yield model.getEvaluationInfo(evaluation_id);
                        return {
                            evaluation_id: evaluation_id,
                            evaluation_name: evaluation_info[0].evaluation_name,
                            evaluated: response.length > 0 ? true : false,
                        };
                    })));
                    return {
                        user_id: member,
                        evaluation_access: permitted.includes(member),
                        alreadyEvaluated: evaluationResponses,
                    };
                })));
                // Merging result into userMember array
                const mergedData = userMember.map((item, index) => (Object.assign(Object.assign({}, item), { evaluation_access: result[index].evaluation_access, alreadyEvaluated: result[index].alreadyEvaluated })));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data: mergedData,
                    evaluation_id: team_wise_last_evaluation[0].evaluation_id,
                    team_name: team_name[0].team_name,
                    appointed_team_leader: appointed_team_leader,
                };
            }));
        });
    }
}
exports.default = MemberTeamService;
