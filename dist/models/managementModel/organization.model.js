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
exports.OrganizationModel = void 0;
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class OrganizationModel extends schema_1.default {
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
    // get all restaurants
    getAllOrganization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, key, limit, skip } = payload;
            console.log({ key });
            const dtbs = this.db('organization as o');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .where('o.is_deleted', false)
                .select('o.id', 'o.name', 'o.website', 'o.country_id', 'o.city_id', 'o.phone', 'o.address', 'o.postal_code', 'o.logo', 'o.email', 'o.email', 'o.sale_date', 'o.expiry_date', 'o.sale_amount', 'o.is_activate', 'o.sale_type', 'employee.name as sale_by')
                .joinRaw('LEFT JOIN management.employee AS employee ON o.sale_by = employee.id')
                .andWhere(function () {
                if (key) {
                    this.where('o.name', 'ILIKE', `%${key}%`);
                }
            })
                .orderBy('id', 'desc');
            const totals = yield this.db('organization as o')
                .withSchema(this.CRM_SCHEMA)
                .joinRaw('LEFT JOIN management.employee AS employee ON o.sale_by = employee.id')
                .where('o.is_deleted', false)
                .count('o.id as total')
                .andWhere(function () {
                if (key) {
                    this.where('o.name', 'ILIKE', `%${key}%`);
                }
            });
            const total = yield this.db('organization as o')
                .withSchema(this.CRM_SCHEMA)
                .where('o.is_deleted', false)
                .joinRaw('LEFT JOIN management.employee AS employee ON o.sale_by = employee.id')
                .count('o.id as total')
                .andWhere(function () {
                if (key) {
                    this.where('o.name', 'ILIKE', `%${key}%`);
                }
            });
            return {
                data,
                total: parseInt(totals[0].total),
            };
        });
    }
    // get all organization
    getAllUserOrgWise(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const spy_email = `spy_${organization_id}@gmail.com`;
            const { email, key, limit, skip } = payload;
            const baseQuery = this.db('user_admin as ua')
                .withSchema(this.CRM_SCHEMA)
                .where('ua.organization_id', organization_id)
                .andWhereNot('email', spy_email);
            if (key) {
                baseQuery.where('ua.name', 'ILIKE', `%${key}%`);
            }
            if (email) {
                baseQuery.where('ua.email', 'ILIKE', `%${email}%`);
            }
            // Query for data
            const dataQuery = baseQuery
                .clone()
                .select('ua.id', 'ua.name', 'ua.phone', 'ua.avatar', 'ua.email')
                .orderBy('ua.id', 'desc');
            if (limit && skip) {
                dataQuery.limit(parseInt(limit)).offset(parseInt(skip));
            }
            // Query for total count
            const totalQuery = baseQuery.clone().count('ua.id as total').first();
            const [data, totalResult] = yield Promise.all([dataQuery, totalQuery]);
            return {
                data,
                total: parseInt((totalResult === null || totalResult === void 0 ? void 0 : totalResult.total) || '0'),
            };
        });
    }
    getPermissionsGroup() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('permission_with_permission_group as pwpg')
                .withSchema(this.DBO_SCHEMA)
                // .whereIn(
                //   'pwpg.permission_group_id',
                //   [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28]
                // )
                .select('permission_group_id', 'permission_group_name');
            const counting = yield this.db('permission_with_permission_group as pwpg')
                .withSchema(this.DBO_SCHEMA)
                .count('pwpg.permission_group_id as total');
            // .whereIn(
            //   'pwpg.permission_group_id',
            //   [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28]
            // );
            return { data, total: counting[0].total };
        });
    }
    checkRestaurantExsistence(restaurant_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.db('restaurants')
                .withSchema(this.CRM_SCHEMA)
                .where({ restaurant_name: restaurant_name })
                .select('*');
            return accounts;
        });
    }
    createResTable(table_name, type, rest_table_status, restaurant) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield this.db('dinein_tables')
                .withSchema(this.CRM_SCHEMA)
                .insert({
                rest_table_name: table_name,
                type: type,
                rest_table_status: rest_table_status,
                rest_table_created_by: restaurant,
            });
            return supplier;
        });
    }
    createTakeoutTable(takeout_table_name, takeout_table_status, restaurant) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield this.db('takeout_tables')
                .withSchema(this.CRM_SCHEMA)
                .insert({
                takeout_table_name: takeout_table_name,
                takeout_table_status: takeout_table_status,
                takeout_table_created_by: restaurant,
            });
            return supplier;
        });
    }
    createWarehouse(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            const ingredient = yield this.db('warehouse')
                .withSchema(this.CRM_SCHEMA)
                .insert({
                warehouse_name: 'Demo Main Warehousesss',
                warehouse_phone: '123-456-7890450',
                warehouse_address: '123 Main Streett',
                warehouse_created_by: userid,
            });
            return ingredient;
        });
    }
    getAllEmployees(payload) {
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
                .withSchema(this.CRM_SCHEMA)
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
    createRole(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield this.db('roles')
                .withSchema(this.CRM_SCHEMA)
                .insert(payload)
                .returning('*');
            return roles;
        });
    }
    //get all permissions
    getAllPermissionsVersionWise(version_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = yield this.db('permissions')
                .withSchema(this.CRM_SCHEMA)
                .where({ version: version_id })
                .select('*');
            return permissions;
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
    // public async getSingleEmployee(payload: { email?: string; emp_id?: number }) {
    //   const { email, emp_id } = payload;
    //   return await this.db("employee AS em")
    //     .withSchema(this.CRM_SCHEMA)
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
}
exports.OrganizationModel = OrganizationModel;
