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
class CommonModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert OTP
    insertOTP(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("email_otp")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    // get otp
    getOTP(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield this.db("email_otp")
                .withSchema(this.DBO_SCHEMA)
                .select("id", "hashed_otp", "tried")
                .andWhere("email", payload.email)
                .andWhere("type", payload.type)
                .andWhere("matched", 0)
                .andWhere("tried", "<", 3)
                .andWhereRaw(`"created_at" + interval '3 minutes' > NOW()`);
            return check;
        });
    }
    // update otp
    updateOTP(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("email_otp")
                .withSchema(this.DBO_SCHEMA)
                .update(payload)
                .where(where);
        });
    }
    // user password verify
    getUserPassword({ table, schema, passField, userIdField, userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(table)
                .withSchema(schema)
                .select(passField)
                .where(userIdField, userId);
        });
    }
    // update password
    updatePassword({ table, userIdField, userId, passField, schema, hashedPass, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(table)
                .update(passField, hashedPass)
                .withSchema(schema)
                .where(userIdField, userId);
        });
    }
    // insert audit trail
    // public async insetAuditTrail(payload: IInsertAuditTrailPayload) {
    //   return await this.db("auditTrail")
    //     .withSchema(this.ADMINISTRATION_SCHEMA)
    //     .insert(payload);
    // }
    // create division
    // public async createDivision(payload: ICreateDivisionPayload) {
    //   return await this.db("division")
    //     .withSchema(this.DBO_SCHEMA)
    //     .insert(payload);
    // }
    // get division
    // public async getDivision() {
    //   try {
    //     return await this.db("division").withSchema(this.DBO_SCHEMA).select("*");
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // get district
    // public async getDistrict(filter: IGetDistrictParams) {
    //   return await this.db("district")
    //     .withSchema(this.DBO_SCHEMA)
    //     .select("*")
    //     .where(filter);
    // }
    // get thana
    // public async getThana(filter: IGetThanaParams) {
    //   return await this.db("thana AS t")
    //     .withSchema(this.DBO_SCHEMA)
    //     .select("t.id", "t.name")
    //     .join("district AS d", "t.districtId", "d.id")
    //     .where((qb) => {
    //       if (filter.districtId) {
    //         qb.andWhere("t.districtId", filter.districtId);
    //       }
    //       if (filter.divisionId) {
    //         qb.andWhere("d.divisionId", filter.divisionId);
    //       }
    //     });
    // }
    // get area
    // public async getArea(filter: IGetAreaParams) {
    //   return await this.db("addressView")
    //     .withSchema(this.DBO_SCHEMA)
    //     .select("areaId AS id", "areaName AS name")
    //     .where(filter);
    // }
    createNotification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload)
                .returning("*");
        });
    }
    createNotificationAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("admin_notification")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload)
                .returning("*");
        });
    }
    employeeNotificationSeen(notification_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_employee")
                .withSchema(this.DBO_SCHEMA)
                .where({ notification_id: notification_id, user_id: user_id })
                .update("is_seen", true);
        });
    }
    adminNotificationSeen(notification_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_admin")
                .withSchema(this.DBO_SCHEMA)
                .where({ notification_id: notification_id, user_id: user_id })
                .update("is_seen", true);
        });
    }
    allNotificationView(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_admin")
                .withSchema(this.DBO_SCHEMA)
                .where({ user_id })
                .update("is_seen", true);
        });
    }
    allNotificationViewEmployee(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_employee")
                .withSchema(this.DBO_SCHEMA)
                .where({ user_id })
                .update("is_seen", true);
        });
    }
    addEmployeeNotification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_employee")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    addAdminNotification(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notification_admin")
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
        });
    }
    getAllEmployeeNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("notification_employee as ne")
                .withSchema(this.DBO_SCHEMA)
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .leftJoin("notification as n", "n.id", "=", "ne.notification_id")
                .select("ne.notification_id", "ne.user_id", "ne.is_seen", "n.message", "n.ref_id", "n.type", "n.created_at")
                .orderBy("id", "desc");
            const count_seen = yield this.db("notification_employee as ne")
                .withSchema(this.DBO_SCHEMA)
                .count("ne.notification_id as seen")
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .andWhere("ne.is_seen", true)
                .leftJoin("notification as n", "n.id", "=", "ne.notification_id");
            const count_unseen = yield this.db("notification_employee as ne")
                .withSchema(this.DBO_SCHEMA)
                .count("ne.notification_id as unseen")
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .andWhere("ne.is_seen", false)
                .leftJoin("notification as n", "n.id", "=", "ne.notification_id");
            return { data, seen: count_seen[0].seen, unseen: count_unseen[0].unseen };
        });
    }
    getAllAdminNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("notification_admin as ne")
                .withSchema(this.DBO_SCHEMA)
                .select("ne.notification_id", "ne.user_id", "ne.is_seen", "n.message", "n.ref_id", "n.type", "n.created_at")
                .leftJoin("admin_notification as n", "n.id", "=", "ne.notification_id")
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .orderBy("n.id", "desc");
            const count_seen = yield this.db("notification_admin as ne")
                .withSchema(this.DBO_SCHEMA)
                .count("ne.notification_id as seen")
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .andWhere("ne.is_seen", true)
                .leftJoin("admin_notification as n", "n.id", "=", "ne.notification_id");
            const count_unseen = yield this.db("notification_admin as ne")
                .withSchema(this.DBO_SCHEMA)
                .count("ne.notification_id as unseen")
                .where("ne.user_id", id)
                .andWhere("n.deleted", false)
                .andWhere("ne.is_seen", false)
                .leftJoin("admin_notification as n", "n.id", "=", "ne.notification_id");
            return { data, seen: count_seen[0].seen, unseen: count_unseen[0].unseen };
        });
    }
}
exports.default = CommonModel;
