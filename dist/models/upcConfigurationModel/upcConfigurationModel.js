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
class UpcConfigurationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create amenities
    createAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("amenities").withSchema(this.UPC).insert(payload);
        });
    }
    // get all amenities
    getAllAmenities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, limit, skip, ids } = payload;
            const dtbs = this.db("amenities");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.UPC)
                .select("*")
                .where(function () {
                if (name) {
                    this.where("name", "like", `%${name}%`);
                }
                if (ids) {
                    this.whereIn("id", ids);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("amenities")
                .withSchema(this.UPC)
                .count("id as total")
                .where(function () {
                if (name) {
                    this.where("name", "like", `%${name}%`);
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
    // get single amenities
    getSingleAmenities(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("amenities")
                .withSchema(this.UPC)
                .select("*")
                .where({ id });
        });
    }
    // update amenities
    updateAmenities(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("amenities")
                .withSchema(this.UPC)
                .update(payload)
                .where({ id });
        });
    }
}
exports.default = UpcConfigurationModel;
