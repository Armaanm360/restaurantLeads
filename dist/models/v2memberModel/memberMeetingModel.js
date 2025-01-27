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
class memberMeetingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    insertMeeting(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting")
                .withSchema(this.MEETING)
                .insert(payload)
                .returning("*");
            return userMember;
        });
    }
    getPersonalMeeting(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_person")
                .withSchema(this.MEETING)
                .where({ person_id: user_id })
                .select("*");
            return userMember;
        });
    }
    //upcoming attend meeting
    getMyCreateMeeting(id, organization_id, { start_date, end_date, status, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db("meeting")
                .withSchema(this.MEETING)
                .where("created_by", id)
                .andWhere("organization_id", organization_id)
                .andWhere({ status })
                .select("id", "title", "meeting_type", "status", "start_time", "end_time");
            if (start_date) {
                query.andWhere("start_time", ">=", start_date);
            }
            if (end_date) {
                query.andWhere("end_time", "<=", end_date);
            }
            const meeting = yield query;
            return meeting;
        });
    }
    getAttendedMeeting(id, organization_id, { start_date, end_date, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db("meeting_person as mp")
                .withSchema(this.MEETING)
                .leftJoin("meeting as m", "m.id", "=", "mp.meeting_id")
                .where("mp.person_id", id)
                .andWhere("m.organization_id", organization_id)
                // .andWhereNot('m.created_by', id)
                .select("m.id", "m.title", "m.meeting_type", "m.status", "m.start_time", "m.end_time");
            if (start_date) {
                query.andWhere("start_time", ">=", start_date);
            }
            if (end_date) {
                query.andWhere("end_time", "<=", end_date);
            }
            const attended = yield query;
            return attended;
        });
    }
    //ended
    getMeeting(employee_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meeting_status, meeting_type, meeting_start_time, meeting_end_time, limit, skip, } = req.query;
            const userMember = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_created_by: employee_id })
                .andWhere(function () {
                if (meeting_status) {
                    this.andWhere("meeting_status", "ilike", `%${meeting_status}%`);
                }
                if (meeting_type) {
                    this.andWhere("meeting_type", "ilike", `%${meeting_type}%`);
                }
                // Filter meetings based on start time
                if (meeting_start_time) {
                    this.andWhere("meeting_start_time", ">=", meeting_start_time);
                }
                if (meeting_end_time) {
                    this.andWhere("meeting_end_time", "<=", meeting_end_time);
                }
            })
                .select("*");
            return userMember;
        });
    }
    //employee id wise teams
    getMyTeams(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams_employee")
                .withSchema(this.EVO)
                .where("emp_id", employee_id)
                .select("team_id");
            return userMember;
        });
    }
    //checking meeting person
    checkMeetingPerson(meeting_id, person_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_person")
                .withSchema(this.MEETING)
                .where({ meeting_id: meeting_id })
                .andWhere({ person_id: person_id })
                .select("*");
            return userMember;
        });
    }
    getAllColluges(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("employee_team_view")
                .withSchema(this.EVO)
                .whereIn("team_id", team_id)
                .select("name as employee_name", "designation", "photo", "emp_id as person_id")
                .groupBy("name", "designation", "photo", "emp_id");
            return userMember;
        });
    }
    meetingTrackHistory(meeting_id, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_tracking")
                .withSchema(this.MEETING)
                .insert({ meeting_id: meeting_id, message: message });
            return userMember;
        });
    }
    addPerson(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_person")
                .withSchema(this.MEETING)
                .insert(payload);
            return userMember;
        });
    }
    removeMeetingPerson(meeting_id, person_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_person")
                .withSchema(this.MEETING)
                .where({ meeting_id: meeting_id })
                .andWhere({ person_id: person_id })
                .delete();
            return userMember;
        });
    }
    getMeetingDashboard(association_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meeting_status, meeting_type, meeting_start_time, meeting_end_time, limit, skip, } = req.query;
            const userMember = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_association_id: association_id })
                .select("meeting_title as title", "meeting_start_time as date", "meeting_id as meetingId");
            return userMember;
        });
    }
    getMyMeetingDashboard(meetings, user_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meeting_status, meeting_type, limit, skip } = req.query;
            const calenderMeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .whereIn("meeting_id", meetings)
                .orWhere("meeting_created_by", user_id)
                .select("meeting_title as title", "meeting_date as date", "meeting_type as meeting_type", "meeting_id as meetingId");
            const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
            const todaymeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_created_by: user_id })
                .andWhere("meeting_status", "upcoming")
                .andWhereRaw(`DATE(meeting_date) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const myoutsidemeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_created_by: user_id })
                .andWhere("meeting_type", "Offline")
                .andWhereRaw(`DATE(meeting_start_time) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const myindoormeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_created_by: user_id })
                .andWhere("meeting_type", "Online")
                .andWhereRaw(`DATE(meeting_start_time) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const upcomingmeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ meeting_created_by: user_id })
                .andWhere("meeting_status", "upcoming")
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_id as meeting_id");
            return {
                calenderMeeting,
                todaymeeting,
                upcomingmeeting,
                myindoormeeting,
                myoutsidemeeting,
            };
        });
    }
    singleEmployeeMeetingCreate(meeting_id, person_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_person")
                .withSchema(this.MEETING)
                .insert({ meeting_id: meeting_id, person_id: person_id });
            return userMember;
        });
    }
    getAllMyMeeting(meetings, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .whereIn("meeting_id", meetings)
                .orWhere("meeting_created_by", user_id)
                .select("*")
                .orderBy("meeting_id", "DESC");
            return userMember;
        });
    }
    checkMeetingCreator(meeting_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting")
                .withSchema(this.MEETING)
                .where("id", meeting_id)
                .select("*");
            return userMember;
        });
    }
    //allteams with team leader
    //employee id wise teams
    getAllTeamsAndLeaders() {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("teams")
                .withSchema(this.EVO)
                .select("team_id", "team_leader_id");
            return userMember;
        });
    }
    //meeting duplicacy
    checkMeetingTimeDuplicacy(person_id, start_time, end_time) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract time components from start_time and end_time
            const startTimeComponents = start_time.split(" ")[1].split(":");
            const endTimeComponents = end_time.split(" ")[1].split(":");
            // Convert time components to integers for comparison
            const startHour = parseInt(startTimeComponents[0]);
            const startMinute = parseInt(startTimeComponents[1]);
            const endHour = parseInt(endTimeComponents[0]);
            const endMinute = parseInt(endTimeComponents[1]);
            // Query for meetings overlapping with the specified time frame
            const meetingTimeDuplicacy = yield this.db("meeting")
                .withSchema(this.MEETING)
                .where({ created_by: person_id })
                .andWhere(function () {
                this.where(function () {
                    this.whereRaw(`CAST(EXTRACT(HOUR FROM end_time) AS INTEGER) > ${startHour}`).orWhere(function () {
                        this.whereRaw(`CAST(EXTRACT(HOUR FROM end_time) AS INTEGER) = ${startHour}`).andWhereRaw(`CAST(EXTRACT(MINUTE FROM end_time) AS INTEGER) > ${startMinute}`);
                    });
                }).andWhere(function () {
                    this.whereRaw(`CAST(EXTRACT(HOUR FROM start_time) AS INTEGER) < ${endHour}`).orWhere(function () {
                        this.whereRaw(`CAST(EXTRACT(HOUR FROM start_time) AS INTEGER) = ${endHour}`).andWhereRaw(`CAST(EXTRACT(MINUTE FROM start_time) AS INTEGER) < ${endMinute}`);
                    });
                });
            });
            return meetingTimeDuplicacy;
        });
    }
    getSingleMeeting(meeting_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .andWhere({ meeting_id: meeting_id })
                .select("*");
            return userMember;
        });
    }
    getMeetingTracking(meeting_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_tracking")
                .withSchema(this.MEETING)
                .where({ meeting_id: meeting_id })
                .select("*")
                .orderBy("created_at", "desc");
            return userMember;
        });
    }
}
exports.default = memberMeetingModel;
