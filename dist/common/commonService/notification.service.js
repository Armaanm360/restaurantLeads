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
const pushNotification_1 = __importDefault(require("../../common/pushNotification/pushNotification"));
const socket_1 = require("../../app/socket");
class notificationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create expense
    //employee to all admin
    employeeToAllAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = payload.user_id;
            const type = payload.type;
            const ref_id = payload.ref_id;
            const message = payload.message;
            const organization_id = payload.organization_id;
            //==============================================
            //                Notification Section
            //==============================================
            const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(user_id);
            const notify = yield this.Model.commonModel().createNotificationAdmin({
                type: `${type}`,
                ref_id: ref_id,
                message: `${get_user_socket_id.name} ${message}`,
            });
            // Send notification to admins
            if (get_user_socket_id && get_user_socket_id.socket_id) {
                const allUsers = yield this.Model.UserAdminModel().getAllAdminSocket(organization_id); // Fetch all connected users
                if (!allUsers || allUsers.length === 0) {
                    console.error('No connected users found.');
                }
                else {
                    // console.log("All connected users:", allUsers);
                    // ========= push notification for app ==========//
                    const accessToken = yield pushNotification_1.default.generateFCMAccessToken();
                    // for website notification
                    allUsers.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                        if (user && user.socket_id) {
                            socket_1.io.to(user.socket_id).emit('notification', {
                                message: notify[0].message,
                                type: type,
                                ref_id: ref_id,
                            });
                            this.Model.commonModel().addAdminNotification({
                                notification_id: notify[0].id,
                                user_id: user.id,
                            });
                            // await PushNotificationService.sendNotificationToSelectedDriver(
                            //   accessToken,
                            //   'requisition',
                            //   req.body.comments,
                            //   user.device_token
                            // );
                            console.log('Notification emitted to socket ID:', user.socket_id);
                        }
                        else {
                            console.error('Socket ID not found for user:', user.id);
                        }
                    }));
                }
            }
            else {
                console.error('Failed to emit notification, socket ID is invalid.');
            }
            //==============================================
            //            End of Notification Section
            //==============================================
            console.log('Armaan Zindabaad');
        });
    }
    //admin to specific employee
    adminToSingleEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = payload.user_id;
            const type = payload.type;
            const ref_id = payload.ref_id;
            const message = payload.message;
            const organization_id = payload.organization_id;
            //==============================================
            //                Notification Section
            //==============================================
            const notify = yield this.Model.commonModel().createNotification({
                type: `${type}`,
                ref_id: ref_id,
                message: `${message}`,
            });
            const employeeNotification = yield this.Model.commonModel().addEmployeeNotification({
                notification_id: notify[0].id,
                user_id: user_id,
            });
            console.log('Notification added:', employeeNotification);
            //  io.emit('notification', `You Have Been Added To Meeting ${meeting_id}`);
            const userid = user_id;
            const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(user_id);
            console.log('User info:', get_user_socket_id);
            if (!get_user_socket_id || !get_user_socket_id.socket_id) {
                console.error('Socket ID not found for user:', userid);
            }
            else {
                console.log('Socket ID:', get_user_socket_id.socket_id);
            }
            //   console.log(get_user_socket_id.socket_id);
            if (get_user_socket_id && get_user_socket_id.socket_id) {
                socket_1.io.to(get_user_socket_id.socket_id).emit('notification', {
                    message: notify[0].message,
                    type: 'requisition',
                    ref_id: ref_id,
                });
                console.log('Notification emitted to socket ID:', get_user_socket_id.socket_id);
            }
            else {
                console.error('Failed to emit notification, socket ID is invalid.');
            }
            //==============================================
            //            End of Notification Section
            //==============================================
        });
    }
    //admin to all employee
    adminToAllEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = payload.type;
            const ref_id = payload.ref_id;
            const message = payload.message;
            const title = payload.title;
            const description = payload.description;
            const organization_id = payload.organization_id;
            //==============================================
            //                Notification Section
            //==============================================
            const notify = yield this.Model.commonModel().createNotification({
                type: `${type}`,
                ref_id: ref_id,
                message: `${message}`,
            });
            const allUsers = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id);
            const accessToken = yield pushNotification_1.default.generateFCMAccessToken();
            if (!allUsers.length) {
                console.error('No connected users found.');
            }
            else {
                yield Promise.all(allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user && user.socket_id) {
                        yield this.Model.commonModel().addEmployeeNotification({
                            notification_id: notify[0].id,
                            user_id: user.id,
                        });
                        // ========= push notification for app ==========//
                        yield pushNotification_1.default.sendNotificationToSelectedDriver({
                            accessToken,
                            title: 'notice',
                            ref_id: JSON.stringify(ref_id),
                            deviceToken: user.device_token,
                            body: title,
                        });
                        socket_1.io.to(user.socket_id).emit('notification', {
                            message: notify[0].message,
                            type: 'notice',
                            ref_id: ref_id,
                        });
                        console.log('Notification emitted to socket ID:', user.socket_id);
                    }
                    else {
                        console.error('Socket ID not found for user:', user.id);
                    }
                })));
            }
            //==============================================
            //            End of Notification Section
            //==============================================
        });
    }
    //team member real upload
    teamMemberLive(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = payload.type;
            const ref_id = payload.ref_id;
            const message = payload.message;
            const title = payload.title;
            const organization_id = payload.organization_id;
            //==============================================
            //                Notification Section
            //==============================================
            const notify = yield this.Model.commonModel().createNotification({
                type: `${type}`,
                ref_id: ref_id,
                message: `${message}`,
            });
            const allUsers = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id);
            const accessToken = yield pushNotification_1.default.generateFCMAccessToken();
            if (!allUsers.length) {
                console.error('No connected users found.');
            }
            else {
                yield Promise.all(allUsers.map((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user && user.socket_id) {
                        yield this.Model.commonModel().addEmployeeNotification({
                            notification_id: notify[0].id,
                            user_id: user.id,
                        });
                        // ========= push notification for app ==========//
                        yield pushNotification_1.default.sendNotificationToSelectedDriver({
                            accessToken,
                            title: 'notice',
                            ref_id: JSON.stringify(ref_id),
                            deviceToken: user.device_token,
                            body: title,
                        });
                        socket_1.io.to(user.socket_id).emit('notification', {
                            message: notify[0].message,
                            type: 'notice',
                            ref_id: ref_id,
                        });
                        console.log('Notification emitted to socket ID:', user.socket_id);
                    }
                    else {
                        console.error('Socket ID not found for user:', user.id);
                    }
                })));
            }
            //==============================================
            //            End of Notification Section
            //==============================================
        });
    }
}
exports.default = notificationService;
