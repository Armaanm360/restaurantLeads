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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class MemberEmployeeService extends abstract_service_1.default {
    constructor() {
        super();
    }
    createEmployeeCurrentLocation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                const model = this.Model.employeeModel();
                req.body["employee_id"] = id;
                // req.body['organization_id'] = id;
                //first check exist or not
                const checkEmployeeOnTrackingModule = yield model.checkEmployeeAvailableOnLocation(id);
                console.log(checkEmployeeOnTrackingModule);
                if (!checkEmployeeOnTrackingModule.length) {
                    //update
                    yield model.createEmployeeLocation(req.body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: req.body,
                    };
                }
                else {
                    //insert
                    yield model.updateEmployeeLocation(id, req.body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: req.body,
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
                // req.body['latitude'] = 40.7128;
                // req.body['longitude'] = -74.006;
                // req.body['timestamp'] = '2024-07-03 14:30:00-04:00';
                // req.body['accuracy'] = 10.5;
                // req.body['accuracy'] = 'iPhone12-ABCD1234';
                // req.body['ip_address'] = '192.168.1.100';
            }));
        });
    }
    clearNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                yield this.Model.employeeModel().removeNotification(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Notification Cleared",
                };
            }));
        });
    }
    allNotificationViewEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            yield this.Model.commonModel().allNotificationViewEmployee(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Notification Viewed",
            };
        });
    }
    // get all employee
    getAllEployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const { organization_id } = req.employee;
            const model = this.Model.employeeModel();
            const { data, total } = yield model.getAllEmploye({
                organization_id,
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get all employee for conversation
    getAllEployeeForConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, type, status } = req.query;
            const { organization_id } = req.employee;
            // get employee
            const { data, total } = yield this.Model.employeeModel().getAllEmploye({
                organization_id,
                key: key,
                limit: limit,
                skip: skip,
                type: type,
                status: status,
            });
            // get admin
            // const { data: adminData, total: adminDataTotal } =
            //   await this.Model.UserAdminModel().getAllAdmin(organization_id, {
            //     key: key as string,
            //     limit: limit as string,
            //     skip: skip as string,
            //   });
            const combinedEmp = [];
            let combinedTotal = 0;
            if (data.length) {
                for (let i = 0; i < data.length; i++) {
                    combinedEmp.push({
                        id: data[i].id,
                        name: data[i].name,
                        photo: data[i].photo,
                        designation: data[i].designation,
                        type: "employee",
                    });
                    combinedTotal = total;
                }
            }
            // if (adminData.length) {
            //   for (let i = 0; i < adminData.length; i++) {
            //     combinedEmp.push({
            //       id: adminData[i].id,
            //       name: adminData[i].name,
            //       photo: adminData[i].avatar,
            //       designation: "",
            //       type: "admin",
            //     });
            //     combinedTotal += adminDataTotal;
            //   }
            // }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: combinedEmp,
                total: combinedTotal,
            };
        });
    }
    // get single employee
    getSingleEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.employeeModel();
            const data = yield model.getSingleEmployee({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = data[0], { password } = _a, rest = __rest(_a, ["password"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: rest,
            };
        });
    }
    getAllNotification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            const model = this.Model.commonModel();
            const { data, seen, unseen } = yield model.getAllEmployeeNotification(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data,
                seen,
                unseen,
            };
        });
    }
    updateNotificationStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.commonModel();
                const notification_id = Number(req.body.notification_id);
                const user_id = Number(req.body.user_id);
                yield model.employeeNotificationSeen(notification_id, user_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
}
exports.default = MemberEmployeeService;
