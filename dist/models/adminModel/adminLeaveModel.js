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
class adminLeaveModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createLeave(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .insert(payload)
                .returning('*');
            return leave;
        });
    }
    createLeaveType(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leave_types')
                .withSchema(this.LEAVE)
                .insert(payload);
            return leave;
        });
    }
    updateLeaveType(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leave_types')
                .withSchema(this.LEAVE)
                .where({ id })
                .update(payload);
            return leave;
        });
    }
    deleteLeaveType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leave_types')
                .withSchema(this.LEAVE)
                .where({ id })
                .update('is_deleted', true);
            return leave;
        });
    }
    getAllLeaveTypes(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leave_types')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('is_deleted', false)
                .select('*')
                .orderBy('id', 'desc');
            const total = yield this.db('leave_types')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('is_deleted', false)
                .count('id as total');
            return { leave, total: parseInt(total[0].total) };
        });
    }
    getAllLeaves(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_is_deleted', false)
                .select('*')
                .orderBy('leave_id', 'desc');
            const pending_approval = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('status', 'pending')
                .andWhere('is_deleted', false)
                .count('id as total_pending_approval');
            const total_deductible = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_deduct_from_allowance', true)
                .andWhere('leave_status', 'approved')
                .andWhere('leave_is_deleted', false)
                .sum('number_of_working_days as total_deductible');
            const total_not_deductible = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_deduct_from_allowance', false)
                .andWhere('leave_status', 'approved')
                .andWhere('leave_is_deleted', false)
                .sum('number_of_working_days as total_not_deductible');
            return {
                leave,
                pending_approval: parseInt(pending_approval[0].total_pending_approval),
                total_deductible: parseInt(total_deductible[0].total_deductible),
                total_not_deductible: parseInt(total_not_deductible[0].total_not_deductible),
            };
        });
    }
    getEmployeeLeave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('employee_id', id)
                .andWhere('leave_is_deleted', false)
                .select('*');
            return leave;
        });
    }
    employeeWiseLeaveInfo(employee_id, organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deductible = yield this.db('employee_leave_view as elv')
                .withSchema(this.LEAVE)
                .where('elv.employee_id', employee_id)
                .andWhere('elv.organization_id', organization_id)
                .andWhere('elv.leave_status', 'approved')
                .andWhere('elv.leave_deduct_from_allowance', true)
                .sum('elv.number_of_working_days as total_leave');
            const not_deductible = yield this.db('employee_leave_view as elv')
                .withSchema(this.LEAVE)
                .where('elv.employee_id', employee_id)
                .andWhere('elv.leave_status', 'approved')
                .andWhere('elv.leave_deduct_from_allowance', false)
                .sum('elv.number_of_working_days as total_leave');
            const allowance = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where({ id: organization_id })
                .select('leave_allowance')
                .first();
            // .orderBy('id', 'desc');
            return { deductible, not_deductible, allowance };
        });
    }
    getAllEmployeesForLeave(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .select('id as employee_id', 'name as employee_name', 'email as employee_email');
            const totalEmployees = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .count('id as total');
            return {
                employee,
                totalEmployees: parseInt(totalEmployees[0].total),
            };
        });
    }
    getLeaveAllowance(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const org = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where({ id: organization_id })
                .select('leave_allowance');
            return org[0].leave_allowance;
        });
    }
    getSingleLeave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where({ id })
                .select('*');
        });
    }
    getAllEmployeeWithCurrentUsers(teams, current_employee) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('teams_employee')
                .withSchema(this.EVO)
                .whereIn('team_id', teams)
                .whereNot('emp_id', current_employee)
                .select('*');
        });
    }
    checkWhoIsOntheLeave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where('employee_id', id)
                .select('*');
        });
    }
    getEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .select('id as employee_id', 'name as employee_name', 'email as employee_email');
            return {
                employee,
            };
        });
    }
    deleteMyLeaveApplicaiton(leave_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where({ id: leave_id })
                .andWhere({ employee_id })
                .delete();
            return employee;
        });
    }
    deleteLeaveApplication(leave_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where({ id: leave_id })
                .delete();
            return leave;
        });
    }
    //check already applied for leave
    checkDuplicateLeave(employee_id, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('employee_id', employee_id)
                .andWhere(function () {
                this.whereBetween('start_date', [startDate, endDate])
                    .orWhereBetween('end_date', [startDate, endDate])
                    .orWhere(function () {
                    this.where('start_date', '<=', startDate).andWhere('end_date', '>=', endDate);
                });
            });
            return check;
        });
    }
    checkDuplicateLeaveDuringUpdate(leave_id, employee_id, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.db('employee_leave_view')
                .withSchema(this.LEAVE)
                .where('employee_id', employee_id)
                .andWhereNot('id', leave_id)
                .andWhere(function () {
                this.whereBetween('start_date', [startDate, endDate])
                    .orWhereBetween('end_date', [startDate, endDate])
                    .orWhere(function () {
                    this.where('start_date', '<=', startDate).andWhere('end_date', '>=', endDate);
                });
            });
            return check;
        });
    }
    // insert user admin
    getMyLeaveList(employee_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, employee, team_leader_verification, remarks, email, } = payload;
            const userMember = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where({ leave_employee_id: employee_id })
                // .andWhere(function () {
                //   if (from_date && to_date) {
                //     this.andWhereBetween('log_datetime', [from_date, to_date]);
                //   }
                //   if (employee) {
                //     this.andWhere('employee_id', employee);
                //   }
                //   if (team_leader_verification) {
                //     this.andWhere('team_leader_verification', team_leader_verification);
                //   }
                //   if (remarks) {
                //     this.andWhere('remarks', remarks);
                //   }
                //   if (email) {
                //     // Perform a partial search for email addresses
                //     this.andWhere('email', 'like', `%${email}%`);
                //   }
                // })
                .select('*');
            return userMember;
        });
    }
    // insert user admin
    getAllLeaveList(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { leave_status, to_date, employee, team_leader_verification, remarks, email, } = payload;
            const userMember = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where({ organization_id })
                .andWhere(function () {
                // if (from_date && to_date) {
                //   this.andWhereBetween('log_datetime', [from_date, to_date]);
                // }
                if (leave_status) {
                    this.andWhere('leave_status', leave_status);
                }
                //   if (team_leader_verification) {
                //     this.andWhere('team_leader_verification', team_leader_verification);
                //   }
                //   if (remarks) {
                //     this.andWhere('remarks', remarks);
                //   }
                //   if (email) {
                //     // Perform a partial search for email addresses
                //     this.andWhere('email', 'like', `%${email}%`);
                //   }
            })
                .select('*');
            return userMember;
        });
    }
    getDashboardLeaves(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { leave_status } = payload;
            const calender = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_status', 'Approved')
                .andWhere(function () {
                // if (from_date && to_date) {
                //   this.andWhereBetween('log_datetime', [from_date, to_date]);
                // }
                if (leave_status) {
                    this.andWhere('leave_status', 'Approved');
                }
                //   if (team_leader_verification) {
                //     this.andWhere('team_leader_verification', team_leader_verification);
                //   }
                //   if (remarks) {
                //     this.andWhere('remarks', remarks);
                //   }
                //   if (email) {
                //     // Perform a partial search for email addresses
                //     this.andWhere('email', 'like', `%${email}%`);
                //   }
            })
                .select('employee_name as title', 'leave_start_date as date', 'leave_id as leaveId');
            const apprequests = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_status', 'Pending')
                .andWhere(function () { })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'leave_reason', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            const todayleaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('organization_id', organization_id)
                .andWhere('leave_status', 'Approved')
                .andWhere(function () {
                // if (from_date && to_date) {
                //   this.andWhereBetween('log_datetime', [from_date, to_date]);
                // }
                if (leave_status) {
                    this.andWhere('leave_status', 'Approved');
                }
            })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            const rejectedLeaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('leave_status', 'Rejected')
                .andWhere(function () { })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            const approvedLeaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('leave_status', 'Approved')
                .andWhere(function () { })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            return {
                calender,
                apprequests,
                todayleaves,
                rejectedLeaves,
                approvedLeaves,
            };
        });
    }
    getDashboardLeavesEmployee(leave_employee_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const calenderLeaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .whereIn('leave_employee_id', employee_id)
                .andWhere('leave_status', 'Approved')
                .andWhere(function () {
                // if (from_date && to_date) {
                //   this.andWhereBetween('log_datetime', [from_date, to_date]);
                // }
                //   if (team_leader_verification) {
                //     this.andWhere('team_leader_verification', team_leader_verification);
                //   }
                //   if (remarks) {
                //     this.andWhere('remarks', remarks);
                //   }
                //   if (email) {
                //     // Perform a partial search for email addresses
                //     this.andWhere('email', 'like', `%${email}%`);
                //   }
            })
                .select('employee_name as title', 'leave_start_date as date', 'leave_id as leaveId');
            const myapprovedLeaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('leave_employee_id', leave_employee_id)
                .andWhere('leave_status', 'Approved')
                .andWhere(function () { })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            const todayOnLeaves = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .where('leave_status', 'Approved')
                .andWhere(function () { })
                .select('employee_name', 'leave_start_date as stating_date', 'leave_end_date as ending_date', 'leave_id as leaveId', 'employee_designation', 'employee_phone', 'employee_email', 'teams as teams');
            return {
                todayOnLeaves,
                myapprovedLeaves,
                calenderLeaves,
            };
        });
    }
    createLeaveApplication(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .insert(payload);
            return userMember;
        });
    }
    updateLeaveApplication(leave_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where({ id: leave_id })
                .update(payload)
                .returning('employee_id');
            return userMember;
        });
    }
    updateLeaveApplicationEmployee(leave_id, employee_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .where({ id: leave_id })
                .andWhere({ employee_id })
                .update(payload);
            return userMember;
        });
    }
    //getMyTeams
    getMyTeams(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams_employee')
                .withSchema(this.EVO)
                .where('emp_id', employee_id)
                .select('team_id');
            return userMember;
        });
    }
    //myTeam'sMembers
    getMyTeamMembers(employee_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams_employee')
                .withSchema(this.EVO)
                .whereIn('team_id', team_id)
                .select('emp_id')
                .groupBy('emp_id');
            return userMember;
        });
    }
    //myTeam'sMembers Leave Applications
    getMyTeamMembersApplications(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('leave_employees')
                .withSchema(this.LEAVE)
                .whereIn('leave_employee_id', employee_id)
                .andWhere('leave_status', 'Approved')
                .select('*');
            return userMember;
        });
    }
}
exports.default = adminLeaveModel;
