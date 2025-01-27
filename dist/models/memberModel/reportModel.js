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
class reportModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    getTeamReport(association_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const teaminfo = yield this.db('teams')
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ team_id: team_id });
            const teamLeader = yield this.db('user_team_view')
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .andWhere({ level: 3 });
            const total_team_members = yield this.db('user_team_view')
                .withSchema(this.EVO)
                .count('user_id AS total_team_members')
                .where({ team_id: team_id });
            const total_employee = yield this.db('users')
                .count('user_id AS total_employee')
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn('level', [1, 2]);
            const total_evaluated_employees = yield this.db('user_responses_view')
                .count('user_id AS total_employee')
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .whereNotIn('level', [1, 2]);
            const activity_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ log_association_id: association_id });
            const total_teams = yield this.db('teams')
                .count('team_id AS teams_count')
                .withSchema(this.EVO)
                .where({ association_id: association_id });
            const top_teams = yield this.db('teams')
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .limit(5)
                .select('*');
            const top_teams_most_activity = yield this.db('work_logs_user_team_view')
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .select('team_name');
            const verified_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ log_association_id: association_id })
                .andWhere({ team_leader_verification: false });
            return {
                team_name: teaminfo[0].team_name,
                current_team_leader: teamLeader[0].user_name,
                total_team_members: parseInt(total_team_members[0].total_team_members),
                last_month_evaluation_mark: parseInt(verified_log[0].activity_log),
                highest_marks: parseInt(unverified_log[0].activity_log),
                top_position_holder: parseInt(total_teams[0].teams_count),
                total_activities_found: parseInt(total_employee[0].total_employee),
                total_verified_activities: parseInt(total_employee[0].total_employee),
                total_unverified_activities: parseInt(total_employee[0].total_employee),
                total_remarked_activities: parseInt(total_employee[0].total_employee),
                total_evaluation_report_submitted: parseInt(total_employee[0].total_employee),
            };
        });
    }
    getUserReport(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userinfo = yield this.db('users')
                .withSchema(this.EVO)
                .where({ 'users.user_id': user_id }) // Specify the table alias for "user_id"
                .leftJoin('working_shifts', 'working_shifts.user_id', '=', 'users.user_id')
                .select('name', 'users.user_id As userid', // Corrected aliasing syntax
            'username', 'designation', 'level', 'phone', 'email', 'profile_picture', 'shift_name', 'start_time', 'end_time', 'days_of_week');
            const activity_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ employee_id: user_id });
            const verified_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ employee_id: user_id })
                .andWhere({ team_leader_verification: true });
            const unverified_log = yield this.db('work_logs_user_team_view')
                .count('log_id AS activity_log')
                .withSchema(this.EVO)
                .where({ employee_id: user_id })
                .andWhere({ team_leader_verification: false });
            return {
                user_name: userinfo[0].name,
                username: userinfo[0].username,
                designation: userinfo[0].designation,
                position: userinfo[0].level,
                level: userinfo[0].level,
                phone: userinfo[0].phone,
                email: userinfo[0].email,
                profile_picture: userinfo[0].profile_picture,
                unique_id: userinfo[0].username,
                joining_date: userinfo[0].created_at,
                total_evaluation_submited: parseInt(activity_log[0].activity_log),
                total_activities_found: parseInt(activity_log[0].activity_log),
                toal_verified_activities: parseInt(activity_log[0].activity_log),
                total_unverified_activities: parseInt(activity_log[0].activity_log),
                total_remarked_activities: parseInt(activity_log[0].activity_log),
                last_month_evaluation_score: parseInt(activity_log[0].activity_log),
                last_month_evaluation_mark: parseInt(activity_log[0].activity_log),
                highest_marks: parseInt(activity_log[0].activity_log),
                shift_name: userinfo[0].shift_name,
                start_time: userinfo[0].start_time,
                end_time: userinfo[0].end_time,
                days_of_week: userinfo[0].days_of_week,
            };
        });
    }
    getPersonWiseMeetingReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { start_date, end_date, person_id } = req.query;
            return {};
            //  const single = await this.Model.reportModel().getPersonWiseMeetingReport(
            //    req
            //  );
            //  let empList = getAllEmployee.map((item) => item.person_id);
            //  let getData = [];
            //  // Loop to fetch details for each employee
            //  for (const empId of empList) {
            //    const employeeDetails =
            //      await this.Model.employeeModel().getSingleInfoEmployee(empId);
            //    // Fetch meetings for the current employee
            //    const { data, total } =
            //      await this.Model.reportModel().getPersonWiseMeetingReport(req);
            //    // Structure the employee data with meetings
            //    const employeeData = {
            //      id: employeeDetails.id,
            //      name: employeeDetails.name,
            //      total,
            //      meeting: data,
            //    };
            //    // Push the structured data to dataist
            //    getData.push(employeeData);
            //  }
            //  return {
            //    success: true,
            //    code: this.StatusCode.HTTP_SUCCESSFUL,
            //    message: this.ResMsg.HTTP_SUCCESSFUL,
            //    data: getData,
            //    singlData: single,
            //  };
            // Ensure the dates are provided
            // Query the database
            const data = yield this.db('meeting_person as mp')
                .withSchema(this.MEETING)
                .leftJoin('meeting as m', 'm.id', '=', 'mp.meeting_id')
                .leftJoin('meeting_places as mpl', 'm.place', '=', 'mpl.place_id')
                .joinRaw('JOIN crm.employee AS employee ON mp.person_id = employee.id')
                .andWhere(function () {
                if (start_date && end_date) {
                    this.whereBetween('m.meeting_date', [start_date, end_date]);
                }
                if (person_id) {
                    this.andWhere('mp.person_id', person_id);
                }
            })
                .select('m.title', 'mpl.place_name', 'mpl.address', 'm.meeting_date', 'mp.person_id', 'm.start_time', 'm.end_time', 'm.meeting_link', 'employee.name as employee_name');
            const total_meeting = yield this.db('meeting_person as mp')
                .withSchema(this.MEETING)
                .leftJoin('meeting as m', 'm.id', '=', 'mp.meeting_id')
                .leftJoin('meeting_places as mpl', 'm.place', '=', 'mpl.place_id')
                .joinRaw('JOIN crm.employee AS employee ON mp.person_id = employee.id')
                .andWhere(function () {
                if (start_date && end_date) {
                    this.whereBetween('m.meeting_date', [start_date, end_date]);
                }
                if (person_id) {
                    this.andWhere('mp.person_id', person_id);
                }
            })
                .count('m.id as total');
            return { data, total: total_meeting[0].total };
        });
    }
    meetingReport(organization_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from_date, to_date, meeting_title, place_id, person_id, meeting_type, status, } = req.query;
            const dtbs = this.db('meeting as m');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            // Query the database
            const data = yield dtbs
                .withSchema(this.MEETING)
                // .leftJoin('meeting_person as mp', 'm.id', '=', 'mp.meeting_id')
                .leftJoin('meeting_places as mpl', 'm.place', '=', 'mpl.place_id')
                .joinRaw('JOIN crm.employee AS employee ON m.created_by = employee.id')
                .where('m.organization_id', organization_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.whereBetween('m.meeting_date', [from_date, to_date]);
                }
                if (meeting_title) {
                    this.andWhere('m.title', 'ILIKE', `%${meeting_title}%`);
                }
                if (place_id) {
                    this.andWhere('m.place', place_id);
                }
                if (person_id) {
                    this.andWhere('m.created_by', person_id);
                }
                if (meeting_type) {
                    this.andWhere('m.meeting_type', meeting_type);
                }
                if (status) {
                    this.andWhere('m.status', status);
                }
            })
                .select('m.title', 'm.id as meeting_id', 'mpl.place_name', 'mpl.address', 'm.meeting_date', 
            // 'mp.person_id',
            'm.start_time', 'm.end_time', 'm.status', 'm.meeting_type', 'm.place', 'employee.id', 'employee.name as employee_name')
                .groupBy('m.title', 'm.id', 'mpl.place_name', 'mpl.address', 'm.meeting_date', 
            // 'mp.person_id',
            'm.start_time', 'm.end_time', 'm.status', 'm.meeting_type', 'm.place', 'employee.id', 'employee.name')
                .orderBy('m.id', 'desc');
            const total_meeting = yield this.db('meeting as m')
                .withSchema(this.MEETING)
                // .leftJoin('meeting_person as mp', 'm.id', '=', 'mp.meeting_id')
                .leftJoin('meeting_places as mpl', 'm.place', '=', 'mpl.place_id')
                .joinRaw('JOIN crm.employee AS employee ON m.created_by = employee.id')
                .where('m.organization_id', organization_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.whereBetween('m.meeting_date', [from_date, to_date]);
                }
                if (meeting_title) {
                    this.andWhere('m.title', 'ILIKE', `%${meeting_title}%`);
                }
                if (place_id) {
                    this.andWhere('m.place', place_id);
                }
                if (person_id) {
                    this.andWhere('m.created_by', person_id);
                }
                if (meeting_type) {
                    this.andWhere('m.meeting_type', meeting_type);
                }
                if (status) {
                    this.andWhere('m.status', status);
                }
            })
                // .groupBy(
                //   'm.title',
                //   'm.id',
                //   'mpl.place_name',
                //   'mpl.address',
                //   'm.meeting_date',
                //   'mp.person_id',
                //   'm.start_time',
                //   'm.end_time',
                //   'm.status',
                //   'm.meeting_type',
                //   'm.place',
                //   'employee.name'
                // )
                .count('m.id as total');
            return { data, total: total_meeting[0].total };
        });
    }
    leaveReport(employee_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from_date, to_date } = req.query;
            const dtbs = this.db('employee_leave_view as elv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            // Query the database
            const data = yield dtbs
                .withSchema(this.LEAVE)
                .where('elv.employee_id', employee_id)
                .andWhere('elv.leave_status', 'approved')
                .andWhere(function () {
                // Apply date range filter if both from_date and to_date are provided
                if (from_date && to_date) {
                    this.whereBetween('elv.start_date', [
                        from_date,
                        to_date,
                    ]).orWhereBetween('elv.end_date', [from_date, to_date]);
                }
            })
                .select('*');
            const total_meeting = yield this.db('employee_leave_view as elv')
                .withSchema(this.LEAVE)
                .where('elv.employee_id', employee_id)
                .andWhere('elv.leave_status', 'approved')
                .andWhere(function () {
                // Apply date range filter if both from_date and to_date are provided
                if (from_date && to_date) {
                    this.whereBetween('elv.start_date', [
                        from_date,
                        to_date,
                    ]).orWhereBetween('elv.end_date', [from_date, to_date]);
                }
            })
                // .groupBy(
                //   'm.title',
                //   'm.id',
                //   'mpl.place_name',
                //   'mpl.address',
                //   'm.meeting_date',
                //   'mp.person_id',
                //   'm.start_time',
                //   'm.end_time',
                //   'm.status',
                //   'm.meeting_type',
                //   'm.place',
                //   'employee.name'
                // )
                .count('elv.leave_id as total');
            return { data, total: total_meeting[0].total };
        });
    }
    getOrgnizationWiseMeetingUsers(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userinfo = yield this.db('meeting as m')
                .withSchema(this.MEETING)
                .where('m.organization_id', organization_id)
                .whereNotNull('mp.person_id')
                .leftJoin('meeting_person as mp', 'm.id', '=', 'mp.meeting_id')
                .select('mp.person_id')
                .groupBy('mp.person_id');
            return userinfo;
        });
    }
    getPersonWiseEvaluationInfo(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluated_by = yield this.db('responses_with_questions_v2 as res')
                .withSchema(this.EVO)
                .where('res.evaluate_to', employee_id)
                .count('evaluate_by');
            const evaluated_to = yield this.db('responses_with_questions_v2 as res')
                .withSchema(this.EVO)
                .where('res.evaluate_by', employee_id)
                .count('evaluate_to');
            const evaluation_mark = yield this.db('responses_with_questions_v2 as res')
                .withSchema(this.EVO)
                .where('res.evaluate_to', employee_id)
                .sum('option_mark');
            return { evaluated_by, evaluated_to, evaluation_mark };
        });
    }
}
exports.default = reportModel;
