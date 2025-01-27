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
class memberActivityModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    createActivity(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('work_logs')
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    getActivitiesUserWise(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('work_logs')
                .withSchema(this.EVO)
                .where({ employee_id: employee_id })
                .select('*');
            return userMember;
        });
    }
    // public async getMyActivities(employee_id: number) {
    //   const userMember = await this.db('worklogs_admin_view')
    //     .withSchema(this.EVO)
    //     .where({ employee_id: employee_id })
    //     .select('*');
    //   return userMember;
    // }
    getActivitiesTeamWise(team_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = payload;
            // Convert dates to start and end of the day for filtering
            const startDate = new Date(from_date);
            const endDate = new Date(to_date);
            endDate.setHours(23, 59, 59, 999);
            const dtbs = this.db('worklogs_admin_view as wv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .where('wv.team_id', team_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'like', `%${email}%`);
                }
            })
                .select('*');
            const total = yield this.db('worklogs_admin_view as wv')
                .withSchema(this.EVO)
                .count('wv.log_id as total')
                .where('wv.team_id', team_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'like', `%${email}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    getPrayerTimes(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('prayer_times_view2 as wv')
                .withSchema(this.DBO_SCHEMA)
                .where('organization_id', organization_id)
                .select('prayer_times')
                .first();
        });
    }
    getMyActivitiesTeamWise(team_id, employee_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = payload;
            // Convert dates to start and end of the day for filtering
            const startDate = new Date(from_date);
            const endDate = new Date(to_date);
            endDate.setHours(23, 59, 59, 999);
            const dtbs = this.db('worklogs_admin_view as wv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .where('wv.team_id', team_id)
                .andWhere('wv.employee_id', employee_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'like', `%${email}%`);
                }
            })
                .select('*');
            const total = yield this.db('worklogs_admin_view as wv')
                .withSchema(this.EVO)
                .count('wv.log_id as total')
                .where('wv.team_id', team_id)
                .andWhere('wv.employee_id', employee_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'like', `%${email}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    checkIfTeamHaveAnyActivity(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.db('work_logs as wv')
                .withSchema(this.EVO)
                .where({ team_id })
                .select('log_id');
            return data;
        });
    }
    getAllActivities(organization_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, employee, team_leader_verification, email, team_id, limit, skip, } = req.query;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            // Base query builder
            const baseQuery = () => {
                const query = this.db('worklogs_admin_view as waw')
                    .withSchema(this.EVO)
                    .where({ organization_id });
                if (from_date && to_date) {
                    query.whereBetween('log_datetime', [from_date, endDate]);
                }
                if (employee) {
                    query.where('employee_id', employee);
                }
                if (team_id) {
                    query.where('team_id', team_id);
                }
                if (team_leader_verification) {
                    query.where('team_leader_verification', team_leader_verification);
                }
                if (email) {
                    query.where('email', 'like', `%${email}%`);
                }
                return query;
            };
            // Data query
            const dataQuery = baseQuery().select('*').orderBy('log_id', 'desc');
            if (limit && skip) {
                dataQuery.limit(Number(limit)).offset(Number(skip));
            }
            // Count queries
            const countQuery = baseQuery().count('log_id as count');
            const verifiedCountQuery = baseQuery()
                .where('team_leader_verification', true)
                .count('log_id as count');
            const unverifiedCountQuery = baseQuery()
                .where('team_leader_verification', false)
                .count('log_id as count');
            // Execute all queries in parallel
            const [data, [{ count: total }], [{ count: total_verified }], [{ count: total_unverified }],] = yield Promise.all([
                dataQuery,
                countQuery,
                verifiedCountQuery,
                unverifiedCountQuery,
            ]);
            return {
                data,
                total,
                total_verified,
                total_unverified,
            };
        });
    }
    getTeam(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams_employee')
                .withSchema(this.EVO)
                .where({ emp_id: employee_id })
                .select('*');
            return userMember;
        });
    }
    getTeamTotalInfo(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams')
                .withSchema(this.EVO)
                .where('teams.team_id', team_id)
                .joinRaw('LEFT JOIN crm.employee AS employee ON teams.team_leader_id = employee.id')
                .select('teams.team_name', 'employee.name', 'employee.designation');
            return userMember;
        });
    }
    getTeamMembers(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('employee_team_view')
                .withSchema(this.EVO)
                .where({ team_id })
                .select('*');
            return userMember;
        });
    }
    //check if employee have the ability to verify
    checkTeamVerifier(team_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('activity_verifier')
                .withSchema(this.EVO)
                .where({ team_id })
                .andWhere({ employee_id })
                .select('*');
            return userMember;
        });
    }
    //get my activities
    getMyActivities(team_id, employee_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = payload;
            // Convert dates to start and end of the day for filtering
            const startDate = new Date(from_date);
            const endDate = new Date(to_date);
            endDate.setHours(23, 59, 59, 999);
            const dtbs = this.db('worklogs_admin_view as wv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .where('wv.team_id', team_id)
                .andWhere('wv.employee_id', employee_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'like', `%${email}%`);
                }
            })
                .select('*');
            const total = yield this.db('worklogs_admin_view as wv')
                .withSchema(this.EVO)
                .count('wv.log_id as total')
                .where('wv.team_id', team_id)
                .andWhere('wv.employee_id', employee_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween('wv.log_datetime', [startDate, endDate]);
                }
                if (employee) {
                    this.andWhere('wv.employee_id', employee);
                }
                if (team_leader_verification) {
                    this.andWhere('wv.team_leader_verification', team_leader_verification);
                }
                if (remarks) {
                    this.andWhere('wv.remarks', remarks);
                }
                if (email) {
                    // Perform a partial search for email addresses
                    this.andWhere('wv.email', 'wv.like', `%${email}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    //get rangewise data
    getSingleMyCurrentActivity(date, ranges, employee_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    SELECT * FROM ${this.EVO}.check_work_log_availability(
      ?::date,
      ?::text[],
      ?::integer,
      ?::integer
    )
  `;
            const data = yield this.db.raw(query, [date, ranges, employee_id, team_id]);
            // The result will be in data.rows
            return data.rows;
        });
    }
}
exports.default = memberActivityModel;
