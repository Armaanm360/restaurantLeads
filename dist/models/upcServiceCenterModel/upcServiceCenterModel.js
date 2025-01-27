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
class UpcServiceCenterModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create service center
    createServiceCenter(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("service_center")
                .withSchema(this.SERVICE_SCHEMA)
                .insert(payload, "id");
        });
    }
    // update service center
    updateServiceCenter(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = where;
            return yield this.db("service_center")
                .withSchema(this.SERVICE_SCHEMA)
                .update(payload)
                .where(function () {
                if (id) {
                    this.andWhere({ id });
                }
                if (email) {
                    this.andWhere({ email });
                }
            });
        });
    }
    // get service center
    getAllserviceCenter(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, name, email } = payload;
            const dtbs = this.db("service_center");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.SERVICE_SCHEMA)
                .select("id", "name", "type", "location", "logo", "email", "created_at")
                .where(function () {
                if (name) {
                    this.andWhere({ name });
                }
                if (email) {
                    this.andWhere({ email });
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("service_center")
                .withSchema(this.SERVICE_SCHEMA)
                .count("id as total")
                .where(function () {
                if (name) {
                    this.andWhere({ name });
                }
                if (email) {
                    this.andWhere({ email });
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single service center
    getSingleServiceCenter(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("service_center")
                .withSchema(this.SERVICE_SCHEMA)
                .select("*")
                .where(function () {
                if (email) {
                    this.andWhere({ email });
                }
                if (id) {
                    this.andWhere({ id });
                }
            });
        });
    }
    // get all check in
    getAllCheckIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, name, service_id } = payload;
            const dtbs = this.db("card_check_in_view_v2");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.SERVICE_SCHEMA)
                .select("id", "upc_user_id", "user_name", "card_id", "card_name", "checked_in_time", "status", "other_card_id", "card_type", "paid_amount")
                .where(function () {
                if (name) {
                    this.andWhere("user_name", "like", `%${name}%`);
                }
                if (service_id) {
                    this.andWhere({ service_id });
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("card_check_in_view_v2")
                .withSchema(this.SERVICE_SCHEMA)
                .count("id as total")
                .where(function () {
                if (name) {
                    this.andWhere("user_name", "like", `%${name}%`);
                }
                if (service_id) {
                    this.andWhere({ service_id });
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single check in
    getSingleCheckIn(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, service_id } = where;
            return yield this.db("card_check_in_view_v2")
                .withSchema(this.SERVICE_SCHEMA)
                .select("*")
                .where(function () {
                if (id) {
                    this.andWhere({ id });
                }
                if (service_id) {
                    this.andWhere({ service_id });
                }
            });
        });
    }
    // update single check in
    updateCheckIn(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, service_id } = where;
            return yield this.db("card_check_in")
                .withSchema(this.SERVICE_SCHEMA)
                .update(payload)
                .where(function () {
                if (id) {
                    this.andWhere({ id });
                }
                if (service_id) {
                    this.andWhere({ service_id });
                }
            });
        });
    }
    // insert user card used amenities
    insertUsedCardAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_user_used_amenities")
                .withSchema(this.UPC)
                .insert(payload);
        });
    }
    // insert user admin
    insertUserAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("user_admin")
                .withSchema(this.SERVICE_SCHEMA)
                .insert(payload);
        });
    }
    // get single admin
    getSingleAdmin(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, id } = payload;
            return yield this.db("user_admin as ua")
                .withSchema(this.SERVICE_SCHEMA)
                .select("ua.id as admin_id", "ua.name as admin_name", "ua.phone as admin_phone", "ua.email as admin_email", "ua.avatar as admin_avatar", "ua.role as role", "sc.id as service_center_id", "sc.name as service_center_name", "sc.logo", "sc.qr_code", "sc.location", "sc.type", "ua.password")
                .leftJoin("service_center as sc", "ua.service_center_id", "sc.id")
                .where(function () {
                if (email) {
                    this.where({ "ua.email": email });
                }
                if (id) {
                    this.where({ "ua.id": id });
                }
            });
        });
    }
    // update single admin
    updateSingleAdmin(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = where;
            return yield this.db("user_admin ")
                .withSchema(this.SERVICE_SCHEMA)
                .update(payload)
                .where(function () {
                if (email) {
                    this.where({ email });
                }
                if (id) {
                    this.where({ id });
                }
            });
        });
    }
}
exports.default = UpcServiceCenterModel;
