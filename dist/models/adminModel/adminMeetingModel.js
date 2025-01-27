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
class adminMeetingModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
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
    insertMeetingLeadTrack(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("lead_meeting_track")
                .withSchema(this.MEETING)
                .insert(payload);
            return userMember;
        });
    }
    insertMeetingPlaces(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_places")
                .withSchema(this.MEETING)
                .insert(payload);
            return userMember;
        });
    }
    updateMeetingPlaces(place_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_places")
                .withSchema(this.MEETING)
                .where({ place_id })
                .update(payload);
            return userMember;
        });
    }
    updateMeeting(meeting_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield this.db("meeting")
                .withSchema(this.MEETING)
                .where({ id: meeting_id })
                .update(payload)
                .returning("*");
            return meeting;
        });
    }
    // public async getPersonalMeeting(user_id: number) {
    //   const userMember = await this.db('meeting_person')
    //     .withSchema(this.MEETING)
    //     .where({ person_id: user_id })
    //     .select('*');
    //   return userMember;
    // }
    getPersonalMeeting(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, meeting_status, meeting_type, meeting_start_time, meeting_end_time, } = payload;
            const dtbs = this.db("meeting as m");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.MEETING)
                //.leftJoin('meeting as m', 'm.id', '=', 'mp.meeting_id')
                .where("m.created_by", id)
                .select("m.id", "m.title", "m.meeting_type", "m.created_by", "m.status", "m.start_time", "m.end_time")
                // .andWhere(function () {
                //   if (key) {
                //     this.andWhere('m.title', 'like', `%${key}%`).orWhere(
                //       'm.title',
                //       'like',
                //       `%${key}%`
                //     );
                //   }
                // })
                // .andWhere(function () {
                //   if (meeting_status) {
                //     this.andWhere('m.status', meeting_status);
                //   }
                //   if (meeting_type) {
                //     this.andWhere('m.meeting_type', meeting_type);
                //   }
                //   if (meeting_start_time) {
                //     this.andWhere('m.meeting_start_time', '>=', meeting_start_time);
                //   }
                //   if (meeting_end_time) {
                //     this.andWhere('m.meeting_end_time', '<=', meeting_end_time);
                //   }
                // })
                .orderBy("m.id", "desc");
            const total = yield this.db("meeting as m")
                .withSchema(this.MEETING)
                .where("m.created_by", id)
                .count("m.id as total");
            // .leftJoin('meeting as m', 'm.id', '=', 'mp.meeting_id')
            // .where('mp.person_id', id)
            // .andWhere(function () {
            //   if (key) {
            //     this.andWhere('m.title', 'like', `%${key}%`).orWhere(
            //       'm.title',
            //       'like',
            //       `%${key}%`
            //     );
            //   }
            // })
            // .andWhere(function () {
            //   if (meeting_status) {
            //     this.andWhere('m.status', meeting_status);
            //   }
            //   if (meeting_type) {
            //     this.andWhere('m.meeting_type', meeting_type);
            //   }
            //   if (meeting_start_time) {
            //     this.andWhere('m.meeting_start_time', '>=', meeting_start_time);
            //   }
            //   if (meeting_end_time) {
            //     this.andWhere('m.meeting_end_time', '<=', meeting_end_time);
            //   }
            // });
            return { data, total: total[0].total };
        });
    }
    getMyCreateMeeting(id, organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield this.db("meeting")
                .withSchema(this.MEETING)
                .where("created_by", id)
                .andWhere("organization_id", organization_id)
                .select("id", "title", "meeting_type", "status", "start_time", "end_time", "meeting_date")
                .orderBy("id", "desc");
            return meeting;
        });
    }
    //get meetings
    getAllPersonsInMeeting(organization_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from_date, to_date, person_id, status } = req.query;
            const dtbs = this.db("meeting_person_view as mp");
            if (limit)
                dtbs.limit(parseInt(limit));
            if (skip)
                dtbs.offset(parseInt(skip));
            function appendTimeToDate(dateString, time) {
                return `${dateString} ${time}`;
            }
            dtbs
                .withSchema(this.MEETING)
                .select("*")
                .where("mp.organization_id", organization_id);
            if (person_id) {
                dtbs.andWhere("mp.person_id", person_id);
            }
            if (status) {
                dtbs.andWhere("mp.status", status);
            }
            if (from_date && to_date) {
                const fromDateWithTime = appendTimeToDate(from_date, "00:00:00");
                const toDateWithTime = appendTimeToDate(to_date, "23:59:59");
                dtbs.andWhereBetween("mp.date", [fromDateWithTime, toDateWithTime]);
            }
            const data = yield dtbs;
            if (!person_id && !from_date && !to_date) {
                const personInfoPromises = data.map((person) => __awaiter(this, void 0, void 0, function* () {
                    const personInfo = yield this.db("employee as em")
                        .withSchema(this.CRM_SCHEMA)
                        .select("*")
                        .where("em.id", person.person_id)
                        .first();
                    const meetings = yield this.db("meeting_person_view as mp")
                        .withSchema(this.MEETING)
                        .select("*")
                        .where("mp.person_id", person.person_id)
                        .andWhere("mp.organization_id", organization_id);
                    return {
                        id: person.person_id,
                        name: personInfo.name,
                        photo: personInfo.photo,
                        total_meeting: meetings.length,
                        meetings: meetings.map((meeting) => ({
                            id: meeting.meeting_id,
                            place: meeting.place,
                            title: meeting.title,
                            meeting_date: meeting.date,
                            end_time: meeting.end_time,
                            start_time: meeting.start_time,
                            meeting_type: meeting.meeting_type,
                        })),
                    };
                }));
                const personsData = yield Promise.all(personInfoPromises);
                return personsData;
            }
            if (from_date && to_date && !person_id) {
                const uniquePersonIds = [
                    ...new Set(data.map((meeting) => meeting.person_id)),
                ];
                const personInfoPromises = uniquePersonIds.map((person_id) => __awaiter(this, void 0, void 0, function* () {
                    const personInfo = yield this.db("employee as em")
                        .withSchema(this.CRM_SCHEMA)
                        .select("*")
                        .where("em.id", person_id)
                        .first();
                    const meetings = data
                        .filter((meeting) => meeting.person_id === person_id)
                        .map((meeting) => ({
                        id: meeting.meeting_id,
                        place: meeting.place,
                        title: meeting.title,
                        meeting_date: meeting.date,
                        end_time: meeting.end_time,
                        start_time: meeting.start_time,
                        meeting_type: meeting.meeting_type,
                    }));
                    return {
                        id: person_id,
                        name: personInfo.name,
                        photo: personInfo.photo,
                        total_meeting: meetings.length,
                        meetings: meetings,
                    };
                }));
                const personsData = yield Promise.all(personInfoPromises);
                return personsData;
            }
            if (person_id) {
                const personInfo = yield this.db("employee as em")
                    .withSchema(this.CRM_SCHEMA)
                    .select("*")
                    .where("em.id", person_id)
                    .first();
                const meetings = data.map((meeting) => ({
                    id: meeting.meeting_id,
                    place: meeting.place,
                    title: meeting.title,
                    meeting_date: meeting.date,
                    status: meeting.status,
                    end_time: meeting.end_time,
                    start_time: meeting.start_time,
                    meeting_type: meeting.meeting_type,
                }));
                return {
                    id: person_id,
                    name: personInfo.name,
                    photo: personInfo.photo,
                    designation: personInfo.designation,
                    email: personInfo.email,
                    phone: personInfo.phone,
                    total_meeting: meetings.length,
                    meetings: meetings,
                };
            }
            return data;
        });
    }
    getAttendedMeeting(id, organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("meeting_person as mp")
                .withSchema(this.MEETING)
                .leftJoin("meeting as m", "m.id", "=", "mp.meeting_id")
                .where("mp.person_id", id)
                .andWhere("m.organization_id", organization_id)
                .select("m.id", "m.title", "m.meeting_type", "m.status", "m.start_time", "m.end_time", "m.meeting_date")
                .orderBy("m.id", "desc");
            const total = yield this.db("meeting_person as mp")
                .withSchema(this.MEETING)
                .count("mp.meeting_id as total")
                .leftJoin("meeting as m", "m.id", "=", "mp.meeting_id")
                .where("mp.person_id", id);
            return { data, total: total[0].total };
        });
    }
    getMeeting(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, meeting_status, meeting_type, place, from_date, to_date, } = payload;
            const dtbs = this.db("meeting_view as mv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.MEETING)
                .select("*")
                .where("mv.organization_id", organization_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.whereBetween("mv.meeting_date", [from_date, to_date]);
                }
                if (meeting_status) {
                    this.andWhere({ meeting_status });
                }
                if (place) {
                    this.andWhere("mv.place_id", place);
                }
                if (meeting_type) {
                    this.andWhere({ meeting_type });
                }
            })
                .orderBy("mv.meeting_id", "desc");
            const total = yield this.db("meeting_view as mv")
                .withSchema(this.MEETING)
                .where("mv.organization_id", organization_id)
                .count("mv.meeting_id as total")
                .andWhere(function () {
                if (from_date && to_date) {
                    this.whereBetween("mv.meeting_date", [from_date, to_date]);
                }
                if (meeting_status) {
                    this.andWhere({ meeting_status });
                }
                if (meeting_type) {
                    this.andWhere({ meeting_type });
                }
                if (place) {
                    this.andWhere("mv.place_id", place);
                }
            });
            return { data, total: total[0].total };
        });
    }
    getMyMeeting(organization_id, employee_id, payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip, meeting_status, meeting_type, meeting_start_time, meeting_end_time, } = payload;
            const dtbs = this.db("meeting_person as mv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.MEETING)
                .leftJoin("meeting as m", "mv.meeting_id", "=", "m.id")
                .select("m.id", "m.status", "m.title", "m.meeting_type", "m.meeting_date", "m.start_time", "m.end_time")
                .where("mv.person_id", employee_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("m.title", "like", `%${key}%`).orWhere("m.title", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (meeting_status) {
                    this.andWhere({ meeting_status });
                }
                if (meeting_type) {
                    this.andWhere({ meeting_type });
                }
                if (meeting_start_time && meeting_end_time) {
                    this.whereBetween("m.meeting_date", [
                        meeting_start_time,
                        meeting_end_time,
                    ]);
                }
            })
                .orderBy("mv.meeting_id", "desc");
            const total = yield this.db("meeting_person as mv")
                .withSchema(this.MEETING)
                .leftJoin("meeting as m", "mv.person_id", "=", "m.id")
                .count("* as total")
                .where("mv.person_id", employee_id)
                .andWhere(function () {
                if (key) {
                    this.andWhere("m.title", "like", `%${key}%`).orWhere("m.title", "like", `%${key}%`);
                }
            })
                .andWhere(function () {
                if (meeting_status) {
                    this.andWhere({ meeting_status });
                }
                if (meeting_type) {
                    this.andWhere({ meeting_type });
                }
                if (meeting_start_time && meeting_end_time) {
                    this.whereBetween("m.meeting_date", [
                        meeting_start_time,
                        meeting_end_time,
                    ]);
                }
            })
                .orderBy("mv.meeting_id", "desc")
                .groupBy("mv.meeting_id");
            return { data, total: (_a = total[0]) === null || _a === void 0 ? void 0 : _a.total };
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
    getMeetingPlaces(organization_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { place_type, place_name } = req.query;
            const places = yield this.db("meeting_places")
                .withSchema(this.MEETING)
                .where("organization_id", organization_id)
                .andWhere(function () {
                if (place_type) {
                    this.andWhere({ place_type });
                }
                if (place_name) {
                    this.andWhereRaw("LOWER(place_name) LIKE LOWER(?)", `%${place_name}%`);
                }
            })
                .select("*");
            const totalPlace = yield this.db("meeting_places")
                .withSchema(this.MEETING)
                .where("organization_id", organization_id)
                .andWhere(function () {
                if (place_type) {
                    this.andWhere({ place_type });
                }
                if (place_name) {
                    this.andWhereRaw("LOWER(place_name) LIKE LOWER(?)", `%${place_name}%`);
                }
            })
                .count("place_id");
            return { places, total: totalPlace[0].count };
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
    checkSameTimingPersonMeeting(person_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const meeting = yield this.db("meeting_person as mp")
                .withSchema(this.MEETING)
                .leftJoin("meeting as m", "m.id", "=", "mp.meeting_id")
                .where("m.status", "upcoming")
                .andWhere("mp.person_id", person_id)
                .select("start_time", "end_time", "meeting_id");
            return meeting;
        });
    }
    checkMeetingDurationOverlapTwo(person_id, meeting_date, start_time, end_time) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedDate = new Date(meeting_date).toISOString().split("T")[0]; // Ensure the date is in 'YYYY-MM-DD' format
            const overlappingMeetings = yield this.db("meeting_person_view")
                .withSchema(this.MEETING)
                .where("person_id", person_id)
                .andWhere("date", formattedDate)
                .andWhere(function () {
                // Check if the new meeting overlaps with any existing meetings
                // this.where(function () {
                //   this.where('start_time', '<', end_time).andWhere(
                //     'end_time',
                //     '>',
                //     start_time
                //   );
                // });
            });
            return overlappingMeetings; // Return true if there are overlapping meetings
        });
    }
    checkMeetingDurationOverlap(person_id, meeting_date, start_time, end_time) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedDate = new Date(meeting_date).toISOString().split("T")[0]; // Ensure the date is in 'YYYY-MM-DD' format
            // Create full timestamp strings
            const formattedStartTime = `${formattedDate} ${start_time}`;
            const formattedEndTime = `${formattedDate} ${end_time}`;
            const overlappingMeetings = yield this.db("meeting_person_view")
                .withSchema(this.MEETING)
                .where("person_id", person_id)
                .andWhere("date", formattedDate)
                .andWhere((builder) => {
                builder.where(function () {
                    this.where("start_time", "<", formattedEndTime).andWhere("end_time", ">", formattedStartTime);
                });
            });
            return overlappingMeetings;
        });
    }
    getAllColluges(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("employee_team_view")
                .withSchema(this.EVO)
                .whereIn("team_id", team_id)
                .select("name as employee_name", "designation", "photo");
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
    getAdminDashboard(organization_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { meeting_status, meeting_type, limit, skip, start_time, end_date } = req.query;
            const allmeetings = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ organization_id })
                .select("meeting_title as title", "meeting_date as date", "meeting_type as meeting_type", "meeting_id as meetingId");
            const upcomingmeetings = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ organization_id })
                .andWhere("meeting_status", "upcoming")
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
            const todaymeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ organization_id })
                .andWhere("meeting_status", "upcoming")
                .andWhereRaw(`DATE(meeting_date) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const outsidemeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ organization_id })
                .andWhere("meeting_type", "offline")
                .andWhereRaw(`DATE(meeting_date) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            const indoormeeting = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .where({ organization_id })
                .andWhere("meeting_type", "online")
                .andWhereRaw(`DATE(meeting_date) = ?`, [today]) // Filter for today's date
                .select("meeting_title", "meeting_type", "meeting_date", "meeting_start_time", "meeting_end_time", "meeting_type as meeting_type", "meeting_id as meeting_id");
            return {
                allmeetings,
                upcomingmeetings,
                todaymeeting,
                outsidemeeting,
                indoormeeting,
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
    checkMeetingTimeWithPlaceDuplicacy(organization_id, meeting_date, start_time, end_time, place) {
        return __awaiter(this, void 0, void 0, function* () {
            const meetingTimeDuplicacy = yield this.db("meeting")
                .withSchema(this.MEETING) // Assuming MEETING is a schema name
                .where("organization_id", organization_id)
                .andWhere("meeting_date", meeting_date)
                .andWhere("start_time", "<", end_time) // Check if existing meeting starts before the specified end time
                .andWhere("end_time", ">", start_time) // Check if existing meeting ends after the specified start time
                .andWhere("place", place);
            return meetingTimeDuplicacy;
        });
    }
    checkMeetingDuration(start_time, end_time) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = new Date(start_time);
            const endTime = new Date(end_time);
            // Calculate the time difference in milliseconds
            const timeDifference = endTime.getTime() - startTime.getTime();
            // Convert milliseconds to minutes
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);
            // Check if the time difference is at least 1 minute
            return timeDifferenceInMinutes;
        });
    }
    getSingleMeeting(meeting_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("meeting_view")
                .withSchema(this.MEETING)
                .andWhere({ meeting_id: meeting_id })
                .joinRaw("JOIN crm.lead_view AS ld ON meeting_view.lead_id = ld.id")
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
exports.default = adminMeetingModel;
