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
class EmployeeModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, 'id');
        });
    }
    // create employee or guest product lead permission
    insertEmployeeProductPermission(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('emp_product_permission')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // get employee or guest product lead permission
    getEmployeeProductPermission(emp_id, org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('emp_product_permission as epp')
                .withSchema(this.CRM_SCHEMA)
                .select('p.id', 'p.name')
                .leftJoin('product as p', 'epp.product_id', 'p.id')
                .where({ emp_id })
                .andWhere({ org_id });
        });
    }
    // delete employee product permission
    deleteEmployeeProductPermission(org_id, emp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('emp_product_permission')
                .withSchema(this.CRM_SCHEMA)
                .del()
                .where({ emp_id })
                .andWhere({ org_id });
        });
    }
    // get teams employee socket
    getTemsEmployeeSocket(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .whereIn('id', employee_id)
                .select('name', 'socket_id');
        });
    }
    upsertEmployeeCureentLocation(employee_id
    // payload: IUpdaSertEmployeeCurrentLocation
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee').withSchema(this.CRM_SCHEMA);
            // .insert(payload, 'id');
        });
    }
    checkEmployeeAvailableOnLocation(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee_location')
                .withSchema(this.DBO_SCHEMA)
                .where({ employee_id })
                .select('id');
        });
    }
    createEmployeeLocation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee_location')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    updateEmployeeLocation(employee_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee_location')
                .withSchema(this.DBO_SCHEMA)
                .where({ employee_id })
                .update(payload);
        });
    }
    // get all employee
    getAllEmploye(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip, organization_id, type, status } = payload || {};
            const dtbs = this.db('employee as e');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select('e.id', 'e.name', 'e.username', 'e.phone', 'e.designation', 'e.type', 'e.photo', 'e.status', 'e.email', 'sh.id as shift_id', 'sh.shift_start', 'sh.shift_end', 'sh.shift_name')
                .leftJoin('shifts as sh', 'sh.id', '=', 'e.shift_id')
                .where(function () {
                if (email) {
                    this.andWhere('e.email', email);
                }
                if (organization_id) {
                    this.andWhere('e.organization_id', organization_id);
                }
                if (type) {
                    this.andWhere('e.type', type);
                }
                if (status) {
                    this.andWhere('e.status', status);
                }
            })
                .andWhere(function () {
                if (key) {
                    this.where(function () {
                        this.where('e.name', 'ILIKE', `${key}%`).orWhere('e.name', 'ILIKE', `% ${key}%`);
                    });
                }
            })
                .orderBy('e.name', 'asc'); // Order alphabetically by name
            const total = yield this.db('employee as e')
                .withSchema(this.CRM_SCHEMA)
                .count('e.id as total')
                .leftJoin('shifts as sh', 'sh.id', '=', 'e.shift_id')
                .where(function () {
                if (organization_id) {
                    this.andWhere('e.organization_id', organization_id);
                }
                if (key) {
                    this.where(function () {
                        this.where('e.name', 'ILIKE', `${key}%`);
                        // .orWhere('e.name', 'ILIKE', `% ${key}%`)
                        // .orWhere('e.email', 'ILIKE', `${key}%`)
                        // .orWhere('e.phone', 'ILIKE', `${key}%`)
                        // .orWhere('sh.shift_name', 'ILIKE', `${key}%`);
                    });
                }
                if (email) {
                    this.andWhere('e.email', email);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get all employee last id
    getAllEmpLasId(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .select('id')
                .orderBy('id', 'desc')
                .where('organization_id', org_id);
        });
    }
    // get all employee
    removeNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('notification_employee')
                .withSchema(this.DBO_SCHEMA)
                .where({ user_id: id })
                .delete();
        });
    }
    getTeamLeaderEmployeeSocket(team_id) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getAllEmployees(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip } = payload;
            // Start building the query
            let query = this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .select('id', 'name', 'username', 'phone', 'designation', 'status', 'email');
            // Apply filters
            if (email) {
                query = query.where('email', 'ilike', `%${email}%`); // Case-insensitive search for email
            }
            if (key) {
                const formattedKey = key.trim().toLowerCase(); // Trim and convert to lowercase
                query = query.where(function () {
                    this.whereRaw('LOWER(name) LIKE ?', [`%${formattedKey}%`]) // Case-insensitive search for name
                        .orWhereRaw('LOWER(phone) LIKE ?', [`%${formattedKey}%`]); // Case-insensitive search for phone
                });
            }
            // Apply pagination if provided
            if (limit !== undefined && skip !== undefined) {
                query = query.limit(limit).offset(skip);
            }
            // Execute the query
            const data = yield query.orderBy('name', 'desc');
            // Fetch total count for pagination
            const totalQuery = this.db('employee')
                .withSchema(this.EVO)
                .count('id as total');
            if (email) {
                totalQuery.where('email', 'ilike', `%${email}%`); // Case-insensitive search for email
            }
            if (key) {
                const formattedKey = key.trim().toLowerCase(); // Trim and convert to lowercase
                totalQuery.where(function () {
                    this.whereRaw('LOWER(name) LIKE ?', [`%${formattedKey}%`]) // Case-insensitive search for name
                        .orWhereRaw('LOWER(phone) LIKE ?', [`%${formattedKey}%`]); // Case-insensitive search for phone
                });
            }
            const totalResult = yield totalQuery;
            const total = parseInt(totalResult[0].total);
            return {
                data,
                total,
            };
        });
    }
    getOrganizationEmployees(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee as emp')
                .withSchema(this.CRM_SCHEMA)
                .where('emp.organization_id', organization_id)
                .select('*');
        });
    }
    getSingleInfoEmployee(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee as emp')
                .withSchema(this.CRM_SCHEMA)
                .where('emp.id', id)
                .select('id', 'name', 'email', 'socket_id', 'phone', 'designation')
                .first();
        });
    }
    // get single employee
    getSingleEmployee(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db('crm_employee_view as emp')
                .withSchema(this.CRM_SCHEMA)
                .select('emp.employee_id as id', 'emp.employee_name as name', 'emp.employee_username as username', 'emp.employee_designation as designation', 'emp.employee_created_at as created_at', 'emp.employee_phone as phone', 'emp.employee_email as email', 'emp.employee_status as status', 'emp.employee_photo as photo', 'emp.organization_id', 'emp.employee_password as password', 'emp.shift_id', 'emp.emp_pd_permission', 'emp.type', 'emp.shift_name', 'emp.shift_start', 'emp.socket_id', 'shift_end', 'shift_organization_id', 'team_id', 'device_token', 'team_name', 'team_leader_id', 'o.name as organization_name', 'o.logo as logo', 'o.address', 'o.leave_allowance')
                .join('organization as o', 'o.id', '=', 'emp.organization_id')
                .where(function () {
                if (id) {
                    this.andWhere('emp.employee_id', id);
                }
                if (email) {
                    this.where('emp.employee_email', email);
                }
            });
        });
    }
    // public async getSingleEmployee(payload: { email?: string; emp_id?: number }) {
    //   const { email, emp_id } = payload;
    //   return await this.db("employee AS em")
    //     .withSchema(this.EVO)
    //     .select("*")
    //     .where(function () {
    //       if (email) {
    //         this.andWhere("em.email", email);
    //       }
    //       if (emp_id) {
    //         this.andWhere("em.id", emp_id);
    //       }
    //     });
    // }
    // update single employee
    updateSingleEmployee(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = where;
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where(function () {
                if (id) {
                    this.where({ id });
                }
                if (email) {
                    this.where({ email });
                }
            });
        });
    }
    updateNewSingleEmployee(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    //upsert employee shift
    updateUserIdShift(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('employee')
                .withSchema(this.EVO)
                .where({ id: user_id })
                .update(payload);
            return userMember;
        });
    }
    updateOrganization(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where({ id: organization_id })
                .update(payload);
            return userMember;
        });
    }
    //check shift
    checkUserIdShift(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('working_shifts')
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select('*');
            return userMember;
        });
    }
    getOrganization(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('organization')
                .withSchema(this.CRM_SCHEMA)
                .where({ id: organization_id })
                .select('*');
            return userMember[0];
        });
    }
    //insert employee's shift
    createUserShift(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('working_shifts')
                .withSchema(this.EVO)
                .insert(payload);
            return userMember;
        });
    }
    //check if teamleader exsists
    updateEmployeeToTeamLeader(team_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams')
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .update({ team_leader_id: employee_id });
            return userMember;
        });
    }
    //check if teamleader exsists
    checkEmployeeExsistsInAnyTeam(emp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('teams_employee')
                .withSchema(this.EVO)
                .where({ emp_id })
                .select('*');
            return userMember;
        });
    }
    //create shift
    createShift(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const shift = yield this.db('shifts')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
            return shift;
        });
    }
    //shift duplicacy check
    singleShiftCheck(organization_id, shift_name, shift_start, shift_end) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, check for shift_name duplicacy
            const nameDuplicates = yield this.db('shifts')
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .andWhere('shift_name', shift_name);
            // Then, check for matching shift_start and shift_end
            const timeDuplicates = yield this.db('shifts')
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .andWhere('shift_start', shift_start)
                .andWhere('shift_end', shift_end);
            return { nameDuplicates, timeDuplicates };
        });
    }
    //get all shifts
    getAllShifts(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, key, limit, skip } = payload;
            const dtbs = this.db('shifts as s');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .where('organization_id', organization_id)
                .select('s.id', 's.shift_name', 's.shift_start', 's.shift_end')
                .andWhere(function () {
                if (id) {
                    this.andWhere({ id });
                }
            })
                .andWhere(function () {
                if (key) {
                    this.where('s.shift_name', 'ILIKE', `%${key}%`);
                }
            })
                .orderBy('id', 'desc');
            const total = yield this.db('shifts as s')
                .withSchema(this.CRM_SCHEMA)
                .where('organization_id', organization_id)
                .count('id as total')
                .andWhere(function () {
                if (id) {
                    this.andWhere({ id });
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere('s.shift_name', 'like', `%${key}%`).orWhere('s.shift_name', 'like', `%${key}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    //update shift
    updateShift(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const shift = yield this.db('shifts')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
            return shift;
        });
    }
    updateSocket(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('user_admin')
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    updateSocketEmployee(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const shift = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
            return shift;
        });
    }
    getAllEmployeeSocket(organization_id, emp_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .select('*')
                .where({ organization_id })
                .andWhere(function () {
                if (emp_ids === null || emp_ids === void 0 ? void 0 : emp_ids.length) {
                    this.whereIn('id', emp_ids);
                }
            });
        });
    }
}
exports.default = EmployeeModel;
