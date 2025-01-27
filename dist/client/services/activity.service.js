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
const socket_1 = require("../../app/socket");
const notification_service_1 = __importDefault(require("../../common/commonService/notification.service"));
class MemberActivityService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create team
    createActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                const notifyService = new notification_service_1.default();
                const model = this.Model.userModel();
                const createEvaluationsPromises = req.body.map((evaluation) => __awaiter(this, void 0, void 0, function* () {
                    evaluation['employee_id'] = id;
                    evaluation['organization_id'] = organization_id;
                    const lastInsertedData = yield model.createActivity(evaluation);
                    return lastInsertedData[0]; // Assuming lastInsertedData is an array with the inserted row as the first element
                }));
                // Wait for all evaluations to be created
                const allInsertedData = yield Promise.all(createEvaluationsPromises);
                // Get the last inserted data
                const lastInsertedActivity = allInsertedData[allInsertedData.length - 1];
                // Extract the log_id from the last inserted data
                const { log_id, team_id } = lastInsertedActivity;
                // Get the complete response using log_id
                const completeResponse = yield model.getSingleActivity(log_id, team_id);
                // io.emit('notification', {
                //   data: completeResponse[0],
                // });
                // io.emit('notification', {
                //   message: 'New Activity Added',
                //   type: 'activity',
                //   data: completeResponse[0],
                // });
                //==============================================
                //                Notification Section
                //==============================================
                // const notificationPayload = {
                //   user_id: id,
                //   organization_id: organization_id,
                // };
                // await notifyService.adminToSingleEmployee(notificationPayload);
                const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                const teamMembers = yield model.getTeamsMember(parseInt(team_id));
                const teamMap = teamMembers.map((item) => item.emp_id);
                // Send notification to employee verifier
                if (get_user_socket_id && get_user_socket_id.socket_id) {
                    const allUsers = yield this.Model.employeeModel().getTemsEmployeeSocket(teamMap);
                    if (!allUsers || allUsers.length === 0) {
                        console.error('No connected users found.');
                    }
                    else {
                        console.log('All connected users:', allUsers);
                        allUsers.forEach((user) => {
                            if (user && user.socket_id && user.name) {
                                socket_1.io.to(user.socket_id).emit('activity-live', {
                                    message: `A New Activity Has Been Added`,
                                    type: 'activity',
                                    data: completeResponse[0],
                                });
                                console.log('Notification emitted to socket ID:', user.socket_id);
                            }
                            else {
                                console.error('Socket ID not found for user:', user.id);
                            }
                        });
                    }
                }
                else {
                    console.error('Failed to emit notification, socket ID is invalid.');
                }
                // Send notification to admin
                const allAdmins = yield this.Model.UserAdminModel().getAllAdminSocket(organization_id); // Fetch all connected users
                allAdmins.forEach((user) => {
                    socket_1.io.to(user.socket_id).emit('activity-live-admin', {
                        data: completeResponse[0],
                    });
                    console.log('Notification emitted to socket ID:', user.socket_id);
                });
                //==============================================
                //            End of Notification Section
                //==============================================
                // const teamVerifiers = [];
                // const get_user_socket_id =
                //   await this.Model.employeeModel().getSingleInfoEmployee(id);
                // const teamMembers = await model.getVerifier(parseInt(team_id));
                // const teamMap = teamMembers.map((item) => item.employee_id);
                // const allUsers = await this.Model.employeeModel().getTemsEmployeeSocket(
                //   teamMap
                // );
                // if (!allUsers || allUsers.length === 0) {
                //   console.error('No connected users found.');
                // } else {
                //   console.log('All connected users:', allUsers);
                //   allUsers.forEach((user) => {
                //     if (user && user.socket_id && user.name) {
                //       io.to(user.socket_id).emit('activity-live', {
                //         message: `A New Activity Has Been Added`,
                //         type: 'activity',
                //         data: completeResponse[0],
                //       });
                //       console.log('Notification emitted to socket ID:', user.socket_id);
                //     } else {
                //       console.error('Socket ID not found for user:', user.id);
                //     }
                //   });
                // }
                // console.log(teamMap);
                // // // Send notification to admins
                // if (get_user_socket_id && get_user_socket_id.socket_id) {
                //   const allUsers = await this.Model.employeeModel().getTemsEmployeeSocket(
                //     teamMap
                //   );
                //   if (!allUsers || allUsers.length === 0) {
                //     console.error('No connected users found.');
                //   } else {
                //     console.log('All connected users:', allUsers);
                //     allUsers.forEach((user) => {
                //       if (user && user.socket_id && user.name) {
                //         io.to(user.socket_id).emit('notification', {
                //           message: `A New Activity Has Been Added`,
                //           type: 'activity',
                //           data: completeResponse[0],
                //         });
                //         console.log('Notification emitted to socket ID:', user.socket_id);
                //       } else {
                //         console.error('Socket ID not found for user:', user.id);
                //       }
                //     });
                //   }
                // } else {
                //   console.error('Failed to emit notification, socket ID is invalid.');
                // }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    // create other activity
    createOtherActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id: emp_id } = req.employee;
            const { call_note, visit_date, visit_note, type } = req.body;
            const leadModel = this.Model.crmLeadModel();
            const empLeadmodel = this.Model.crmEmployeeLead();
            if (type == 'call') {
                // insert in after sale
                yield leadModel.insertOtherActivities({
                    organization_id,
                    call_note,
                    phone_call: 1,
                    emp_id,
                });
                // insert history contact lead
                yield leadModel.addLeadToHistoryContact({
                    phone_call: 1,
                    assign_lead: emp_id,
                    call_note,
                });
            }
            else if (type == 'visit') {
                // insert in after sale
                yield leadModel.insertOtherActivities({
                    organization_id,
                    visit_note,
                    visit_date,
                    visit: 1,
                    emp_id,
                });
                // insert lead visit history
                yield empLeadmodel.EngageLeadVisit({
                    visit_note,
                    assign_lead: emp_id,
                    visit_status: 1,
                    visit_date,
                });
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get all other activity
    getAllOtherActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id: emp_id } = req.employee;
            const { limit, skip, from_date, to_date } = req.query;
            const leadModel = this.Model.crmLeadModel();
            const { data, total } = yield leadModel.getAllOtherActivities({
                emp_id,
                organization_id,
                limit: parseInt(limit),
                skip: parseInt(skip),
                from_date: from_date,
                to_date: to_date,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    //update Activity By TeamLeader
    updateActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const work_log_id = parseInt(req.params.id);
                req.body['verified_at'] = new Date();
                req.body['verified_by'] = id;
                const model = this.Model.userModel();
                yield model.updateWorkLog(work_log_id, req.body);
                const getSingleActivity = yield model.getOnlySingleActivity(work_log_id);
                const userEmployee = yield this.Model.employeeModel().getSingleInfoEmployee(getSingleActivity[0].employee_id);
                //==============================================
                //                Notification Section
                //==============================================
                const notify = yield this.Model.commonModel().createNotification({
                    type: 'activity',
                    message: req.body['team_leader_verification'] === true
                        ? 'Your Activity Has Been Approved'
                        : 'Your Activity Has Been Rejected',
                });
                yield this.Model.commonModel().addEmployeeNotification({
                    notification_id: notify[0].id,
                    user_id: getSingleActivity[0].employee_id,
                });
                if (userEmployee && userEmployee.socket_id) {
                    socket_1.io.to(userEmployee.socket_id).emit('notification', {
                        message: notify[0].message,
                        data: getSingleActivity[0],
                        type: 'activity',
                    });
                    console.log('Notification emitted to socket ID:', userEmployee.socket_id, getSingleActivity[0]);
                }
                else {
                    console.error('Failed to emit notification, socket ID is invalid.');
                }
                //==============================================
                //            End of Notification Section
                //==============================================
                // //==============================================
                // //                Notification Section
                // //==============================================
                // const notify = await this.Model.commonModel().createNotification({
                //   type: 'activity',
                //   ref_id: req.body['discussion_id'],
                //   message: `Your Activity Status Has Been Updated`,
                // });
                // await this.Model.commonModel().addEmployeeNotification({
                //   notification_id: notify[0].id,
                //   user_id: getSingleActivity[0].employee_id,
                // });
                // const employee = await this.Model.employeeModel().getSingleEmployee(
                //   getSingleActivity[0].employee_id
                // );
                // if (employee && employee[0].socket_id) {
                //   io.to(employee[0].socket_id).emit('notification', {
                //     message: notify[0].message,
                //     type: 'discussion',
                //     ref_id: req.body['discussion_id'],
                //   });
                //   console.log(
                //     'Notification emitted to socket ID:',
                //     employee[0].socket_id
                //   );
                // } else {
                //   console.error('Failed to emit notification, socket ID is invalid.');
                // }
                // //==============================================
                // //            End of Notification Section
                // //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    getPrayerTimes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.employee;
            console.log('armaan is a good boy!');
            const prayerTimes = yield this.Model.memberActivityModel().getPrayerTimes(organization_id);
            //==============================================
            //                Notification Section
            //==============================================
            // const notify = await this.Model.commonModel().createNotification({
            //   type: 'activity',
            //   message:
            //     req.body['team_leader_verification'] === true
            //       ? 'Your Activity Has Been Approved'
            //       : 'Your Activity Has Been Rejected',
            // });
            // await this.Model.commonModel().addEmployeeNotification({
            //   notification_id: notify[0].id,
            //   user_id: getSingleActivity[0].employee_id,
            // });
            // if (userEmployee && userEmployee.socket_id) {
            //   io.to(userEmployee.socket_id).emit('notification', {
            //     message: notify[0].message,
            //     data: getSingleActivity[0],
            //     type: 'activity',
            //   });
            //   console.log(
            //     'Notification emitted to socket ID:',
            //     userEmployee.socket_id,
            //     getSingleActivity[0]
            //   );
            // } else {
            //   console.error('Failed to emit notification, socket ID is invalid.');
            // }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: prayerTimes.prayer_times,
            };
        });
    }
    //update Activity By TeamLeader
    updateActivityByEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const work_log_id = parseInt(req.params.id);
                const activity_description = req.body['activity_description'];
                const model = this.Model.userModel();
                const updateActivity = yield model.updateWorkLogEmployee(work_log_id, activity_description);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    getActivities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //const user_id = req.employee.id;
                const { id } = req.employee;
                const model = this.Model.memberActivityModel();
                const myTeams = yield this.Model.adminLeaveModel().getMyTeams(id);
                const checkTeams = myTeams.map((item) => item.team_id);
                const team_id = parseInt(req.params.id);
                const checkTeamVerifier = yield model.checkTeamVerifier(team_id, id);
                let verifier = false;
                if (checkTeamVerifier.length) {
                    verifier = true;
                }
                //get team id
                const employee_id = req.employee.id;
                if (!checkTeams.includes(team_id)) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: [],
                    };
                }
                else {
                    //params for filtering
                    const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = req.query;
                    const exsistTeam = yield model.checkIfTeamHaveAnyActivity(team_id);
                    // if (!exsistTeam.length) {
                    //   const teaminfo = await model.getTeamTotalInfo(team_id);
                    //   const teamMembers = await model.getTeamMembers(team_id);
                    //   return {
                    //     success: true,
                    //     code: this.StatusCode.HTTP_SUCCESSFUL,
                    //     message: this.ResMsg.HTTP_SUCCESSFUL,
                    //     data: [],
                    //     total: 0,
                    //     team_name: teaminfo[0].team_name,
                    //     team_leader: teaminfo[0].name,
                    //     team_leader_designation: teaminfo[0].designation,
                    //     team_members: teamMembers,
                    //   };
                    // }
                    // const team_id = await model.getTeam(employee_id);
                    const { data, total } = yield model.getActivitiesTeamWise(team_id, {
                        from_date: from_date,
                        to_date: to_date,
                        employee: employee,
                        team_leader_verification: team_leader_verification,
                        remarks: remarks,
                        email: email,
                        limit: limit,
                        skip: skip,
                    });
                    // Loop through the data and add team_leader_verification based on employee_id and team_leader_id
                    const processedData = data.map((item) => {
                        return Object.assign(Object.assign({}, item), { team_leader: employee_id === item.team_leader_id });
                    });
                    const teaminfo = yield model.getTeamTotalInfo(team_id);
                    const teamMembers = yield model.getTeamMembers(team_id);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: processedData,
                        total: total,
                        team_name: teaminfo[0].team_name,
                        team_leader: teaminfo[0].name,
                        team_leader_designation: teaminfo[0].designation,
                        team_members: teamMembers,
                        verifier: verifier,
                    };
                }
            }));
        });
    }
    getMyActivityList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            const model = this.Model.memberActivityModel();
            const team_id = parseInt(req.params.id);
            const checkTeamVerifier = yield model.checkTeamVerifier(team_id, id);
            let verifier = false;
            if (checkTeamVerifier.length) {
                verifier = true;
            }
            //get team id
            const employee_id = req.employee.id;
            //params for filtering
            const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = req.query;
            const { data, total } = yield model.getMyActivitiesTeamWise(team_id, employee_id, {
                from_date: from_date,
                to_date: to_date,
                employee: employee,
                team_leader_verification: team_leader_verification,
                remarks: remarks,
                email: email,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: data,
                total: total,
                verifier: verifier,
            };
        });
    }
    // public async getMyActivity(req: Request) {
    //   const { id, shift_start, shift_end } = req.employee;
    //   const team_id = parseInt(req.params.id);
    //   const shift = await this.Model.employeeModel().getSingleEmployee({ id });
    //   function removeSeconds(time: string): string {
    //     return time.slice(0, 5);
    //   }
    //   function getHourlyIntervals(start: string, end: string): string[] {
    //     const intervals: string[] = [];
    //     let [startHour, startMinute] = start.split(':').map(Number);
    //     const [endHour, endMinute] = end.split(':').map(Number);
    //     while (
    //       startHour < endHour ||
    //       (startHour === endHour && startMinute < endMinute)
    //     ) {
    //       const currentTime = `${String(startHour).padStart(2, '0')}:${String(
    //         startMinute
    //       ).padStart(2, '0')}`;
    //       const nextHour = (startHour + 1) % 24;
    //       const nextTime = `${String(nextHour).padStart(2, '0')}:${String(
    //         startMinute
    //       ).padStart(2, '0')}`;
    //       intervals.push(`${currentTime} - ${nextTime}`);
    //       startHour = nextHour;
    //     }
    //     return intervals;
    //   }
    //   const updatedShiftStart = removeSeconds(shift_start);
    //   const updatedShiftEnd = removeSeconds(shift_end);
    //   const intervals = getHourlyIntervals(updatedShiftStart, updatedShiftEnd);
    //   // Mock data - replace this with actual data retrieval logic
    //   const mockTasks = [
    //     { time: '10:00 - 11:00', task_done: true, task: 'done with ts' },
    //     { time: '11:00 - 12:00', task_done: false, task: 'done with js' },
    //     { time: '12:00 - 13:00', task_done: false, task: 'done with postgres' },
    //   ];
    //   // Create the restructured data
    //   const data = intervals.reduce((acc, interval) => {
    //     const task = mockTasks.find((t) => t.time === interval) || {
    //       task_done: false,
    //       task: '',
    //     };
    //     acc[interval] = { task_done: task.task_done, task: task.task };
    //     return acc;
    //   }, {} as Record<string, { task_done: boolean; task: string }>);
    //   // Your existing code for pagination and data retrieval can go here
    //   return {
    //     success: true,
    //     code: this.StatusCode.HTTP_SUCCESSFUL,
    //     message: this.ResMsg.HTTP_SUCCESSFUL,
    //     data: data,
    //     // total: total, // Uncomment if you implement pagination
    //   };
    // }
    getMyActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            /* get it from shifts of employee */
            const profile = yield this.Model.employeeModel().getSingleEmployee({ id });
            const shift_start = profile[0].shift_start;
            const shift_end = profile[0].shift_end;
            /*get updated shift*/
            const model = this.Model.memberActivityModel();
            const myTeams = yield this.Model.adminLeaveModel().getMyTeams(id);
            const checkTeams = myTeams.map((item) => item.team_id);
            const team_id = parseInt(req.params.id);
            if (!checkTeams.includes(team_id)) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                    team_id: null,
                    data: [],
                };
            }
            else {
                // const current_date = ;
                function removeSeconds(time) {
                    return time.slice(0, 5);
                }
                function getHourlyIntervals(start, end) {
                    const intervals = [];
                    let [startHour, startMinute] = start.split(':').map(Number);
                    const [endHour, endMinute] = end.split(':').map(Number);
                    while (startHour < endHour ||
                        (startHour === endHour && startMinute < endMinute)) {
                        const currentTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
                        const nextHour = (startHour + 1) % 24;
                        const nextTime = `${String(nextHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
                        intervals.push(`${currentTime} - ${nextTime}`);
                        startHour = nextHour;
                    }
                    return intervals;
                }
                const updatedShiftStart = removeSeconds(shift_start);
                const updatedShiftEnd = removeSeconds(shift_end);
                function getCurrentDateFormat() {
                    const currentDate = new Date();
                    const year = currentDate.getFullYear();
                    const month = currentDate.getMonth() + 1; // getMonth() returns 0-based index
                    const day = currentDate.getDate();
                    // Ensure month and day are two digits (pad with '0' if necessary)
                    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
                    const formattedDay = day < 10 ? `0${day}` : `${day}`;
                    // Return the formatted date string
                    return `${year}-${formattedMonth}-${formattedDay}`;
                }
                // Example usage
                const current_dateFormat = getCurrentDateFormat();
                // removeSeconds;
                // date: string,
                // ranges: string[],
                // employee_id: number,
                // team_id: number
                const intervals = getHourlyIntervals(updatedShiftStart, updatedShiftEnd);
                const meow = yield this.Model.memberActivityModel().getSingleMyCurrentActivity(current_dateFormat, intervals, id, team_id);
                // // Mock data - replace this with actual data retrieval logic
                // const mockTasks = [
                //   { time: '10:00 - 11:00', task_done: true, task: 'done with ts' },
                //   { time: '11:00 - 12:00', task_done: false, task: 'done with js' },
                //   { time: '12:00 - 13:00', task_done: false, task: 'done with postgres' },
                // ];
                // // Create the restructured data
                // const data = intervals.reduce((acc, interval) => {
                //   const task = mockTasks.find((t) => t.time === interval) || {
                //     task_done: false,
                //     task: '',
                //   };
                //   acc[interval] = { task_done: task.task_done, task: task.task };
                //   return acc;
                // }, {} as Record<string, { task_done: boolean; task: string }>);
                // Your existing code for pagination and data retrieval can go here
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: meow,
                    team_id: team_id,
                    // total: total, // Uncomment if you implement pagination
                };
            }
        });
    }
}
exports.default = MemberActivityService;
