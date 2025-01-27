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
const notification_service_1 = __importDefault(require("../../common/commonService/notification.service"));
class AdminLeaveService extends abstract_service_1.default {
    constructor() {
        super();
    }
    createLeave(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const { organization_id } = req.admin;
                req.body['organization_id'] = organization_id;
                //check if start date
                const start_date = req.body.start_date;
                const end_date = req.body.start_date;
                //create meeting
                const myTeams = yield this.Model.adminMeetingModel().getMyTeams(req.body.employee_id);
                let myTeamArray = myTeams.map((item) => item.team_id);
                const allOtherUser = yield model.getAllEmployeeWithCurrentUsers(myTeamArray, req.body.employee_id);
                const getCollegues = allOtherUser.map((item) => item.emp_id);
                for (const collegues of getCollegues) {
                    const getEngagedLeaves = yield model.checkDuplicateLeave(collegues, start_date, end_date);
                    if (getEngagedLeaves.length > 0) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Your Leave Has Been Blocked',
                        };
                    }
                }
                //check if one of them are in the leave
                //ended
                const check = yield model.checkDuplicateLeave(Number(req.body.employee_id), start_date, end_date);
                //check date exsists
                if (!check.length) {
                    yield model.createLeave(req.body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Leave Application Has Been Submitted',
                    };
                }
                //leave block
                //myteams
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: 'You have already applied with this certain date',
                };
            }));
        });
    }
    updateLeave(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const notifyService = new notification_service_1.default();
                const { organization_id } = req.admin;
                const id = Number(req.params.id);
                const getLeaveInfo = yield model.getSingleLeave(id);
                yield model.updateLeaveApplication(id, req.body);
                //==============================================
                //            Start of Notification Section
                //==============================================
                const notificationPayload = {
                    user_id: getLeaveInfo[0].employee_id,
                    type: 'leave',
                    ref_id: id,
                    message: `Your Leave Application Has Been ${req.body['status']}`,
                    organization_id: organization_id,
                    title: `Your Leave Application Has Been ${req.body['status']}`,
                    description: `Your Leave Application Has Been ${req.body['status']}`,
                };
                yield notifyService.adminToSingleEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Leave Application Has Updated',
                };
                // if (!check.length) {
                //   const update = await model.updateLeaveApplication(id, req.body);
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_SUCCESSFUL,
                //     message: 'Leave Application Has Updated',
                //   };
                // }
                // //check if start date
                // return {
                //   success: false,
                //   code: this.StatusCode.HTTP_BAD_REQUEST,
                //   message: 'You have already applied with this certain date',
                // };
            }));
        });
    }
    createLeaveTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const { organization_id } = req.admin;
                //check duplicate leave types
                const arrayb = req.body.map((arr) => ({
                    name: arr.name,
                    deduct_from_allowance: arr.deduct_from_allowance,
                    is_enabled: arr.is_enabled,
                    tag_color: arr.tag_color,
                    organization_id: organization_id,
                }));
                yield model.createLeaveType(arrayb);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Leave Type Created Successfully',
                    data: arrayb,
                };
            }));
        });
    }
    //get all leave types
    getAllLeaves(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminLeaveModel();
            const { employee, totalEmployees } = yield model.getAllEmployeesForLeave(organization_id);
            const { leave, pending_approval, total_deductible, total_not_deductible } = yield model.getAllLeaves(organization_id);
            leave.forEach((leaveRecord) => __awaiter(this, void 0, void 0, function* () {
                // Find the employee corresponding to the leave record
                const matchedEmployee = employee.find((emp) => emp.employee_id === leaveRecord.employee_id);
                if (matchedEmployee) {
                    // Add leave information to the matched employee
                    if (!matchedEmployee.employe_leaves) {
                        matchedEmployee.employe_leaves = []; // Initialize employe_leaves array if not already initialized
                    }
                    matchedEmployee.employe_leaves.push(leaveRecord);
                }
            }));
            for (const emp of employee) {
                // Get the employee's leave info
                const { deductible, not_deductible, allowance } = yield model.employeeWiseLeaveInfo(emp.employee_id, organization_id);
                // Add leave info to the employee
                emp.deductible = deductible[0].total_leave;
                emp.not_deductible = not_deductible[0].total_leave;
                emp.allowance = yield model.getLeaveAllowance(organization_id);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: employee,
                totalEmployees: totalEmployees,
                pending_approval: pending_approval,
                total_deductible: total_deductible,
                total_not_deductible: total_not_deductible,
            };
        });
    }
    getSingleLeave(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                const single = yield model.getSingleLeave(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: single[0],
                };
            }));
        });
    }
    getAllLeaveTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const { organization_id } = req.admin;
                // const team_id = await model.getTeam(employee_id);
                const { leave, total } = yield model.getAllLeaveTypes(organization_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: leave,
                    total: total,
                };
            }));
        });
    }
    updateLeaveTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                yield model.updateLeaveType(id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Leave Type Update Created Successfully',
                    data: req.body,
                };
            }));
        });
    }
    deleteLeaveTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                yield model.deleteLeaveType(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Leave Type Deleted',
                };
            }));
        });
    }
    getDashboardLeaveList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const { organization_id } = req.admin;
                //params for filtering
                const { leave_status, to_date, employee, team_leader_verification, remarks, email, } = req.query;
                // const team_id = await model.getTeam(employee_id);
                const data = yield model.getAllLeaveList(organization_id, {
                    leave_status: leave_status,
                    to_date: to_date,
                    employee: employee,
                    team_leader_verification: team_leader_verification,
                    remarks: remarks,
                    email: email,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: data,
                };
            }));
        });
    }
    updateLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const leave_id = parseInt(req.params.id);
                // const team_id = await model.getTeam(employee_id);
                const data = yield model.updateLeaveApplication(leave_id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    deleteLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const leave_id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                const deleteLeave = yield model.deleteLeaveApplication(leave_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Leave Application Deleted Successfully',
                };
            }));
        });
    }
}
exports.default = AdminLeaveService;
