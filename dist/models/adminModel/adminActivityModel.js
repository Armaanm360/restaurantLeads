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
class adminActivityModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    getActivityTeamWise(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .andWhere({ team_id })
                .select('*');
        });
    }
    // insert user admin
    checkPrayerTimes(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('new_prayer_times')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id })
                .select('*');
        });
    }
    insertAuditTrail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('audit_trail')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    createPrayerTimes(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('new_prayer_times')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    updatePrayerTimes(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('new_prayer_times')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id })
                .update(payload);
        });
    }
    updateMeetingStatusTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentDateWithTime = new Date();
            const hours = String(currentDateWithTime.getHours()).padStart(2, '0');
            const minutes = String(currentDateWithTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentDateWithTime.getSeconds()).padStart(2, '0');
            const currentTime = `${hours}:${minutes}:${seconds}`;
            return yield this.db('meeting')
                .withSchema(this.MEETING)
                .where(function () {
                this.where('status', 'upcoming').orWhere('status', 'running');
            })
                .andWhere('meeting_date', '<=', currentDate)
                .andWhere('end_time', '<', currentTime)
                .update({
                status: 'ended',
            });
        });
    }
    getTeamWiseActivityData(team_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.db('worklogs_admin_view')
                .withSchema(this.EVO)
                .where('team_id', team_id);
            // Apply date range filter only if both from_date and to_date are provided
            if (from_date && to_date) {
                query = query.whereBetween('log_datetime', [from_date, to_date]);
            }
            const result = yield query
                .select(this.db.raw('COUNT(*) as total_activities'), this.db.raw('SUM(CASE WHEN team_leader_verification = true THEN 1 ELSE 0 END) as verified_activities'), this.db.raw('SUM(CASE WHEN team_leader_verification = false OR team_leader_verification IS NULL THEN 1 ELSE 0 END) as unverified_activities'))
                .first();
            return {
                activities: parseInt(result.total_activities) || 0,
                verified_activities: parseInt(result.verified_activities) || 0,
                unverified_activities: parseInt(result.unverified_activities) || 0,
            };
        });
    }
}
exports.default = adminActivityModel;
