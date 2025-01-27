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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class EmployeeLeadModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // get all lead by current date
    getCurrentDayAllLead(organization_id, { limit, skip, assign_by, searchPrm, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const endDate = new Date(currentDate);
            endDate.setHours(23, 59, 59, 999);
            const offsetMillis = currentDate.getTimezoneOffset() * 60 * 1000;
            const startDateISO = new Date(currentDate.getTime() - offsetMillis).toISOString();
            const endDateISO = new Date(endDate.getTime() - offsetMillis).toISOString();
            console.log({ startDateISO, endDateISO });
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("id", "city_name", "country_name", "source_name", "product_name", "org_name", "team_name", "reference", "area_name", "product_name", "org_type_name", "contact_person", "contact_lead", "contact_number", "lead_assigns_emp")
                .where("organization_id", organization_id)
                .andWhereRaw("(contact_lead->>'status') = ?", ["positive_lead"])
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [assign_by])
                .andWhereRaw("(contact_lead->>'forward_status')::int = ?", [0])
                .andWhereRaw("CAST(contact_lead->>'follow_up_date' AS DATE) BETWEEN ? AND ?", [startDateISO, endDateISO])
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .where("organization_id", organization_id)
                .andWhereRaw("(contact_lead->>'status') = ?", ["positive_lead"])
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [assign_by])
                .andWhereRaw("(contact_lead->>'forward_status')::int = ?", [0])
                .andWhereRaw("CAST(contact_lead->>'follow_up_date' AS DATE) BETWEEN ? AND ?", [startDateISO, endDateISO])
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // get all after sale lead by current date
    getCurrentDayAllAfterSaleLead(organization_id, { limit, skip, assign_to, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("after_sales as afs");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("afs.id", "afs.lead_id", "afs.assign_to", "afs.follow_up_date", "afs.note as after_sale_note", "afs.paying_amount", "afs.type", "afs.after_sale_lead_status", "afs.service_provided", "lv.contact_person", "lv.contact_email", "lv.org_name", "pr.name as product_name", "sr.name as source_name")
                .where("afs.organization_id", organization_id)
                .andWhere("afs.assign_to", assign_to)
                .leftJoin("lead as lv", "lv.id", "=", "afs.lead_id")
                .leftJoin("product as pr", "lv.product_id", "=", "pr.id")
                .leftJoin("source as sr", "lv.source_id", "=", "sr.id")
                .andWhereBetween("afs.follow_up_date", [
                currentDate.toISOString(),
                endDate.toISOString(),
            ])
                .orderBy("id", "desc");
            const total = yield this.db("after_sales as afs")
                .withSchema(this.CRM_SCHEMA)
                .count("afs.id as total")
                .where("afs.organization_id", organization_id)
                .andWhere("afs.assign_to", assign_to)
                .leftJoin("lead as lv", "lv.id", "=", "afs.lead_id")
                .leftJoin("product as pr", "lv.product_id", "=", "pr.id")
                .leftJoin("source as sr", "lv.source_id", "=", "sr.id")
                .andWhereBetween("afs.follow_up_date", [
                currentDate.toISOString(),
                endDate.toISOString(),
            ]);
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // ge all forwareded lead list
    getAllReceivedLead(organization_id, { limit, skip, assign_by, searchPrm, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("*")
                .withSchema(this.CRM_SCHEMA)
                .where("organization_id", organization_id)
                .whereRaw("(contact_lead->>'forward_status')::int = 1")
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(contact_lead_forward::jsonb) AS lead_forward
      WHERE (lead_forward->>'forwarded_to')::int = ?
    )
  `, [assign_by])
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .where("organization_id", organization_id)
                .whereRaw("(contact_lead->>'forward_status')::int = 1")
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(contact_lead_forward::jsonb) AS lead_forward
      WHERE (lead_forward->>'forwarded_to')::int = ?
    )
  `, [assign_by])
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // all assigned lead list
    AllAssignedLeadList(organization_id, { limit, skip, searchPrm, assign_by, status, sec_status, third_status, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("id", "city_name", "country_name", "source_name", "source_id", "product_name", "area_name", "product_id", "org_type_name", "org_type_id", "contact_person", "contact_lead", "contact_number", "team_id", "team_name", "created_at", "reference", "org_name", "lead_assigns_emp", "lead_organization_id", "lead_sale")
                .where("organization_id", organization_id)
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [assign_by])
                .andWhere(function () {
                if (status)
                    this.andWhereRaw("(contact_lead->>'status') = ?", [status]);
                if (sec_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [sec_status]);
                }
                if (third_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [third_status]);
                }
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .where("organization_id", organization_id)
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [assign_by])
                .andWhere(function () {
                if (status)
                    this.andWhereRaw("(contact_lead->>'status') = ?", [status]);
                if (sec_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [sec_status]);
                }
                if (third_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [third_status]);
                }
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // all after sales lead list
    AllAfterSalesLeadList(organization_id, { limit, skip, searchPrm, assign_to, service_provided, sec_status, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("after_sales as afs");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("afs.id", "afs.lead_id", "afs.assign_to", "afs.follow_up_date", "afs.note as after_sale_note", "afs.paying_amount", "afs.type", "afs.targeted_amount", "afs.after_sale_lead_status", "afs.service_provided", "lv.contact_person", "lv.contact_email", "lv.contact_number", "ot.name as org_type_name", "lv.org_name", "lv.reference", "tm.team_name", "pr.name as product_name", "sr.name as source_name", "ls.sale_amount", "ls.paid_amount", "ls.due_amount")
                .leftJoin("lead as lv", "lv.id", "=", "afs.lead_id")
                .joinRaw("LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id")
                .leftJoin("product as pr", "lv.product_id", "=", "pr.id")
                .leftJoin("source as sr", "lv.source_id", "=", "sr.id")
                .leftJoin("lead_sale as ls", "lv.id", "=", "ls.lead_id")
                .leftJoin("lead_organization as lo", "lv.lead_organization_id", "lo.id")
                .leftJoin("org_type as ot", "lv.org_type_id", "ot.id")
                .where("afs.organization_id", organization_id)
                .andWhere("afs.assign_to", assign_to)
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("pr.name", "ilike", `%${searchPrm}%`)
                        .orWhere("lo.lead_org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("ot.name", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("sr.name", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("after_sales as afs")
                .withSchema(this.CRM_SCHEMA)
                .count("afs.id as total")
                .leftJoin("lead as lv", "lv.id", "=", "afs.lead_id")
                .joinRaw("LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id")
                .leftJoin("product as pr", "lv.product_id", "=", "pr.id")
                .leftJoin("source as sr", "lv.source_id", "=", "sr.id")
                .leftJoin("lead_sale as ls", "lv.id", "=", "ls.lead_id")
                .leftJoin("lead_organization as lo", "lv.lead_organization_id", "lo.id")
                .leftJoin("org_type as ot", "lv.org_type_id", "ot.id")
                .where("afs.organization_id", organization_id)
                .andWhere("afs.assign_to", assign_to)
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("pr.name", "ilike", `%${searchPrm}%`)
                        .orWhere("lo.lead_org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("ot.name", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_number", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("lv.contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("sr.name", "ilike", `%${searchPrm}%`);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    //update after sale lead
    updateAfterSaleLead(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateAfterSale = yield this.db("after_sales as afs")
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
            return updateAfterSale;
        });
    }
    // get single after sale
    getSingleAfterSale(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const getSingleAfterSale = yield this.db("after_sales as afs")
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .select("*");
            return getSingleAfterSale;
        });
    }
    // get contact history by lead id
    getContactHistoryByLeadId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_contact_lead as hcl")
                .withSchema(this.CRM_SCHEMA)
                .select("hcl.id", "hcl.phone_call", "emp.name as call_by", "hcl.follow_up_date as call_date", "hcl.call_note")
                .joinRaw("JOIN crm.employee AS emp ON hcl.assign_lead = emp.id")
                .where({ "hcl.lead_id": id })
                .orderBy("hcl.lead_id", "desc");
        });
    }
    // get visit history by lead id
    getVisitHistoryByLeadId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_visit as visit")
                .withSchema(this.CRM_SCHEMA)
                .select("visit.id", "employee.name as visit_by", "visit.visit_date", "visit.visit_note")
                .join("contact_lead as cl", "visit.lead_id", "cl.lead_id")
                .joinRaw("JOIN crm.employee AS employee ON cl.assign_lead = employee.id")
                .where({ "visit.lead_id": id })
                .orderBy("visit.lead_id", "desc");
        });
    }
    // get forward history by lead id
    getHistoryForwardLeadByLeadId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_forward as frd")
                .withSchema(this.CRM_SCHEMA)
                .select("frd.id", "employee.name as forward_to", "secemp.name as forward_by", "frd.created_at as forward_date", "frd.forward_note")
                .joinRaw("JOIN crm.employee AS employee ON frd.forward_to = employee.id")
                .joinRaw("JOIN crm.employee AS secemp ON frd.forward_by = secemp.id")
                .where({ "frd.lead_id": id })
                .orderBy("frd.id", "desc");
        });
    }
    // get agreement history by lead id
    getAgreementHistoryLeadByLeadId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_agreement_paper as agr")
                .withSchema(this.CRM_SCHEMA)
                .select("agr.id", "employee.name as sent_by", "agr.created_at as sent_time", "agr.paper_sent_note")
                .join("contact_lead as cl", "agr.lead_id", "cl.lead_id")
                .joinRaw("JOIN crm.employee AS employee ON cl.assign_lead = employee.id")
                .where({ "agr.lead_id": id })
                .orderBy("agr.lead_id", "desc");
        });
    }
    // get demo history by lead id
    getDemoHistoryLeadByLeadId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_demo_link as demo")
                .withSchema(this.CRM_SCHEMA)
                .select("demo.id", "employee.name as sent_by", "demo.created_at as sent_time", "demo.demo_sent_note")
                .join("contact_lead as cl", "demo.lead_id", "cl.lead_id")
                .joinRaw("JOIN crm.employee AS employee ON cl.assign_lead = employee.id")
                .where({ "demo.lead_id": id })
                .orderBy("demo.lead_id", "desc");
        });
    }
    // update engage location
    EngageLeadLocation(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead").withSchema(this.CRM_SCHEMA);
            const updates = {};
            if (payload === null || payload === void 0 ? void 0 : payload.area_id) {
                updates.area_id = payload.area_id;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.city_id) {
                yield this.db("area")
                    .withSchema(this.CRM_SCHEMA)
                    .where({ "area.city_id": payload.city_id })
                    .update({ city_id: payload.city_id });
            }
            if (payload === null || payload === void 0 ? void 0 : payload.country_id) {
                yield this.db("city")
                    .withSchema(this.CRM_SCHEMA)
                    .where({ "city.country_id": payload.country_id })
                    .update({ country_id: payload.country_id });
            }
            if (Object.keys(updates).length > 0) {
                yield dtbs.where({ "lead.id": id }).update(updates);
            }
        });
    }
    // engage product / source
    EngageLeadProductAndSource(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead").withSchema(this.CRM_SCHEMA);
            const updates = {};
            if (payload === null || payload === void 0 ? void 0 : payload.product_id) {
                updates.product_id = payload.product_id;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.source_id) {
                updates.source_id = payload.source_id;
            }
            if (Object.keys(updates).length > 0) {
                yield dtbs.where({ "lead.id": id }).update(updates);
            }
        });
    }
    // engage organization info
    EngageLeadOrganization(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead").withSchema(this.CRM_SCHEMA);
            const updates = {};
            if (payload === null || payload === void 0 ? void 0 : payload.org_type_id) {
                updates.org_type_id = payload.org_type_id;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.org_name) {
                updates.org_name = payload.org_name;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.org_address) {
                updates.org_address = payload.org_address;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.contact_person) {
                updates.contact_person = payload.contact_person;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.contact_email) {
                updates.contact_email = payload.contact_email;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.contact_number) {
                updates.contact_number = payload.contact_number;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.additional_contact_number) {
                updates.additional_contact_number = payload.additional_contact_number;
            }
            if (Object.keys(updates).length > 0) {
                yield dtbs.where({ "lead.id": id }).update(updates);
            }
        });
    }
    // engage contact lead history
    EngageContactLeadHistory(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("history_contact_lead").withSchema(this.CRM_SCHEMA);
            const CDtbs = this.db("contact_lead").withSchema(this.CRM_SCHEMA);
            const updates = {};
            if (payload === null || payload === void 0 ? void 0 : payload.follow_up_date) {
                updates.follow_up_date = payload === null || payload === void 0 ? void 0 : payload.follow_up_date;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.follow_up) {
                updates.follow_up = payload === null || payload === void 0 ? void 0 : payload.follow_up;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.status) {
                updates.status = payload === null || payload === void 0 ? void 0 : payload.status;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.phone_call) {
                updates.phone_call = payload === null || payload === void 0 ? void 0 : payload.phone_call;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.call_note) {
                updates.call_note = payload === null || payload === void 0 ? void 0 : payload.call_note;
            }
            if (payload === null || payload === void 0 ? void 0 : payload.description) {
                updates.description = payload === null || payload === void 0 ? void 0 : payload.description;
            }
            if (id) {
                updates.lead_id = id;
            }
            if (Object.keys(updates).length > 0) {
                yield dtbs.insert(updates);
                const { lead_id } = updates, updateInfo = __rest(updates, ["lead_id"]);
                yield CDtbs.where({ "contact_lead.lead_id": id }).update(updateInfo);
            }
        });
    }
    // engage lead aggreement
    EngageLeadAgreementHistory(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(payload).length > 0) {
                return yield this.db("history_lead_agreement_paper")
                    .withSchema(this.CRM_SCHEMA)
                    .insert(payload);
            }
        });
    }
    // engage lead demoLink
    LeadDemoLink(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.keys(payload).length > 0) {
                return yield this.db("history_lead_demo_link")
                    .withSchema(this.CRM_SCHEMA)
                    .insert(payload);
            }
        });
    }
    // engage visit
    EngageLeadVisit(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // const updates: Partial<IEngageLeadVisit> = {};
            // if (payload?.visit_note) {
            //   updates.visit_note = payload?.visit_note;
            // }
            // if (payload?.visit_status) {
            //   updates.visit_status = payload.visit_status;
            // }
            // if (payload?.visit_date) {
            //   updates.visit_date = payload.visit_date;
            // }
            if (Object.keys(payload).length > 0) {
                return yield this.db("history_lead_visit")
                    .withSchema(this.CRM_SCHEMA)
                    .insert(payload);
            }
        });
    }
    // insert history lead forward
    insertHistoryLeadForward(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db("history_lead_forward")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // get employee monthly target
    getEmployeeMonthlyTarget(organization_id, id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("month_assign_view")
                .withSchema(this.CRM_SCHEMA)
                .select("phone_call", "visit", "sale_in_amount as sale_amount", "month", "product_target")
                .where({ organization_id })
                .andWhere({ emp_id: id })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("month", [from_date, to_date]);
                }
            });
        });
    }
    // get employee lead counts
    getEmployeeLeadCount(organization_id, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("first");
            const result = yield this.db("lead")
                .withSchema(this.CRM_SCHEMA)
                .where("organization_id", organization_id)
                .select(this.db.raw("COUNT(DISTINCT CASE WHEN contact_lead.status = 'negative_lead' THEN lead.id END) as negative_lead"), this.db.raw("COUNT(DISTINCT CASE WHEN contact_lead.status = 'positive_lead' THEN lead.id END) as positive_lead"), this.db.raw("COUNT(DISTINCT CASE WHEN lead_sale.lead_id IS NOT NULL THEN lead.id END) as sold_lead"), this.db.raw("COUNT(DISTINCT lead.id) as total_lead"))
                .where({ "cla.assign_lead_emp_id": id })
                .leftJoin("contact_lead", "lead.id", "contact_lead.lead_id")
                .leftJoin("contact_lead_assign as cla", "contact_lead.id", "cla.cl_id")
                .leftJoin("lead_sale", "lead.id", "lead_sale.lead_id")
                .first();
            const countInfo = {
                negative_lead: parseInt(result.negative_lead),
                positive_lead: parseInt(result.positive_lead),
                sold_lead: parseInt(result.sold_lead),
                total_lead: parseInt(result.total_lead),
            };
            return { data: countInfo };
        });
    }
    //
    getCurrentDayPhoneCallStatistics(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            const formattedCurrentDate = currentDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
            const total = yield this.db("history_contact_lead as hcl")
                .withSchema(this.CRM_SCHEMA)
                .count("hcl.id as total")
                .leftJoin("lead", "hcl.lead_id", "lead.id")
                .where("hcl.assign_lead", id)
                .andWhere("hcl.phone_call", 1)
                .andWhereBetween("hcl.created_at", [
                formattedCurrentDate,
                formattedEndDate,
            ]);
            return total;
        });
    }
    // get current day sale statistics
    getCurrentDaySaleStatistics(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            const formattedCurrentDate = currentDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
            const total = yield this.db("lead_sale as ls")
                .withSchema(this.CRM_SCHEMA)
                .count("ls.id as total")
                .join("lead as ld", "ls.lead_id", "ld.id")
                .join("contact_lead as cl", "ls.lead_id", "cl.lead_id")
                .where("ls.sale_by", id)
                .andWhereBetween("ls.created_at", [
                formattedCurrentDate,
                formattedEndDate,
            ]);
            return total;
        });
    }
    // get current day visit statistics
    getCurrentDayVisitStatistics(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            const formattedCurrentDate = currentDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
            const total = yield this.db("history_lead_visit as hlv")
                .withSchema(this.CRM_SCHEMA)
                .count("hlv.id as total")
                .leftJoin("lead as ld", "hlv.lead_id", "ld.id")
                .where("hlv.assign_lead", id)
                .andWhereBetween("hlv.created_at", [
                formattedCurrentDate,
                formattedEndDate,
            ]);
            return total;
        });
    }
    // get current day demo link statistics
    getCurrentDayDemoLinkStatistics(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(endDate.getDate() + 1);
            const formattedCurrentDate = currentDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];
            const total = yield this.db("history_lead_demo_link as hdl")
                .withSchema(this.CRM_SCHEMA)
                .count("hdl.id as total")
                .join("lead as ld", "hdl.lead_id", "ld.id")
                .join("contact_lead as cl", "hdl.lead_id", "cl.lead_id")
                .where("hdl.assign_lead", id)
                .andWhereBetween("hdl.created_at", [
                formattedCurrentDate,
                formattedEndDate,
            ]);
            return total;
        });
    }
    // get fill up motnth report
    fillUpMonthReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, organization_id, emp_id } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const formattedFromDate = from_date && to_date
                ? new Date(from_date)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : "";
            const formattedEndDate = from_date && to_date
                ? endDate.toISOString().slice(0, 19).replace("T", " ")
                : "";
            const leadDtbs = this.db("employee as e");
            // return data
            return yield leadDtbs
                .withSchema(this.CRM_SCHEMA)
                .select("e.id as employee_id", "e.name as employee", this.db.raw(`
            (
                SELECT json_build_object(
                    'phone_call', COALESCE(SUM(amt.phone_call), 0),
                    'visit', COALESCE(SUM(amt.visit), 0),
                    'sale', COALESCE(SUM(amt.sale), 0),
                    'sale_amount', COALESCE(SUM(amt.sale_in_amount), 0)
                )
                FROM ?? AS amt
                WHERE amt.employee_id = e.id
                ${formattedFromDate && formattedEndDate
                ? `AND amt.month BETWEEN ? AND ?`
                : ""}
            ) AS monthly_target`, formattedFromDate && formattedEndDate
                ? [
                    `${this.CRM_SCHEMA}.assign_monthly_target`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.assign_monthly_target`]), this.db.raw(`
    (
        SELECT COUNT(*)
        FROM ?? AS ls
        JOIN ?? AS l ON ls.lead_id = l.id
        WHERE ls.sale_by = e.id
            AND ls.lead_id IS NOT NULL
            ${formattedFromDate && formattedEndDate
                ? `AND ls.sale_time BETWEEN ? AND ?`
                : ""}
    ) AS fillup_sold`, formattedFromDate && endDate
                ? [
                    `${this.CRM_SCHEMA}.lead_sale`,
                    `${this.CRM_SCHEMA}.lead`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]), this.db.raw(`
    (
        SELECT COALESCE(SUM(ls.paid_amount), 0)
        FROM ?? AS ls
        JOIN ?? AS l ON ls.lead_id = l.id
        WHERE ls.sale_by = e.id
            AND ls.lead_id IS NOT NULL
            ${formattedFromDate && formattedEndDate
                ? `AND ls.sale_time BETWEEN ? AND ?`
                : ""}
    ) AS fillup_total_sale_amount`, formattedFromDate && endDate
                ? [
                    `${this.CRM_SCHEMA}.lead_sale`,
                    `${this.CRM_SCHEMA}.lead`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]), this.db.raw(`
    (
        SELECT count(*)
        FROM ?? AS hcl
        WHERE hcl.assign_lead = e.id
            AND hcl.phone_call = '1'
            ${formattedFromDate && formattedEndDate
                ? `AND hcl.created_at BETWEEN ? AND ?`
                : ""}
    ) AS fillup_phone_call`, formattedFromDate && formattedEndDate
                ? [
                    `${this.CRM_SCHEMA}.history_contact_lead`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.history_contact_lead`]), this.db.raw(`
    (
        SELECT count(*)
        FROM ?? AS visit
        WHERE visit.assign_lead = e.id
            ${formattedFromDate && formattedEndDate
                ? `AND visit.created_at BETWEEN ? AND ?`
                : ""}
    ) AS fillup_visit`, formattedFromDate && formattedEndDate
                ? [
                    `${this.CRM_SCHEMA}.history_lead_visit`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.history_lead_visit`])
            //     this.db.raw(
            //       `
            // (
            //     SELECT JSON_AGG(JSON_BUILD_OBJECT('product_id',l.product_d,''))
            //     FROM ?? AS ls
            //     JOIN ?? AS l ON ls.lead_id = l.id
            //     JOIN crm.product as pd on l.product_id = pd.id
            //     WHERE ls.sale_by = e.id
            //         AND ls.lead_id IS NOT NULL
            //         ${
            //           formattedFromDate && formattedEndDate
            //             ? `AND ls.sale_time BETWEEN ? AND ?`
            //             : ""
            //         }
            // ) AS fillup_sold`,
            //       formattedFromDate && endDate
            //         ? [
            //             `${this.CRM_SCHEMA}.lead_sale`,
            //             `${this.CRM_SCHEMA}.lead`,
            //             formattedFromDate,
            //             formattedEndDate,
            //           ]
            //         : [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]
            //     )
            )
                .where("e.organization_id", organization_id)
                .andWhere("e.id", emp_id);
        });
    }
    fillUpMonthProductReport(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, organization_id, emp_id } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const formattedFromDate = from_date && to_date
                ? new Date(from_date)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : "";
            const formattedEndDate = from_date && to_date
                ? endDate.toISOString().slice(0, 19).replace("T", " ")
                : "";
            const leadDtbs = this.db("employee as e");
            // return data
            return yield leadDtbs
                .withSchema(this.CRM_SCHEMA)
                .select("e.id as employee_id", "e.name as employee", this.db.raw(`
      (
          SELECT JSON_AGG(subquery)
          FROM (
              SELECT 
                  l.product_id, 
                  pd.name,
                  COUNT(l.product_id) AS total_sold
              FROM ?? AS ls
              JOIN ?? AS l ON ls.lead_id = l.id
              JOIN crm.product AS pd ON l.product_id = pd.id
              WHERE ls.sale_by = e.id
                  AND ls.lead_id IS NOT NULL
                  ${formattedFromDate && formattedEndDate
                ? `AND ls.sale_time BETWEEN ? AND ?`
                : ""}
              GROUP BY l.product_id,pd.name
          ) AS subquery
      ) AS fillup_pd_sold`, formattedFromDate && formattedEndDate
                ? [
                    `${this.CRM_SCHEMA}.lead_sale`,
                    `${this.CRM_SCHEMA}.lead`,
                    formattedFromDate,
                    formattedEndDate,
                ]
                : [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]))
                .where("e.organization_id", organization_id)
                .andWhere("e.id", emp_id);
        });
    }
    // is lead sold
    isLeadSold(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_sale")
                .select("*")
                .withSchema(this.CRM_SCHEMA)
                .where({ "lead_sale.lead_id": id });
        });
    }
    // is lead exist
    isLeadExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const soldLead = yield this.db("lead")
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .where({ "lead.id": id })
                .first();
            return { data: soldLead };
        });
    }
}
exports.default = EmployeeLeadModel;
