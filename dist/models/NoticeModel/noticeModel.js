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
class NoticeModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // create notice
    createNotice(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notice")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    // update notice
    updateNotice(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("notice")
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ id: where.id })
                .andWhere({ org_id: where.org_id });
        });
    }
    //   get all notice
    getAllNotice({ org_id, searchPrm, status, limit, skip, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("notice").withSchema(this.CRM_SCHEMA);
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("id", "title", "description", "docs", "created_at", "status")
                .where({ org_id })
                .andWhere(function () {
                if (status) {
                    this.andWhere({ status });
                }
                if (searchPrm) {
                    this.andWhere("title", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("notice")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .where({ org_id })
                .andWhere(function () {
                if (status) {
                    this.andWhere({ status });
                }
                if (searchPrm) {
                    this.andWhere("title", "ilike", `%${searchPrm}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    //   get single notice
    getSingleNotice(id, org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db("notice")
                .withSchema(this.CRM_SCHEMA)
                .select("id", "title", "description", "created_at", "status", "docs")
                .where({ org_id })
                .andWhere({ id });
        });
    }
}
exports.default = NoticeModel;
