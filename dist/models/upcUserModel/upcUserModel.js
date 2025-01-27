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
class UpcUserModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("upc_user").withSchema(this.UPC).insert(payload, "id");
        });
    }
    // get all employee
    getAllUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, key, status } = payload;
            const dtbs = this.db("upc_user");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.UPC)
                .select("id", "name", "phone", "email", "country", "city", "created_at", "status")
                .where(function () {
                if (status) {
                    this.andWhere({ status });
                }
            })
                .andWhere(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`).orWhere("email", "like", `%${key}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("upc_user")
                .withSchema(this.UPC)
                .count("id as total")
                .where(function () {
                if (key) {
                    this.andWhere("name", "like", `%${key}%`).orWhere("email", "like", `%${key}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // get single user
    getSingleUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = payload;
            return yield this.db("upc_user")
                .withSchema(this.UPC)
                .select("id", "name", "phone", "email", "password", "photo", "nid_front", "nid_back", "country", "city", "address", "status", "created_at")
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
    // update user
    updateUser(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email } = where;
            return yield this.db("upc_user")
                .withSchema(this.UPC)
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
    // update user card
    updateUserCard(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = where;
            return yield this.db("card_user")
                .withSchema(this.UPC)
                .update(payload)
                .where({ id });
        });
    }
    // card in user
    cardAddInCardUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_user")
                .withSchema(this.UPC)
                .insert(payload, "id");
        });
    }
    // insert card amenities in card user amenities table
    insertCardAmenitiesInCardUserAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_user_amenities")
                .withSchema(this.UPC)
                .insert(payload);
        });
    }
    // // get single user cards
    // public async getSingleUserCards(upc_user_id: number) {
    //   return await this.db("upc_user_view")
    //     .withSchema(this.UPC)
    //     .select("user_cards")
    //     .where({ id: upc_user_id });
    // }
    // get all card by user v2
    getAllCardByUser(upc_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("card_user as cu")
                .withSchema(this.UPC)
                .select("cu.id", "cu.card_id", "c.name", "cu.expire_date", "cu.status", "cu.card_number")
                .leftJoin("card as c", "cu.card_id", "c.id")
                .where({ "cu.upc_user_id": upc_user_id });
        });
    }
    // get all other card by user
    getAllOtherCardByUser(upc_user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("other_card as oc")
                .withSchema(this.UPC)
                .select("oc.id", "oc.card_number", "oc.card_holder_name", "oc.expire_date", "oc.status", "oc.card_type")
                .where({ "oc.upc_user_id": upc_user_id });
        });
    }
    // get single card by user
    getSingleCardByUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { upc_user_id, card_id } = payload;
            return yield this.db("card_user as ucu")
                .withSchema(this.UPC)
                .select("ucu.id as card_user_id", "cuv.card_id", "cuv.card_name", "cuv.card_user_amenities")
                .leftJoin("card_user_view as cuv", "ucu.id", "cuv.id")
                .where(function () {
                if (upc_user_id) {
                    this.andWhere("ucu.upc_user_id", upc_user_id);
                }
                if (card_id) {
                    this.andWhere("ucu.card_id", card_id);
                }
            });
        });
    }
    // get single card by user
    getUsedAminitesBySingleUserAndCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { upc_user_id, card_id } = payload;
            return yield this.db("card_used_amenities_view ")
                .withSchema(this.UPC)
                .select("card_id", "user_card_used_amenities")
                .where(function () {
                if (upc_user_id) {
                    this.andWhere("upc_user_id", upc_user_id);
                }
                if (card_id) {
                    this.andWhere("card_id", card_id);
                }
            });
        });
    }
}
exports.default = UpcUserModel;
