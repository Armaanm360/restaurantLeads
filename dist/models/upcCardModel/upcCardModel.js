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
class UpcCardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create card
    createCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card").withSchema(this.UPC).insert(payload, "id");
        });
    }
    // get all card
    getAllCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, name, ids } = payload;
            const dtbs = this.db("card");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.UPC)
                .select("id", "name", "status")
                .where(function () {
                if (name) {
                    this.andWhere({ name });
                }
                if (ids) {
                    this.whereIn("id", ids);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("card")
                .withSchema(this.UPC)
                .count("id as total")
                .where(function () {
                if (name) {
                    this.andWhere({ name });
                }
                if (ids) {
                    this.whereIn("id", ids);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single card
    getSingleCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_view")
                .withSchema(this.UPC)
                .select("*")
                .andWhere({ id });
        });
    }
    updateCard(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card")
                .withSchema(this.UPC)
                .update(payload)
                .where({ id });
        });
    }
    // amenities added in card
    amenitiesAddInCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_amenities")
                .withSchema(this.UPC)
                .insert(payload, "id");
        });
    }
    // delete amenities card
    deleteAmenitiesInCard(card_id, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_amenities")
                .withSchema(this.UPC)
                .whereIn("id", ids)
                .andWhere({ card_id })
                .del();
        });
    }
    // card check in
    insertCardCheckIn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_check_in")
                .withSchema(this.SERVICE_SCHEMA)
                .insert(payload, "id");
        });
    }
    // card check in items
    insertCardCheckInItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_check_in_items")
                .withSchema(this.SERVICE_SCHEMA)
                .insert(payload);
        });
    }
    // get all card reedem items
    getAllReedemItems(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { upc_user_id, card_id, limit, skip } = where;
            const dtbs = this.db("card_check_in_view_v2");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.SERVICE_SCHEMA)
                .select("id", "card_id", "card_name", "service_center_name", "status", "other_card_id", "paid_amount", "card_type")
                .where(function () {
                if (upc_user_id) {
                    this.andWhere({ upc_user_id });
                }
                if (card_id) {
                    this.andWhere({ card_id });
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("card_check_in_view_v2")
                .withSchema(this.SERVICE_SCHEMA)
                .count("id as total")
                .where(function () {
                if (upc_user_id) {
                    this.andWhere({ upc_user_id });
                }
                if (card_id) {
                    this.andWhere({ card_id });
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single reedem by id
    getSingleReedem(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = where;
            return yield this.db("card_check_in_view_v2")
                .withSchema(this.SERVICE_SCHEMA)
                .select("id", "card_id", "card_name", "service_center_name", "card_type", "status", "check_in_items")
                .where(function () {
                if (id) {
                    this.andWhere({ id });
                }
            });
        });
    }
    // ==================== other card ====================//
    // insert other card
    addOtherCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("other_card").withSchema(this.UPC).insert(payload);
        });
    }
    // get all other card
    getAllOtherCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { upc_user_id, card_type, card_number, status } = payload;
            return yield this.db("other_card")
                .withSchema(this.UPC)
                .select("id", "card_number", "expire_date", "card_holder_name", "card_type")
                .where({ upc_user_id })
                .andWhere(function () {
                if (card_type) {
                    this.andWhere({ card_type });
                }
                if (card_number) {
                    this.andWhere({ card_number });
                }
                if (status) {
                    this.andWhere({ status });
                }
            });
        });
    }
    // get single other card
    getSingleOtherCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = payload;
            return yield this.db("other_card")
                .withSchema(this.UPC)
                .select("id", "card_number", "expire_date", "card_holder_name", "card_type")
                .where({ id });
        });
    }
}
exports.default = UpcCardModel;
