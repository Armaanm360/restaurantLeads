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
exports.ManagementUserModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class ManagementUserModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    insertUserMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.db('users')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, 'id');
            return member;
        });
    }
    /**
     * Retrieves the dashboard data, including counts and sums for various entities such as
     * organizations, leads, users, products, sales, meetings, leave applications, and projects.
     *
     * @returns An object containing aggregated data for the dashboard.
     */
    getDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch total count of organizations
            const totalOrganizations = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .count('id as totalOrganizations');
            // Fetch total count of leads created
            const totalLeadsCreated = yield this.db('lead')
                .withSchema(this.CRM_SCHEMA)
                .count('id as totalLeadsCreated');
            // Fetch total count of admin users
            const totalAdminUsers = yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .count('id as totalAdminUsers');
            // Fetch total count of employee users
            const totalEmployeeUsers = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .count('id as totalEmployeeUsers');
            // Fetch total count of products created
            const totalProductsCreated = yield this.db('product')
                .withSchema(this.CRM_SCHEMA)
                .count('id as totalProductsCreated');
            // Fetch the total sum of sales from organizations
            const totalSales = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .sum('sale_amount as totalSales');
            // Fetch the count of inactive organizations
            const totalInactiveOrganizations = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where('is_activate', false)
                .count('id as totalInactiveOrganizations');
            // Fetch the count of active organizations
            const totalActiveOrganizations = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where('is_activate', true)
                .count('id as totalActiveOrganizations');
            // Fetch total count of meetings created
            const totalMeetingsCreated = yield this.db('meeting')
                .withSchema(this.MEETING)
                .count('id as totalMeetingsCreated');
            // Fetch total count of leave applications
            const totalLeaveApplications = yield this.db('leaves')
                .withSchema(this.LEAVE)
                .count('id as totalLeaveApplications');
            // Fetch total count of projects created
            const totalProjectsCreated = yield this.db('projects')
                .withSchema(this.PM_SCHEMA)
                .count('id as totalProjectsCreated');
            // Return all aggregated dashboard data
            return {
                totalOrganizations,
                totalLeadsCreated,
                totalAdminUsers,
                totalEmployeeUsers,
                totalProductsCreated,
                totalSales,
                totalInactiveOrganizations,
                totalActiveOrganizations,
                totalMeetingsCreated,
                totalLeaveApplications,
                totalProjectsCreated,
            };
        });
    }
    // check user
    checkUser({ email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('users')
                .withSchema(this.CRM_SCHEMA)
                .where((qb) => {
                if (email) {
                    qb.orWhere('email', email);
                }
            });
            return userMember;
        });
    }
    // get all restaurants
    getAllUsers(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { restaurant_id, key, limit, skip } = payload;
            const dtbs = this.db('users as u');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select('u.id', 'u.owner_name', 'u.company_name', 'u.email', 'u.phone', 'u.role_id', 'u.address', 'u.restaurant_id', 'r.restaurant_name', 'r.restaurant_version')
                .leftJoin('restaurants as r', 'r.id', '=', 'u.restaurant_id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('r.restaurant_name', 'like', `%${key}%`).orWhere('r.restaurant_name', 'like', `%${key}%`);
                    this.andWhere('u.owner_name', 'like', `%${key}%`).orWhere('u.owner_name', 'like', `%${key}%`);
                }
            })
                .andWhere(function () {
                if (restaurant_id) {
                    this.andWhere('r.id', Number(restaurant_id)).orWhere('r.id', Number(restaurant_id));
                }
            })
                .orderBy('u.id', 'desc');
            const total = yield this.db('users as u')
                .withSchema(this.CRM_SCHEMA)
                .count('u.id as total')
                .leftJoin('restaurants as r', 'r.id', '=', 'u.restaurant_id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('r.restaurant_name', 'like', `%${key}%`).orWhere('r.restaurant_name', 'like', `%${key}%`);
                    this.andWhere('u.owner_name', 'like', `%${key}%`).orWhere('u.owner_name', 'like', `%${key}%`);
                }
            })
                .andWhere(function () {
                if (restaurant_id) {
                    this.andWhere('r.id', Number(restaurant_id)).orWhere('r.id', Number(restaurant_id));
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single employee
    getSingleEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db('employee as emp')
                .withSchema(this.CRM_SCHEMA)
                .select('emp.id', 'emp.name', 'emp.username', 'emp.phone', 'emp.photo', 'emp.password', 'emp.designation', 'emp.status', 'emp.email', 'sh.id as shift_id', 'sh.shift_start', 'sh.shift_end', 'sh.shift_name', 'teams_employee.team_id', 'teams.team_name', 'teams.team_leader_id')
                .leftJoin('teams_employee', 'teams_employee.emp_id', '=', 'emp.id')
                .leftJoin('teams', 'teams.team_id', '=', 'teams_employee.team_id')
                .leftJoin('shifts as sh', 'sh.id', '=', 'emp.shift_id')
                .where(function () {
                if (id) {
                    this.andWhere('emp.id', id);
                }
                if (email) {
                    this.where('emp.email', email);
                }
            });
        });
    }
    // get single employee
    updateSingleUser(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('users')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    //get all roles
    getAllRoles(restaurant_id, req, customParam) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = (req === null || req === void 0 ? void 0 : req.query) || {};
            let query = this.db('roles')
                .withSchema(this.CRM_SCHEMA)
                .where({ restaurant_id: restaurant_id })
                .select('*');
            if (name) {
                query = query.where('name', 'like', `%${name}%`);
            }
            // If customParam is provided and is 'superadmin', filter roles accordingly
            if (customParam === 'super-admin') {
                query = query.where('name', '=', 'super-admin');
            }
            return yield query;
        });
    }
}
exports.ManagementUserModel = ManagementUserModel;
