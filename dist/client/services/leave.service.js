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
class MemberLeaveService extends abstract_service_1.default {
    constructor() {
        super();
    }
    createLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminLeaveModel();
                const notifyService = new notification_service_1.default();
                const { id, organization_id } = req.employee;
                req.body["employee_id"] = id;
                req.body["status"] = "pending";
                req.body["organization_id"] = organization_id;
                //check if start date
                const start_date = req.body.start_date;
                const end_date = req.body.start_date;
                const check = yield model.checkDuplicateLeave(id, start_date, end_date);
                //check date exsists
                if (!check.length) {
                    const leave = yield model.createLeave(req.body);
                    const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        user_id: id,
                        type: "leave",
                        ref_id: leave[0].id,
                        message: `has applied for leave`,
                        organization_id: organization_id,
                        title: `has applied for leave`,
                    };
                    yield notifyService.employeeToAllAdmin(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "Leave Application Has Been Submitted",
                    };
                }
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: "You have already applied with this certain date",
                };
            }));
        });
    }
    updateLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const leave_id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                const { id } = req.employee;
                req.body["employee_id"] = id;
                req.body["status"] = "pending";
                //check if start date
                yield model.updateLeaveApplicationEmployee(leave_id, id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Leave Application Has Been Updated",
                };
            }));
        });
    }
    getMyLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const model = this.Model.adminLeaveModel();
                const { employee } = yield model.getEmployee(id);
                const leave = yield model.getEmployeeLeave(id);
                // Get the employee's leave info
                const { deductible, not_deductible, allowance } = yield model.employeeWiseLeaveInfo(id, organization_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: leave,
                    deductible: deductible[0].total_leave,
                    not_deductible: not_deductible[0].total_leave,
                    allowance: allowance.leave_allowance,
                };
            }));
        });
    }
    getAllLeaveTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.employee;
                const model = this.Model.adminLeaveModel();
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
    deleteMyLeaveApplication(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const leave_id = Number(req.params.id);
                const model = this.Model.adminLeaveModel();
                const deleteLeave = yield model.deleteMyLeaveApplicaiton(leave_id, id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Leave Application Deleted Successfully",
                };
            }));
        });
    }
}
exports.default = MemberLeaveService;
