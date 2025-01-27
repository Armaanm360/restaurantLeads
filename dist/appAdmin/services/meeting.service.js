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
class AdminMeetingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create meeting
    createMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const body = req.body;
                const meeting_date = new Date(body['meeting_date'])
                    .toISOString()
                    .split('T')[0];
                // const {req.body['lead_id'],..rest} = req.body;
                //body['created_by'] = req.employee.id;
                body['created_by_type'] = 'admin';
                body['created_by_admin_id'] = id;
                body['organization_id'] = organization_id;
                body['meeting_date'] = meeting_date;
                //const meeting_date = req.body['meeting_date'];
                const start_time = req.body['start_time'];
                const date = meeting_date;
                const place = req.body['place'];
                const end_time = req.body['end_time']; // Fixed typo: changed 'start_time' to 'end_time'
                req.body['status'] = 'upcoming';
                console.log(start_time, end_time);
                //check meeting length
                const model = this.Model.adminMeetingModel();
                const checkMeetingDuration = yield model.checkMeetingDuration(start_time, end_time);
                // console.log(checkMeetingDuration);
                // return;
                if (req.body['meeting_type'] === 'offline') {
                    if (req.body['place'] === null) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Hey! Please Add A Place',
                        };
                    }
                    const checkDuplicacyMeeting = yield model.checkMeetingTimeWithPlaceDuplicacy(organization_id, date, start_time, end_time, Number(place));
                    // If there are overlapping meetings, return an error
                    if (checkDuplicacyMeeting.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: 'There is a conflicting meeting at this time.',
                        };
                    }
                }
                if (req.body['meeting_type'] === 'online') {
                    if (req.body['meeting_link'] == null) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Meeting Link Is Required',
                        };
                    }
                }
                // if (checkMeetingDuration < 1) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Hey! Meeting Duration Can not be less than 1 minute!',
                //   };
                // }
                //meeting length cannot be less then 1 miniutes
                // If no duplicacy, proceed to insert the meeting
                const files = req.files || [];
                files.forEach((file) => {
                    body[file.fieldname] = file.filename;
                });
                // const { lead_id, ...rest } = req.body;
                //lead_meeting_track
                const data = yield model.insertMeeting(body);
                //get single meeting info
                const getMeetingInfo = yield this.Model.adminMeetingModel().getSingleMeeting(data[0].id);
                const user = yield this.Model.UserAdminModel().getSingleAdmin({ id });
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'create',
                    tracking_type: 'meeting',
                    description: `${user[0].name} has scheduled a new meeting:

Meeting Title: "${getMeetingInfo[0].meeting_title}"
Meeting Type: ${getMeetingInfo[0].meeting_type}

${getMeetingInfo[0].meeting_type === 'offline'
                        ? `
Location:
${getMeetingInfo[0].place_name} (${getMeetingInfo[0].place_type})
`
                        : `
Join Link: ${getMeetingInfo[0].meeting_link}
`}

Date: ${getMeetingInfo[0].meeting_date}
Start Time: ${getMeetingInfo[0].meeting_start_time}
End Time: ${getMeetingInfo[0].meeting_end_time}
`,
                    lead_id: req.body['lead_id'],
                    meeting_id: data[0].id,
                    org_id: organization_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meeting Created Successfully',
                    data: req.body,
                };
            }));
        });
    }
    createMeetingPlace(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const body = req.body;
                const model = this.Model.adminMeetingModel();
                //body['created_by'] = req.employee.id;
                req.body['organization_id'] = organization_id;
                const data = yield model.insertMeetingPlaces(req.body);
                const auditTrailData = {
                    module_name: 'Meeting Place',
                    action_type: 'Create',
                    organization_id: organization_id,
                    user_id: id,
                    description: 'Meeting Place Created',
                };
                yield this.Model.adminActivityModel().insertAuditTrail(auditTrailData);
                socket_1.io.emit('notification', 'New Place Added');
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meeting Places Created Successfully',
                    data: req.body,
                };
            }));
        });
    }
    updateMeetingPlace(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const body = req.body;
                const place_id = Number(req.params.id);
                const model = this.Model.adminMeetingModel();
                //body['created_by'] = req.employee.id;
                req.body['organization_id'] = organization_id;
                if (req.body['meeting_type'] === 'offline') {
                    if (req.body['place'] === null) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Hey! Please Add A Place',
                        };
                    }
                    const checkDuplicacyMeeting = yield model.checkMeetingTimeWithPlaceDuplicacy(organization_id, req.body.meeting_date, req.body.start_time, req.body.end_time, Number(req.body.place_id));
                    // If there are overlapping meetings, return an error
                    if (checkDuplicacyMeeting.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: 'There is a conflicting meeting at this time.',
                        };
                    }
                }
                if (req.body['meeting_type'] === 'online') {
                    if (req.body['meeting_link'] == null) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Meeting Link Is Required',
                        };
                    }
                }
                const data = yield model.updateMeetingPlaces(place_id, req.body);
                const auditTrailData = {
                    module_name: 'Meeting Place',
                    action_type: 'update',
                    organization_id: organization_id,
                    user_id: id,
                    description: 'Meeting Place Has Been Updated',
                };
                yield this.Model.adminActivityModel().insertAuditTrail(auditTrailData);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meeting Places Updated Successfully',
                    data: req.body,
                };
            }));
        });
    }
    //create meeting
    updateMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const admin = req.admin.id;
                const organization_id = req.admin.organization_id;
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                //body['created_by'] = req.employee.id;
                body['created_by_type'] = 'admin';
                body['created_by_admin_id'] = admin;
                const model = this.Model.adminMeetingModel();
                const files = req.files || [];
                files.forEach((file) => {
                    body[file.fieldname] = file.filename;
                });
                const data = yield model.updateMeeting(meeting_id, body);
                const user = yield this.Model.UserAdminModel().getSingleAdmin({ id });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'create',
                    tracking_type: 'meeting',
                    description: `${user[0].name} has Updated meeting:

Meeting Title: ${getLeadId[0].meeting_title}
Meeting Type: ${getLeadId[0].meeting_type}

${getLeadId[0].meeting_type === 'offline'
                        ? `
Location:
${getLeadId[0].place_name} (${getLeadId[0].place_type})
`
                        : `
Join Link: ${getLeadId[0].meeting_link}
`}
lead_id: ${getLeadId[0].lead_id},
Date: ${getLeadId[0].meeting_date}
Start Time: ${getLeadId[0].meeting_start_time}
End Time: ${getLeadId[0].meeting_end_time}
End Time: ${getLeadId[0].meeting_end_time}
${getLeadId[0].meeting_end_note
                        ? `Meeting End Note: ${getLeadId[0].meeting_end_note.padEnd(30)}`
                        : ''}
${getLeadId[0].meeting_description
                        ? `Meeting Description: ${getLeadId[0].meeting_description.padEnd(30)}`
                        : ''}
${getLeadId[0].meeting_cancelled_reason
                        ? `Meeting End Note: ${getLeadId[0].meeting_cancelled_reason.padEnd(30)}`
                        : ''}
`,
                    lead_id: req.body['lead_id'],
                    meeting_id: meeting_id,
                    org_id: organization_id,
                });
                const message = `${user[0].name} has updated  meeting`;
                yield model.meetingTrackHistory(meeting_id, message);
                /* node corn */
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meeting Update Successfully',
                    data: body,
                };
            }));
        });
    }
    getMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const { limit, skip, place, meeting_status, meeting_type, from_date, to_date, } = req.query;
                const model = this.Model.adminMeetingModel();
                const { data, total } = yield model.getMeeting(organization_id, {
                    limit: limit,
                    skip: skip,
                    place: place,
                    meeting_status: meeting_status,
                    meeting_type: meeting_type,
                    from_date: from_date,
                    to_date: to_date,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: data,
                    total,
                };
            }));
        });
    }
    getMyMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const employee_id = yield this.Model.UserAdminModel().getSingleAdmin({
                id,
            });
            const { key, limit, skip, meeting_status, meeting_type, meeting_start_time, meeting_end_time, } = req.query;
            const model = this.Model.adminMeetingModel();
            const { data, total } = yield model.getMyMeeting(organization_id, employee_id[0].employee_id, {
                key: key,
                limit: limit,
                skip: skip,
                meeting_status: meeting_status,
                meeting_type: meeting_type,
                meeting_start_time: meeting_start_time,
                meeting_end_time: meeting_end_time,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: data,
                total,
            };
        });
    }
    //get meeting persons
    getMeetingPersons(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const model = this.Model.adminMeetingModel();
                const teaminfo = yield model.getMyTeams(id);
                const team = teaminfo.map((team_id) => team_id.team_id);
                const meetings = yield model.getAllColluges(team);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: meetings,
                };
            }));
        });
    }
    getMeetingPlaces(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.admin;
            const model = this.Model.adminMeetingModel();
            const { places, total } = yield model.getMeetingPlaces(organization_id, req);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: places,
                total,
            };
        });
    }
    //add meeting person
    addMeetingPerson(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const notifyService = new notification_service_1.default();
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                body['person_id'] = req.body.person_id;
                body['meeting_id'] = meeting_id;
                const model = this.Model.adminMeetingModel();
                const meetingInfo = yield model.getSingleMeeting(meeting_id);
                // const start_time = meetingInfo[0].meeting_start_time;
                // const checkSameTimingPersonMeeting =
                //   await model.checkSameTimingPersonMeeting(req.body.person_id);
                // const mymeeting = checkSameTimingPersonMeeting.map(
                //   (time) => new Date(time.start_time)
                // );
                // const expecting_meeting = new Date(start_time);
                // // Check if expecting_meeting is inside mymeeting
                // const isMeetingScheduled = mymeeting.some((meeting) => {
                //   // Assuming the expected meeting time is the same day
                //   return (
                //     meeting.getDate() === expecting_meeting.getDate() &&
                //     meeting.getMonth() === expecting_meeting.getMonth() &&
                //     meeting.getFullYear() === expecting_meeting.getFullYear() &&
                //     meeting.getHours() === expecting_meeting.getHours() &&
                //     meeting.getMinutes() === expecting_meeting.getMinutes() &&
                //     meeting.getSeconds() === expecting_meeting.getSeconds()
                //   );
                // });
                // if (isMeetingScheduled) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'The expecting meeting is not scheduled',
                //   };
                // }
                const checkMeetingPerson = yield model.checkMeetingPerson(meeting_id, req.body.person_id);
                //check meeting person availablility
                yield this.Model.adminMeetingModel().checkMeetingDurationOverlapTwo(req.body.person_id, meetingInfo[0].meeting_date, meetingInfo[0].meeting_start_time, meetingInfo[0].meeting_end_time);
                //person's upcoming meeting
                const getUpcoming = yield this.Model.adminMeetingModel().checkSameTimingPersonMeeting(req.body.person_id);
                const upcomingMeetingArray = getUpcoming.map((item) => item.meeting_id);
                // for
                // console.log(upcomingMeetingArray);
                // return;
                // for (const meeting of upcomingMeetingArray) {
                //   const checkMeetingInfo = await model.getSingleMeeting(meeting);
                //   const checkingMeeting =
                //     await this.Model.adminMeetingModel().checkMeetingDurationOverlapTwo(
                //       req.body.person_id,
                //       checkMeetingInfo[0].meeting_date,
                //       checkMeetingInfo[0].meeting_start_time,
                //       checkMeetingInfo[0].meeting_end_time
                //     );
                //   console.log(checkingMeeting.length);
                //   if (checkingMeeting.length) {
                //     throw new Error(
                //       `এই সময়ে এই ব্যক্তি অন্য  একটি মিটিংতে নিয়োজিত আছেন।`
                //     );
                //     //  This person is currently engaged in a meeting at this time.
                //   }
                // }
                const usermodel = this.Model.userModel();
                const personinfo = yield usermodel.getProfile(parseInt(req.body.person_id));
                const message = `${personinfo[0].name} has been added to the meeting`;
                yield model.meetingTrackHistory(meeting_id, message);
                if (checkMeetingPerson.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'This person has already been added to the meeting',
                    };
                }
                const data = yield model.addPerson(body);
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    user_id: Number(req.body.person_id),
                    type: 'meeting',
                    ref_id: meeting_id,
                    message: `${personinfo[0].name} কে একটি মিটিং এ যুক্ত করা হয়েছে  ${meetingInfo[0].meeting_title}`,
                    organization_id: organization_id,
                    title: `${personinfo[0].name} কে একটি মিটিং এ যুক্ত করা হয়েছে  ${meetingInfo[0].meeting_title}`,
                    description: `${personinfo[0].name} কে একটি মিটিং এ যুক্ত করা হয়েছে  ${meetingInfo[0].meeting_title}`,
                };
                yield notifyService.adminToSingleEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                const user = yield this.Model.UserAdminModel().getSingleAdmin({ id });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                // await this.Model.crmLeadModel().insertInLeadTracking({
                //   action_type: 'Meeting-Update',
                //   description: `${personinfo[0].name} Has Been Added To The Meeting By  ${user[0].name}`,
                //   lead_id: getLeadId[0].lead_id,
                //   meeting_id: meeting_id,
                //   org_id: organization_id,
                // });
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'add-person',
                    tracking_type: 'meeting',
                    description: `${user[0].name} has added as meeting person ${personinfo[0].name} To The Meeting  ${getLeadId[0].meeting_title}
`,
                    emp_id: req.body.person_id,
                    lead_id: getLeadId[0].lead_id,
                    meeting_id: meeting_id,
                    org_id: organization_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_ACCEPTED,
                    data: body,
                };
            }));
        });
    }
    singleMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                const model = this.Model.adminMeetingModel();
                const data = yield model.getSingleMeeting(meeting_id);
                const meeting_tracking = yield model.getMeetingTracking(meeting_id);
                // Combine meeting data with meeting tracking information
                const responseData = Object.assign(Object.assign({}, data[0]), { // Assuming getSingleMeeting returns an array with one item
                    meeting_tracking });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: responseData,
                };
            }));
        });
    }
    removeMeetingPerson(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const notifyService = new notification_service_1.default();
                const meeting_id = parseInt(req.params.meeting_id);
                const person_id = parseInt(req.params.person_id);
                const model = this.Model.adminMeetingModel();
                const usermodel = this.Model.userModel();
                const personinfo = yield usermodel.getProfile(person_id);
                const message = `${personinfo[0].name} has been removed from the meeting`;
                yield model.meetingTrackHistory(meeting_id, message);
                const data = yield model.removeMeetingPerson(meeting_id, person_id);
                const user = yield this.Model.UserAdminModel().getSingleAdmin({
                    id,
                });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'remove-person',
                    tracking_type: 'meeting',
                    description: `${user[0].name} has Removed ${personinfo[0].name} From The Meeting  ${getLeadId[0].meeting_title}, 
 
`,
                    emp_id: req.body.person_id,
                    lead_id: getLeadId[0].lead_id,
                    meeting_id: meeting_id,
                    org_id: organization_id,
                });
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    user_id: person_id,
                    type: 'meeting',
                    ref_id: meeting_id,
                    message: `You Have Been Removed From The Meeting ${getLeadId[0].meeting_title}`,
                    organization_id: organization_id,
                    title: `You Have Been Removed From The Meeting ${getLeadId[0].meeting_title}`,
                    description: `You Have Been Removed From The Meeting ${getLeadId[0].meeting_title}`,
                };
                yield notifyService.adminToSingleEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_ACCEPTED,
                    message: 'Person has been removed from the meeting',
                    data: data,
                };
            }));
        });
    }
    getMeetingDashboard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const model = this.Model.adminMeetingModel();
                const { allmeetings, upcomingmeetings, todaymeeting, outsidemeeting, indoormeeting, } = yield model.getAdminDashboard(organization_id, req);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    calenderMeeting: allmeetings,
                    upcomingmeeting: upcomingmeetings,
                    todayMeeting: todaymeeting,
                    outsidemeeting: outsidemeeting,
                    indoormeeting: indoormeeting,
                };
            }));
        });
    }
}
exports.default = AdminMeetingService;
