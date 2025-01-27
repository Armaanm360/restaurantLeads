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
class MemberMeetingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create meeting
    createMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const body = req.body;
                const meeting_date = new Date(body['meeting_date'])
                    .toISOString()
                    .split('T')[0];
                const date = meeting_date;
                body['created_by'] = id;
                req.body['organization_id'] = organization_id;
                req.body['status'] = 'upcoming';
                const model = this.Model.memberMeetingModel();
                // Fetch teams the employee belongs to
                const myTeams = yield model.getMyTeams(id);
                // Fetch teams and their leaders
                const teams = yield model.getAllTeamsAndLeaders();
                // Iterate through the employee's teams
                myTeams.forEach((team) => {
                    // Find the corresponding team in the teams array
                    const matchingTeam = teams.find((t) => t.team_id === team.team_id);
                    // If a matching team is found and the employee is the team leader
                    if (matchingTeam && matchingTeam.team_leader_id === id) {
                        team.team_leader = true; // Set team_leader to true
                    }
                    else {
                        team.team_leader = false; // Set team_leader to false
                    }
                });
                // Extract team_ids where team_leader is true
                const leadedTeamIds = myTeams
                    .filter((team) => team.team_leader)
                    .map((team) => team.team_id);
                if (leadedTeamIds.length < 1) {
                    const start_time = req.body['start_time'];
                    const place = req.body['place'];
                    const end_time = req.body['end_time']; // Fixed typo: changed 'start_time' to 'end_time'
                    req.body['organization_id'] = organization_id;
                    req.body['status'] = 'upcoming';
                    const model = this.Model.adminMeetingModel();
                    const checkMeetingDuration = yield model.checkMeetingDuration(start_time, end_time);
                    if (req.body['meeting_type'] === 'offline') {
                        if (req.body['place'] === null) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_BAD_REQUEST,
                                message: 'Hey! Please Add A Place',
                            };
                        }
                        const checkDuplicacyMeeting = yield model.checkMeetingTimeWithPlaceDuplicacy(organization_id, date, start_time, end_time, place);
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
                    if (checkMeetingDuration < 1) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Hey! Meeting Duration Can not be less than 1 minute!',
                        };
                    }
                    //meeting length cannot be less then 1 miniutes
                    // If no duplicacy, proceed to insert the meeting
                    const files = req.files || [];
                    files.forEach((file) => {
                        body[file.fieldname] = file.filename;
                    });
                    const meeting = yield model.insertMeeting(body);
                    const meeting_id = meeting[0].id;
                    const checkMeetingPerson = yield model.checkMeetingPerson(meeting_id, req.employee.id);
                    const user = yield this.Model.employeeModel().getSingleEmployee({ id });
                    const getMeetingInfo = yield this.Model.adminMeetingModel().getSingleMeeting(meeting[0].id);
                    yield this.Model.crmLeadModel().insertInLeadTracking({
                        action_type: 'create',
                        tracking_type: 'meeting',
                        description: `${req.employee.name} has scheduled a new meeting:

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
                        meeting_id: meeting[0].id,
                        emp_id: id,
                        org_id: organization_id,
                    });
                    const message = `${req.employee.name} has been added to the meeting`;
                    yield model.meetingTrackHistory(meeting_id, message);
                    if (checkMeetingPerson.length) {
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'This person has already been added to the meeting',
                        };
                    }
                    const data = yield model.singleEmployeeMeetingCreate(meeting_id, req.employee.id);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Meeting Created Successfully',
                    };
                }
                else {
                    const start_time = req.body['start_time'];
                    const place = req.body['place'];
                    const end_time = req.body['end_time']; // Fixed typo: changed 'start_time' to 'end_time'
                    req.body['status'] = 'upcoming';
                    const model = this.Model.adminMeetingModel();
                    const checkMeetingDuration = yield model.checkMeetingDuration(start_time, end_time);
                    if (req.body['meeting_type'] === 'offline') {
                        if (req.body['place'] === null) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_BAD_REQUEST,
                                message: 'Hey! Please Add A Place',
                            };
                        }
                        const checkDuplicacyMeeting = yield model.checkMeetingTimeWithPlaceDuplicacy(organization_id, date, start_time, end_time, place);
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
                    if (checkMeetingDuration < 1) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Hey! Meeting Duration Can not be less than 1 minute!',
                        };
                    }
                    //meeting length cannot be less then 1 miniutes
                    // If no duplicacy, proceed to insert the meeting
                    const files = req.files || [];
                    req.body['organization_id'] = organization_id;
                    files.forEach((file) => {
                        body[file.fieldname] = file.filename;
                    });
                    const data = yield model.insertMeeting(body);
                    const user = yield this.Model.employeeModel().getSingleEmployee({ id });
                    //added insert lead meeting tracking
                    yield this.Model.crmLeadModel().insertInLeadTracking({
                        action_type: 'create',
                        tracking_type: 'meeting',
                        description: `New Meeting created by ${user[0].name}`,
                        lead_id: req.body['lead_id'],
                        emp_id: id,
                        org_id: organization_id,
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Meeting Created Successfully',
                    };
                }
            }));
        });
    }
    updateMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                //body['created_by'] = req.employee.id;
                const model = this.Model.adminMeetingModel();
                if (req.body['meeting_type'] === 'offline') {
                    if (req.body['place'] === null) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Hey! Please Add A Place',
                        };
                    }
                    // const checkDuplicacyMeeting =
                    //   await model.checkMeetingTimeWithPlaceDuplicacy(
                    //     organization_id,
                    //     req.body.meeting_date,
                    //     req.body.start_time,
                    //     req.body.end_time,
                    //     Number(req.body.place)
                    //   );
                    // // If there are overlapping meetings, return an error
                    // if (checkDuplicacyMeeting.length) {
                    //   return {
                    //     success: false,
                    //     code: this.StatusCode.HTTP_CONFLICT,
                    //     message: 'There is a conflicting meeting at this time.',
                    //   };
                    // }
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
                const files = req.files || [];
                files.forEach((file) => {
                    body[file.fieldname] = file.filename;
                });
                const data = yield model.updateMeeting(meeting_id, body);
                const user = yield this.Model.employeeModel().getSingleEmployee({ id });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'create',
                    tracking_type: 'meeting',
                    description: `${req.employee.name} has Updated meeting:

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
                    emp_id: id,
                    org_id: organization_id,
                });
                const message = `${user[0].name} has updated  meeting`;
                yield model.meetingTrackHistory(meeting_id, message);
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
            const { id, organization_id } = req.employee;
            const model = this.Model.adminMeetingModel();
            const createdMeetings = yield model.getMyCreateMeeting(id, organization_id);
            const attendedMeetings = yield model.getAttendedMeeting(id, organization_id);
            // Merge the two arrays
            // Create a Set to store unique meetings based on their IDs
            const uniqueMeetingsSet = new Set();
            // Iterate over createdMeetings and add unique meetings to the Set
            createdMeetings.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
            // Iterate over attendedMeetings data and add unique meetings to the Set
            attendedMeetings.data.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
            // Convert the Set back to an array to get merged unique meetings
            const allMeetings = Array.from(uniqueMeetingsSet).map((id) => {
                // Find the meeting object corresponding to the ID
                const meeting = createdMeetings.find((meeting) => meeting.id === id) ||
                    attendedMeetings.data.find((meeting) => meeting.id === id);
                return meeting;
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: allMeetings,
                total: allMeetings.length,
            };
        });
    }
    //get meeting persons
    createMeetingPlace(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
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
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meeting Places Created Successfully',
                    data: req.body,
                };
            }));
        });
    }
    getMeetingPlaces(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.employee;
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
    getMeetingPersons(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                const model = this.Model.memberMeetingModel();
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
    //add meeting person
    addMeetingPerson(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const notifyService = new notification_service_1.default();
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                body['person_id'] = req.body.person_id;
                body['meeting_id'] = meeting_id;
                const model = this.Model.memberMeetingModel();
                const checkMeetingPerson = yield model.checkMeetingPerson(meeting_id, req.body.person_id);
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
                        success: true,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'This person has already been added to the meeting',
                    };
                }
                const data = yield model.addPerson(body);
                const user = yield this.Model.employeeModel().getSingleEmployee({
                    id,
                });
                const otherWiseUser = yield this.Model.employeeModel().getSingleEmployee({
                    id,
                });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'add-person',
                    tracking_type: 'meeting',
                    description: `${req.employee.name} has added as meeting person ${personinfo[0].name} To The Meeting  ${getLeadId[0].meeting_title}
`,
                    lead_id: getLeadId[0].lead_id,
                    meeting_id: meeting_id,
                    emp_id: req.body.person_id,
                    org_id: organization_id,
                });
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    user_id: req.body.person_id,
                    type: 'meeting',
                    ref_id: meeting_id,
                    message: `আপনাকে একটি মিটিং এ যুক্ত করা হয়েছে  ${getLeadId[0].meeting_title}`,
                    organization_id: organization_id,
                    title: `আপনাকে একটি মিটিং এ যুক্ত করা হয়েছে  ${getLeadId[0].meeting_title}`,
                };
                yield notifyService.adminToSingleEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
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
                const { id } = req.employee;
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                const model = this.Model.memberMeetingModel();
                const meetingCreator = yield model.checkMeetingCreator(meeting_id);
                let editable = false; // Default value
                if (meetingCreator[0].created_by === id) {
                    editable = true;
                }
                else {
                    editable = false;
                }
                const data = yield model.getSingleMeeting(meeting_id);
                const meeting_tracking = yield model.getMeetingTracking(meeting_id);
                // Combine meeting data with meeting tracking information
                const responseData = Object.assign(Object.assign({}, data[0]), { // Assuming getSingleMeeting returns an array with one item
                    meeting_tracking });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: responseData,
                    editable: editable,
                };
            }));
        });
    }
    removeMeetingPerson(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const notifyService = new notification_service_1.default();
                const body = req.body;
                const meeting_id = parseInt(req.params.meeting_id);
                const person_id = parseInt(req.params.person_id);
                const model = this.Model.memberMeetingModel();
                const usermodel = this.Model.userModel();
                const personinfo = yield usermodel.getProfile(person_id);
                const message = `${personinfo[0].name} has been removed from the meeting`;
                yield model.meetingTrackHistory(meeting_id, message);
                const data = yield model.removeMeetingPerson(meeting_id, person_id);
                const user = yield this.Model.employeeModel().getSingleEmployee({
                    id,
                });
                const getLeadId = yield this.Model.adminMeetingModel().getSingleMeeting(meeting_id);
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: 'remove-person',
                    tracking_type: 'meeting',
                    description: `${req.employee.name} has Removed ${personinfo[0].name} From The Meeting  ${getLeadId[0].meeting_title}, 
 
`,
                    lead_id: getLeadId[0].lead_id,
                    meeting_id: meeting_id,
                    emp_id: req.body.person_id,
                    org_id: organization_id,
                });
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    user_id: person_id,
                    type: 'meeting',
                    ref_id: meeting_id,
                    message: `You Have Been Removed From  ${getLeadId[0].meeting_title}`,
                    organization_id: organization_id,
                    title: `You Have Been Removed From  ${getLeadId[0].meeting_title}`,
                };
                yield notifyService.adminToSingleEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_ACCEPTED,
                    data: data,
                };
            }));
        });
    }
    getMeetingDashboard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const model = this.Model.memberMeetingModel();
                const data = yield model.getPersonalMeeting(id);
                // Set start_date as current time
                const currentDate = new Date();
                const start_date_up = currentDate.toISOString(); // Convert to ISO string
                const { end_date_up } = req.query;
                //upcoming meeting and today meeting
                const createdMeetings = yield model.getMyCreateMeeting(id, organization_id, {
                    start_date: start_date_up,
                    end_date: end_date_up,
                    status: 'upcoming',
                });
                const attended = yield model.getAttendedMeeting(id, organization_id, {
                    start_date: start_date_up,
                    end_date: end_date_up,
                });
                // Merge the two arrays
                // Create a Set to store unique meetings based on their IDs
                const uniqueMeetingsSet = new Set();
                // Iterate over createdMeetings and add unique meetings to the Set
                createdMeetings.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
                // Iterate over data and add unique meetings to the Set
                attended.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
                // Convert the Set back to an array to get merged unique meetings
                const mytodayMeeting = Array.from(uniqueMeetingsSet).map((id) => {
                    // Find the meeting object corresponding to the ID
                    const meeting = createdMeetings.find((meeting) => meeting.id === id) ||
                        attended.find((meeting) => meeting.id === id);
                    return meeting;
                });
                //ended
                //upcoming meeting and today meeting
                const endOfDayToday = new Date(currentDate);
                const start_date_today = currentDate.toISOString(); // Convert to ISO string
                endOfDayToday.setHours(23, 59, 59, 999); // Set to 23:59:59.999 to get end of day
                const end_date_today = endOfDayToday.toISOString(); // Convert to ISO string
                const createdMeetingsToday = yield model.getMyCreateMeeting(id, organization_id, {
                    start_date: start_date_today,
                    end_date: end_date_today,
                    status: 'upcoming',
                });
                const attendedToday = yield model.getAttendedMeeting(id, organization_id, {
                    start_date: start_date_up,
                    end_date: end_date_up,
                });
                // Merge the two arrays
                // Create a Set to store unique meetings based on their IDs
                const uniqueMeetingsSetToday = new Set();
                // Iterate over createdMeetings and add unique meetings to the Set
                createdMeetings.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
                // Iterate over data and add unique meetings to the Set
                attendedToday.forEach((meeting) => uniqueMeetingsSet.add(meeting.id));
                // Convert the Set back to an array to get merged unique meetings
                const mytodayMeetingToday = Array.from(uniqueMeetingsSet).map((id) => {
                    // Find the meeting object corresponding to the ID
                    const meetingToday = createdMeetingsToday.find((meeting) => meeting.id === id) ||
                        attendedToday.find((meeting) => meeting.id === id);
                    return meetingToday;
                });
                //ended
                const mymeetings = data.map((item) => item.meeting_id);
                const { calenderMeeting, todaymeeting, upcomingmeeting, myindoormeeting, myoutsidemeeting, } = yield model.getMyMeetingDashboard(mymeetings, id, req);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    calenderMeeting: calenderMeeting,
                    todaymeeting: todaymeeting,
                    upcomingmeeting: upcomingmeeting,
                    myindoormeeting: myindoormeeting,
                    myoutdoormeeting: myoutsidemeeting,
                    myupcomingmeetings: mytodayMeeting,
                };
            }));
        });
    }
}
exports.default = MemberMeetingService;
