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
class UserModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getProfile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("employee")
                .withSchema(this.CRM_SCHEMA)
                .where({ id: user_id })
                .select("*");
        });
    }
    getQuestion(question_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("questions")
                .withSchema(this.EVO)
                .where({ question_id: question_id })
                .select("*");
            return userMember[0].question;
        });
    }
    getTeamInfo(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select("*");
            return userMember;
        });
    }
    checkTeams(team_name, association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_name: team_name })
                .andWhere({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    createTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getTeam(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    getUnPointedUser(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    getMyTeam(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return userMember;
        });
    }
    teamPositionWiseUser(team_id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .andWhere({ level: level })
                .select("user_id", "user_name");
            return userMember;
        });
    }
    getEmployees(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*")
                .orderBy("level", "asc");
            return userMember;
        });
    }
    getRegisterdEmployee(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("employee")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    //appointed users
    getAppointedUsers(users) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .whereIn("emp_id", users)
                .select("*");
            return userMember;
        });
    }
    //get unappointed users
    getUnAppointedUsers(association_id, users) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("employee")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn("id", users)
                .select("id", "name", "designation", "phone", "email", "status", "photo");
            return userMember;
        });
    }
    //assign team member
    assignEmployeeToTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_teams")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    //switch to other team
    switchEmployeeToOtherTeam(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_teams")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update(payload);
            return userMember;
        });
    }
    //assign team Leader
    assignEmployeeToTeamLeader(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update({ level: 3 });
            return userMember;
        });
    }
    //exsisting team leader
    exsistingTeamLeaderID(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .andWhere({ level: 3 });
            return userMember;
        });
    }
    //exsisting team leader status change
    exsistingTeamLeaderStatusChange(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update({ level: 4 });
            return userMember;
        });
    }
    //get all Admins
    getAllAdmins(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ level: 2 })
                .select("*");
            return userMember;
        });
    }
    //update verified log
    updateWorkLog(work_log_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs")
                .withSchema(this.EVO)
                .where({ log_id: work_log_id })
                .update(payload);
            return userMember;
        });
    }
    //update verified log
    updateWorkLogEmployee(work_log_id, activity_description) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs")
                .withSchema(this.EVO)
                // .where({ employee_id: employee_id })
                .andWhere({ log_id: work_log_id })
                .update({ activity_description });
            return userMember;
        });
    }
    updateUserLevel(user_id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update({ level: level });
            return userMember;
        });
    }
    createPermissions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("toevaluate")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getPermission(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("toevaluate")
                .withSchema(this.EVO)
                .where({ user_id })
                .leftJoin("teams", "teams.team_id", "=", "toevaluate.team_id")
                .select("toevaluate.team_id as teamID", "teams.team_name")
                .groupBy("teamID", "team_name");
            return userMember;
        });
    }
    getUserInfo(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id })
                .select("level");
            return userMember;
        });
    }
    deletePermission(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("toevaluate")
                .withSchema(this.EVO)
                .whereIn("team_id", team_id)
                .delete();
            return userMember;
        });
    }
    getAllSuperUsers(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    getMemberUserWise(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select("*");
            return userMember;
        });
    }
    getTeamsMember(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamMember = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return teamMember;
        });
    }
    getVerifier(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamMember = yield this.db("activity_verifier")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return teamMember;
        });
    }
    getTeamWiseMembers(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ team_id: team_id })
                .select("*");
            const team = yield this.db("teams")
                .withSchema(this.EVO)
                .andWhere({ team_id: team_id })
                .select("*");
            const teaminfo = team[0].team_name;
            return { userMember, teaminfo };
        });
    }
    // insert user member
    insertUserMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.db("users")
                .withSchema(this.EVO)
                .insert(payload, "user_id");
            return member;
        });
    }
    //create questions
    createQuestions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("questions")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getQuestions(provided_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("questions")
                .withSchema(this.EVO)
                .where({ provided_by: provided_by })
                .select("*");
            return userMember;
        });
    }
    getEvaluationQuestions(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluationQuestions = yield this.db("questions")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .select("*");
            return evaluationQuestions;
        });
    }
    getEvaluationQuestionsLevel(evaluation_id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluationQuestions = yield this.db("questions")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ provided_for: level })
                .select("*");
            return evaluationQuestions;
        });
    }
    //create evaluation
    createEvaluation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getEvaluation(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("eligable_evaluations")
                .withSchema(this.EVO)
                .select("*");
            return userMember;
        });
    }
    getEvaluationSingle(association_id, evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id })
                .select("evaluation_name");
            return userMember;
        });
    }
    getEvaluationEmployee(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .andWhere({ status: "OPENED" })
                // .andWhere({ team_id: team_id })
                .select("*");
            // 'evaluation_id',
            //   'evaluation_code',
            //   'evaluation_date_range',
            //   'evaluation_description',
            //   'evaluation_created_at as created_at',
            //   'evaluation_updated_at as updated_at',
            //   'evaluation_date_start',
            //   'evaluation_date_end',
            //   'evaluation_association_id as association_id',
            //   'evaluation_name',
            //   'evaluation_status as status',
            //   'team_id';
            return userMember;
        });
    }
    //get All Users Level Under 2
    getEvaluationLevel(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNot({ level: 1 })
                .select("user_id");
            return userMember;
        });
    }
    //get All Users Level Under 2
    getEvaluated(association_id, evaluation_id, evaluate_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                //.where({ association_id: association_id })
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_by: evaluate_by })
                .select("*");
            return userMember;
        });
    }
    //get All appointed Employees
    getAppointedEmployees(association_id, evaluation_id, evaluate_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                //.where({ association_id: association_id })
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_by: evaluate_by })
                .select("*");
            return userMember;
        });
    }
    //get evaluation info
    getEvaluationInfo(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .andWhere({ evaluation_id: evaluation_id })
                .select("*");
            return userMember;
        });
    }
    getEvaluationInfoAll(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const total_questions = yield this.db("questions_v2")
                .withSchema(this.EVO)
                .andWhere({ evaluation_id: evaluation_id })
                .first()
                .count();
            return { total_questions };
        });
    }
    //getEvaluation All Info
    //verified logs
    getTotalVerifiedLogsOfUser(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .count("log_id as log_id")
                .where({ employee_id: employee_id })
                .andWhere({ team_leader_verification: true });
            return parseInt(userMember[0].log_id);
        });
    }
    getTotalLogsOfUser(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .count("log_id as log_id")
                .where({ employee_id: employee_id });
            return parseInt(userMember[0].log_id);
        });
    }
    getTotalLogsRemarkedOfUser(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .count("log_id as log_id")
                .where({ employee_id: employee_id })
                .whereNotNull("remarks");
            return parseInt(userMember[0].log_id);
        });
    }
    getRestUsers(association_id, eliminated, evaluate_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ status: "active" })
                .whereNot("user_id", evaluate_by)
                .whereNotIn("user_id", eliminated)
                .select("*");
            return userMember;
        });
    }
    getEvaluatedUsers(association_id, evaluate_by, eliminated) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ status: "active" })
                // .whereNot('user_id', evaluate_by)
                .whereIn("user_id", eliminated)
                .select("*");
            return userMember;
        });
    }
    getEvaluatedUsersSuper(association_id, evaluate_by, eliminated) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ status: "active" })
                .whereNot("user_id", evaluate_by)
                .whereIn("user_id", eliminated)
                .select("*");
            return userMember;
        });
    }
    getRestUsersTeam(association_id, eliminated, evaluate_by, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ status: "active" })
                .andWhere({ team_id: team_id })
                .whereNotIn("user_id", eliminated)
                .select("*");
            return userMember;
        });
    }
    getRestUsersEmployee(association_id, eliminated, evaluate_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ user_id: evaluate_by })
                .select("*");
            return userMember;
        });
    }
    teamMembers(association_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id } = req.query;
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ team_id: team_id })
                .select("user_id", "user_name", "designation", "level");
            return userMember;
        });
    }
    //create responses
    createResponses(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getResponses(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .select("*");
            return userMember;
        });
    }
    //workactivity
    createActivity(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs")
                .withSchema(this.EVO)
                .insert(payload)
                .returning("*");
            return userMember;
        });
    }
    getSingleActivity(log_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("worklogs_admin_view")
                .withSchema(this.EVO)
                .where({ log_id })
                .andWhere({ team_id })
                .select("*");
            return userMember;
        });
    }
    getOnlySingleActivity(log_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("worklogs_admin_view")
                .withSchema(this.EVO)
                .where({ log_id })
                .select("*");
            return userMember;
        });
    }
    getActivitiesUserWise(association_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: employee_id })
                .select("*");
            return userMember;
        });
    }
    updateActivity(log_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs")
                .withSchema(this.EVO)
                .where({ log_id: log_id })
                .update({ team_leader_verification: true });
            return userMember;
        });
    }
    updateRemark(log_id, remarks) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs")
                .withSchema(this.EVO)
                .where({ log_id: log_id })
                .update({ remarks: remarks });
            return userMember;
        });
    }
    getActivitiesTeamLead(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_id: team_id })
                .select("*");
            return userMember;
        });
    }
    getActivitiesAll(association_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id, user_id, team_leader_verification, level, limit, skip, from_date, to_date, type, } = req.query;
            const dtbs = this.db("work_logs_user_team_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .select("*")
                .where({ log_association_id: association_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [
                        `${from_date}T00:00:00.000Z`,
                        `${to_date}T23:59:59.999Z`,
                    ]);
                }
                if (team_id) {
                    this.andWhere("team_id", team_id);
                }
                if (user_id) {
                    this.andWhere("employee_id", user_id);
                }
                if (team_leader_verification) {
                    this.andWhere("team_leader_verification", team_leader_verification);
                }
                if (level) {
                    this.andWhere("level", level);
                }
            });
            const total = yield this.db("work_logs_user_team_view")
                .count("log_id AS total")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [
                        `${from_date}T00:00:00.000Z`,
                        `${to_date}T23:59:59.999Z`,
                    ]);
                }
                if (team_id) {
                    this.andWhere("team_id", team_id); // Fix the typo here
                }
                if (team_leader_verification) {
                    this.andWhere("team_leader_verification", team_leader_verification);
                }
                if (level) {
                    this.andWhere("level", level);
                }
            });
            const teamMembers = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere(function () {
                if (team_id) {
                    this.andWhere("team_id", team_id); // Fix the typo here
                }
            })
                .select("user_id", "user_name", "designation", "level");
            return {
                getAllActivities: data,
                teamMembers: teamMembers,
                total: parseInt(total[0].total),
            };
        });
    }
    getAllEvaluationResponses(association_id, evaluation_id, getTeam, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id, team_leader_verification, level, limit, skip, from_date, to_date, type, } = req.query;
            const dtbs = this.db("overall_report_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const dataQuery = dtbs
                .withSchema(this.EVO)
                .select("*")
                .where({ evaluate_by_association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id });
            if (getTeam !== null) {
                dataQuery.andWhere({ evaluate_to_team_id: getTeam });
            }
            const data = yield dataQuery;
            // .andWhere(function () {
            //   if (from_date && to_date) {
            //     // Adjust the date range to include the entire day
            //     this.andWhereBetween('log_datetime', [
            //       `${from_date}T00:00:00.000Z`,
            //       `${to_date}T23:59:59.999Z`,
            //     ]);
            //   }
            //   if (team_id) {
            //     this.andWhere('team_id', team_id);
            //   }
            //   if (team_leader_verification) {
            //     this.andWhere('team_leader_verification', team_leader_verification);
            //   }
            //   if (level) {
            //     this.andWhere('level', level);
            //   }
            // });
            const datatotal = yield this.db("overall_report_view")
                .count("evaluate_by AS total")
                .withSchema(this.EVO)
                .where({ evaluate_by_association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id });
            if (getTeam !== null) {
                dataQuery.andWhere({ evaluate_team_id: getTeam });
            }
            const total = yield datatotal;
            // // .andWhere(function () {
            // //   if (from_date && to_date) {
            // //     // Adjust the date range to include the entire day
            // //     this.andWhereBetween('log_datetime', [
            // //       `${from_date}T00:00:00.000Z`,
            // //       `${to_date}T23:59:59.999Z`,
            // //     ]);
            // //   }
            // //   if (team_id) {
            // //     this.andWhere('team_id', team_id); // Fix the typo here
            // //   }
            // //   if (team_leader_verification) {
            // //     this.andWhere('team_leader_verification', team_leader_verification);
            // //   }
            // //   if (level) {
            // //     this.andWhere('level', level);
            // //   }
            // // }
            // );
            return { data, total: parseInt(total[0].total) };
        });
    }
    simple(association_id, evaluation_id, getTeam, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { team_id, team_leader_verification, level, limit, skip, from_date, to_date, type, } = req.query;
            const dtbs = this.db("overall_report_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const dataQuery = dtbs
                .withSchema(this.EVO)
                .select("*")
                .where({ evaluate_by_association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id });
            if (getTeam !== null) {
                dataQuery.andWhere({ evaluate_to_team_id: getTeam });
            }
            const data = yield dataQuery;
            // .andWhere(function () {
            //   if (from_date && to_date) {
            //     // Adjust the date range to include the entire day
            //     this.andWhereBetween('log_datetime', [
            //       `${from_date}T00:00:00.000Z`,
            //       `${to_date}T23:59:59.999Z`,
            //     ]);
            //   }
            //   if (team_id) {
            //     this.andWhere('team_id', team_id);
            //   }
            //   if (team_leader_verification) {
            //     this.andWhere('team_leader_verification', team_leader_verification);
            //   }
            //   if (level) {
            //     this.andWhere('level', level);
            //   }
            // });
            const datatotal = yield this.db("overall_report_view")
                .count("evaluate_by AS total")
                .withSchema(this.EVO)
                .where({ evaluate_by_association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id });
            if (getTeam !== null) {
                dataQuery.andWhere({ evaluate_team_id: getTeam });
            }
            const total = yield datatotal;
            // // .andWhere(function () {
            // //   if (from_date && to_date) {
            // //     // Adjust the date range to include the entire day
            // //     this.andWhereBetween('log_datetime', [
            // //       `${from_date}T00:00:00.000Z`,
            // //       `${to_date}T23:59:59.999Z`,
            // //     ]);
            // //   }
            // //   if (team_id) {
            // //     this.andWhere('team_id', team_id); // Fix the typo here
            // //   }
            // //   if (team_leader_verification) {
            // //     this.andWhere('team_leader_verification', team_leader_verification);
            // //   }
            // //   if (level) {
            // //     this.andWhere('level', level);
            // //   }
            // // }
            // );
            return { data, total: parseInt(total[0].total) };
        });
    }
    getEvaluationReportTeamWise(association_id, evaluation_id, teamid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("overall_report_view")
                .withSchema(this.EVO)
                .where({ evaluate_by_association_id: association_id })
                .andWhere({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to_team_id: teamid })
                .select("*");
            return userMember;
        });
    }
    test(evaluation_id, evaluate_to) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_with_questions")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to: evaluate_to })
                .select("*");
            return userMember;
        });
    }
    testv2(evaluation_id, evaluate_to, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_with_questions_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to: evaluate_to })
                .andWhere({ team_id: team_id })
                .select("response_id", "evaluate_by", "evaluate_to", "question_id", "question", "response", "evaluation_id", "evaluated", "option_mark", "evaluation_text");
            return { userMember };
        });
    }
    teamInfo(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamInfo = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return teamInfo;
        });
    }
    getTeamId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select("*");
            return userMember[0].team_id;
        });
    }
    getTeamMembers(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("*");
            return userMember;
        });
    }
    getTeamWiseMembersGet(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .andWhere({ team_id: team_id })
                .select("emp_id");
            const countMembers = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .andWhere({ team_id: team_id })
                .count();
            return userMember;
        });
    }
    //getUsermark
    getEvaluationMark(evaluation_id, evaluated_to) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_with_questions_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to: evaluated_to })
                .sum("option_mark as total_marks_get");
            const getMark = parseInt(userMember[0].total_marks_get);
            // const evaluated_by_people = await this.db('responses_with_questions_v2')
            //   .withSchema(this.EVO)
            //   .where({ evaluation_id: evaluation_id })
            //   .andWhere({ evaluate_to: evaluated_to })
            //   .groupBy('evaluate_by')
            //   .first()
            //   .count();
            // const avarage_with = Number(evaluated_by_people.count);
            // const getSpecificAvarage =
            //   parseInt(userMember[0].total_marks_get) / avarage_with;
            //return { getMark, avarage_with, getSpecificAvarage };
            return { getMark };
        });
    }
    //get evaluated by people
    getEvaluationByPeople(evaluation_id, evaluated_to) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluated_by_people_count = yield this.db("responses_with_questions_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to: evaluated_to })
                .countDistinct("evaluate_by as count");
            return evaluated_by_people_count[0].count;
        });
    }
    //get evaluated by people
    getEvaluationQuestionMarks(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const question_id_v2 = yield this.db("questions_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .countDistinct("question_id_v2 as count");
            return question_id_v2[0].count;
        });
    }
    //set teamwise mark
    setStandardMark(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("responses_v2")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ evaluate_to: 85 })
                .select("evaluate_by")
                .groupBy("evaluate_by")
                .count("option_id");
            return userMember[0].count;
        });
    }
    logIdWiseTeam(log_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ log_id: log_id })
                .select("*");
            return userMember[0].team_id;
        });
    }
    updateEvaluation(evaluation_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("evaluations")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .update(payload);
            return userMember;
        });
    }
    //check shift
    checkUserIdShift(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("working_shifts")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select("*");
            return userMember;
        });
    }
    updateUserIdShift(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("working_shifts")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update(payload);
            return userMember;
        });
    }
    createUserShift(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("working_shifts")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getDashboardData(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const total_employee = yield this.db("users")
                .count("user_id AS total_employee")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn("level", [1, 2]);
            const total_evaluated_employees = yield this.db("user_responses_view")
                .count("user_id AS total_employee")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn("level", [1, 2]);
            const activity_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id });
            const total_teams = yield this.db("teams")
                .count("team_id AS teams_count")
                .withSchema(this.EVO)
                .where({ association_id: association_id });
            const top_teams = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .limit(5)
                .select("*");
            const top_teams_most_activity = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .select("team_name");
            const verified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_leader_verification: false });
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
    getDashboardDataTeamLeader(association_id, user_id, teamid) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const convartStart = currentDate.setUTCHours(0, 0, 0, 0);
            const convartEnd = currentDate.setUTCHours(23, 59, 59, 999);
            const startDate = new Date(convartStart);
            const endDate = new Date(convartEnd);
            const today_activities = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .count("log_id AS today_activities")
                .where({ log_association_id: association_id })
                .andWhere({ team_id: teamid })
                .andWhere(function () {
                if (currentDate && currentDate) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [startDate, endDate]);
                }
            });
            const myteamfinder = yield this.db("users")
                .count("user_id AS total_employee")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn("level", [1, 2]);
            const activity_log = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_to: user_id });
            // .andWhere({ employee_id: user_id });
            const teamactivity = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_id: teamid });
            const evaluated_by = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_to: user_id })
                .groupBy("evaluate_by");
            const total_teams = yield this.db("teams")
                .count("team_id AS teams_count")
                .withSchema(this.EVO)
                .where({ association_id: association_id });
            const top_teams = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .limit(5)
                .select("*");
            const reportSubmitted = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_by: user_id })
                .groupBy("evaluate_to");
            const verified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_id: teamid })
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_id: teamid })
                .andWhere({ team_leader_verification: false });
            //
            const teamlastfiveactivities = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .limit(5)
                .where({ log_association_id: association_id })
                .andWhere({ team_id: teamid })
                .select("log_datetime", "activity_description", "user_name")
                .orderBy("log_datetime", "desc");
            return {
                total_activity_log: parseInt(teamactivity[0].activity_log),
                verified_log: parseInt(verified_log[0].activity_log),
                unverified_log: parseInt(unverified_log[0].activity_log),
                total_evaluation: parseInt(evaluated_by[0].response_id),
                reportSubmitted: parseInt(reportSubmitted[0].response_id),
                today_activities: parseInt(today_activities[0].today_activities),
                top_teams: top_teams,
                teamlastfiveactivities: teamlastfiveactivities,
            };
        });
    }
    getDashboardDataEmployee(association_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const convartStart = currentDate.setUTCHours(0, 0, 0, 0);
            const convartEnd = currentDate.setUTCHours(23, 59, 59, 999);
            const startDate = new Date(convartStart);
            const endDate = new Date(convartEnd);
            const my_activities = yield this.db("work_logs_user_team_view")
                .count("log_id AS my_activities")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: user_id });
            const today_activities = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .count("log_id AS today_activities")
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: user_id })
                .andWhere(function () {
                if (currentDate && currentDate) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [startDate, endDate]);
                }
            });
            const reportSubmitted = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_by: user_id })
                .groupBy("evaluate_to");
            const activity_log = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_to: user_id });
            // .andWhere({ employee_id: user_id });
            const evaluated_by = yield this.db("responses_v2")
                .count("response_id AS response_id")
                .withSchema(this.EVO)
                .where({ evaluate_to: user_id })
                .groupBy("evaluate_by");
            const total_teams = yield this.db("teams")
                .count("team_id AS teams_count")
                .withSchema(this.EVO)
                .where({ association_id: association_id });
            const top_teams = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .limit(5)
                .select("*");
            const verified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: user_id })
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db("work_logs_user_team_view")
                .count("log_id AS activity_log")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: user_id })
                .andWhere({ team_leader_verification: false });
            const mylastfiveactivities = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ employee_id: user_id })
                .limit(5)
                .select("log_datetime", "activity_description", "team_leader_verification")
                .orderBy("log_datetime", "desc");
            return {
                my_activities: parseInt(my_activities[0].my_activities),
                total_activity_log: parseInt(activity_log[0].activity_log),
                reportSubmitted: parseInt(reportSubmitted[0].response_id),
                today_activities: parseInt(today_activities[0].today_activities),
                verified_log: parseInt(verified_log[0].activity_log),
                unverified_log: parseInt(unverified_log[0].activity_log),
                total_evaluation: parseInt(evaluated_by[0].response_id),
                top_teams: top_teams,
                mylastfiveactivities: mylastfiveactivities,
            };
        });
    }
    //team wise activities
    //check team exsists
    getTeamsInfo(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id })
                .andWhere({ team_id });
            return userMember;
        });
    }
    getRemainingTeam(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const teams = yield this.db("teams")
                .withSchema(this.EVO)
                .where({ association_id })
                .whereNot({ team_id });
            return teams;
        });
    }
    getTeamWiseActivities(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    getTeamWiseActivitiesToday(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const convartStart = currentDate.setUTCHours(0, 0, 0, 0);
            const convartEnd = currentDate.setUTCHours(23, 59, 59, 999);
            const startDate = new Date(convartStart);
            const endDate = new Date(convartEnd);
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere(function () {
                if (currentDate && currentDate) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [startDate, endDate]);
                }
            })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    getTeamWiseActivitiesTodayEmployee(team_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const convartStart = currentDate.setUTCHours(0, 0, 0, 0);
            const convartEnd = currentDate.setUTCHours(23, 59, 59, 999);
            const startDate = new Date(convartStart);
            const endDate = new Date(convartEnd);
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere({ employee_id: user_id })
                .andWhere(function () {
                if (currentDate && currentDate) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [startDate, endDate]);
                }
            })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    getTeamWiseActivitiesEmployee(team_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere({ employee_id })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    getTeamWiseActivitiesSingle(team_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere({ employee_id: user_id })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    getTeamWiseActivitiesSingleToday(team_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const convartStart = currentDate.setUTCHours(0, 0, 0, 0);
            const convartEnd = currentDate.setUTCHours(23, 59, 59, 999);
            const startDate = new Date(convartStart);
            const endDate = new Date(convartEnd);
            const userMember = yield this.db("work_logs_user_team_view")
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere({ employee_id: user_id })
                .andWhere(function () {
                if (currentDate && currentDate) {
                    // Adjust the date range to include the entire day
                    this.andWhereBetween("log_datetime", [startDate, endDate]);
                }
            })
                .select("log_id", "employee_id", "log_datetime", "activity_description", "team_leader_verification", "user_name", "designation", "level", "remarks", "profile_picture", "email", "shift_name", "start_time", "end_time", "days_of_week")
                .leftJoin("working_shifts", "working_shifts.user_id", "=", "work_logs_user_team_view.employee_id")
                .orderBy("log_datetime", "desc");
            return userMember;
        });
    }
    //user relevent info
    getTeamMembersReleventinfo(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .select("user_id", "user_name", "designation", "level", "profile_picture");
            return userMember;
        });
    }
    getTeamMembersReleventinfoSingle(team_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .andWhere({ user_id })
                .select("user_id", "user_name", "designation", "level", "profile_picture");
            return userMember;
        });
    }
    //insert Audit Trail Method
    insertAuditTrail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("execution_logs")
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
}
exports.default = UserModel;
