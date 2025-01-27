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
class AdminModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //get single agent
    getSingleAdmin({ email, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start building the query
            const query = this.db('users')
                .withSchema(this.USER_SCHEMA)
                .select('*')
                .andWhere('user_type', 'admin');
            // If email is provided, add it to the query
            if (email) {
                query.where({ email });
            }
            // If id is provided, add it to the query
            if (id) {
                query.where({ id });
            }
            // Execute the query and return the result
            const data = yield query;
            return data;
        });
    }
    //register  agent
    createAgent(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('users')
                .withSchema(this.USER_SCHEMA)
                .insert(payload, 'id');
            return data;
        });
    }
    // all after sales lead list
    getClientProperties({ limit, skip }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('property_master_view as pmv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*'
            // 'afs.id',
            // 'afs.lead_id',
            // 'afs.assign_to',
            // 'afs.follow_up_date',
            // 'afs.note as after_sale_note',
            // 'afs.paying_amount',
            // 'afs.type',
            // 'afs.targeted_amount',
            // 'afs.after_sale_lead_status',
            // 'afs.service_provided',
            // 'lv.contact_person',
            // 'lv.contact_email',
            // 'lv.contact_number',
            // 'ot.name as org_type_name',
            // 'lv.org_name',
            // 'lv.reference',
            // 'tm.team_name',
            // 'pr.name as product_name',
            // 'sr.name as source_name',
            // 'ls.sale_amount',
            // 'ls.paid_amount',
            // 'ls.due_amount'
            )
                // .leftJoin('lead as lv', 'lv.id', '=', 'afs.lead_id')
                // .joinRaw('LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id')
                // .leftJoin('product as pr', 'lv.product_id', '=', 'pr.id')
                // .leftJoin('source as sr', 'lv.source_id', '=', 'sr.id')
                // .leftJoin('lead_sale as ls', 'lv.id', '=', 'ls.lead_id')
                // .leftJoin('lead_organization as lo', 'lv.lead_organization_id', 'lo.id')
                // .leftJoin('org_type as ot', 'lv.org_type_id', 'ot.id')
                // .where('afs.organization_id', organization_id)
                // .andWhere('afs.assign_to', assign_to)
                // .andWhere(function () {
                //   if (searchPrm) {
                //     this.andWhere('pr.name', 'ilike', `%${searchPrm}%`)
                //       .orWhere('lo.lead_org_name', 'ilike', `%${searchPrm}%`)
                //       .orWhere('ot.name', 'ilike', `%${searchPrm}%`)
                //       .orWhere('lv.contact_number', 'ilike', `%${searchPrm}%`)
                //       .orWhere('lv.contact_person', 'ilike', `%${searchPrm}%`)
                //       .orWhere('lv.contact_email', 'ilike', `%${searchPrm}%`)
                //       .orWhere('sr.name', 'ilike', `%${searchPrm}%`);
                //   }
                // })
                .orderBy('property_id', 'desc');
            const total = yield this.db('property_master_view as pmv')
                .withSchema(this.PROPERTY_SCHEMA)
                .count('pmv.property_id as total');
            // .leftJoin('lead as lv', 'lv.id', '=', 'afs.lead_id')
            // .joinRaw('LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id')
            // .leftJoin('product as pr', 'lv.product_id', '=', 'pr.id')
            // .leftJoin('source as sr', 'lv.source_id', '=', 'sr.id')
            // .leftJoin('lead_sale as ls', 'lv.id', '=', 'ls.lead_id')
            // .leftJoin('lead_organization as lo', 'lv.lead_organization_id', 'lo.id')
            // .leftJoin('org_type as ot', 'lv.org_type_id', 'ot.id')
            // .where('afs.organization_id', organization_id)
            // .andWhere('afs.assign_to', assign_to)
            // .andWhere(function () {
            //   if (searchPrm) {
            //     this.andWhere('pr.name', 'ilike', `%${searchPrm}%`)
            //       .orWhere('lo.lead_org_name', 'ilike', `%${searchPrm}%`)
            //       .orWhere('ot.name', 'ilike', `%${searchPrm}%`)
            //       .orWhere('lv.contact_number', 'ilike', `%${searchPrm}%`)
            //       .orWhere('lv.contact_person', 'ilike', `%${searchPrm}%`)
            //       .orWhere('lv.contact_email', 'ilike', `%${searchPrm}%`)
            //       .orWhere('sr.name', 'ilike', `%${searchPrm}%`);
            //   }
            // });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    getSingleProperty(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('property_master_view')
                .withSchema(this.PROPERTY_SCHEMA)
                .select('*')
                .where({ property_id: id });
        });
    }
    updateAdminProfile({ email, id, }, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('users')
                .withSchema(this.USER_SCHEMA)
                .update(payload, 'id')
                .where((qb) => {
                if (id) {
                    qb.andWhere('id', id);
                }
            });
        });
    }
}
exports.default = AdminModel;
