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
// lead model
class CRMLeadModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // created initial lead
    addLead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    checkOrganizationNameExists(organization_id, lead_organization_name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_organization")
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .where("organization_id", organization_id)
                .andWhereRaw('LOWER("lead_org_name") = ?', lead_organization_name);
        });
    }
    addOrganization(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_organization")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    // get all lead
    checkLead(organization_id, { limit, skip, searchPrm, product_id, contact_number, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .select("id", "city_name", "country_name", "source_name", "source_id", "product_name", "area_name", "product_id", "org_type_name", "org_type_id", "contact_person", "contact_lead", "contact_number", "team_id", "team_name", "created_at", "reference", "org_name", "lead_organization_id", "lead_sale")
                .where(function () {
                if (searchPrm) {
                    const lowerSearchPrm = searchPrm.toLowerCase();
                    this.andWhereRaw('LOWER("org_name") = ?', lowerSearchPrm);
                }
                if (product_id) {
                    this.andWhere("product_id", product_id);
                }
                if (contact_number) {
                    this.andWhere("contact_number", contact_number);
                }
            });
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .count("id as total")
                .andWhere(function () {
                if (searchPrm) {
                    const lowerSearchPrm = searchPrm.toLowerCase();
                    this.andWhereRaw('LOWER("org_name") = ?', lowerSearchPrm);
                }
                if (product_id) {
                    this.andWhere("product_id", product_id);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // get all lead
    getAllLead(organization_id, { limit, skip, searchPrm, status, sec_status, third_status, team_id, emp_id, from_date, to_date, product_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .select("id", "city_name", "country_name", "source_name", "source_id", "product_name", "area_name", "product_id", "org_type_name", "org_type_id", "contact_person", "contact_lead", "contact_number", "team_id", "team_name", "created_at", "reference", "org_name", "lead_assigns_emp", "lead_organization_id", "lead_sale")
                .where(function () {
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
                if (product_id) {
                    this.andWhere("product_id", product_id);
                }
                if (from_date && to_date) {
                    this.whereRaw("DATE(created_at) BETWEEN ? AND ?", [
                        from_date,
                        to_date,
                    ]);
                }
                if (emp_id) {
                    this.andWhere("created_by_emp", emp_id);
                }
                if (team_id) {
                    this.andWhere("team_id", team_id);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .count("id as total")
                .where(function () {
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
                if (product_id) {
                    this.andWhere("product_id", product_id);
                }
                if (from_date && to_date) {
                    this.whereRaw("DATE(created_at) BETWEEN ? AND ?", [
                        from_date,
                        to_date,
                    ]);
                }
                if (emp_id) {
                    this.andWhere("created_by_emp", emp_id);
                }
                if (team_id) {
                    this.andWhere("team_id", team_id);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // get all Team Wise Employee
    getAllLeadEmployee({ limit, skip, searchPrm, status, sec_status, third_status, emp_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("id", "city_name", "country_name", "source_name", "source_id", "product_name", "area_name", "product_id", "org_type_name", "org_type_id", "contact_person", "contact_lead", "contact_number", "team_id", "team_name", "created_at", "reference", "org_name", "lead_assigns_emp", "lead_organization_id", "lead_sale")
                .where(function () {
                if (status)
                    this.andWhereRaw("(contact_lead->>'status') = ?", [status]);
                if (sec_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [sec_status]);
                }
                if (third_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [third_status]);
                }
                if (emp_id) {
                    this.andWhere("created_by_emp", emp_id);
                }
            })
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`);
                }
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .andWhere(function () {
                if (status)
                    this.andWhereRaw("(contact_lead->>'status') = ?", [status]);
                if (sec_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [sec_status]);
                }
                if (third_status) {
                    this.orWhereRaw("(contact_lead->>'status') = ?", [third_status]);
                }
                if (emp_id) {
                    this.andWhere("created_by_emp", emp_id);
                }
            })
                .andWhere(function () {
                if (searchPrm) {
                    this.andWhere("product_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_name", "ilike", `%${searchPrm}%`)
                        .orWhere("org_type_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_person", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_email", "ilike", `%${searchPrm}%`)
                        .orWhere("source_name", "ilike", `%${searchPrm}%`)
                        .orWhere("contact_number", "ilike", `%${searchPrm}%`);
                }
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
    // get single lead
    getSingleLead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .where("id", id);
        });
    }
    // get single lead metting
    getSingleLeadTracking_view(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_tracking_view")
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .where("lead_id", id);
        });
    }
    // insert in lead tracking
    insertInLeadTracking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            payload.action_type = payload.action_type.toLocaleLowerCase();
            return yield this.db("lead_tracking")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    // insert in lead tracking assign emp
    // public async insertInLeadTrackingAssignEmp(payload: {
    //   lt_id: number;
    //   emp_id: number;
    // }) {
    //   return await this.db("lead_assign_emp_tracking")
    //     .withSchema(this.CRM_SCHEMA)
    //     .insert(payload);
    // }
    // get all lead tracking
    getAllLeadTracking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { lead_id, org_id, from_date, to_date, limit, skip, tracking_type } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("lead_tracking_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .select("id", "lead_id", "org_id", "lead_org_id", "lead_org_name", "meeting_id", "follow_up_date", "title", "action_type", "sale_amount", "paid_amount", "due_amount", "description", "tracking_type", "remarks", "payment_collection_date", "created_at", "call_note", "forward_note", "emp_id", "emp_name", "admin_id", "admin_name")
                .withSchema(this.CRM_SCHEMA)
                .where({ org_id })
                .andWhere({ lead_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("created_at", [from_date, endDate]);
                }
                if (tracking_type) {
                    this.andWhere("tracking_type", tracking_type);
                }
            })
                .orderBy("id", "asc");
            const total = yield this.db("lead_tracking_view")
                .count("id as total")
                .withSchema(this.CRM_SCHEMA)
                .where({ org_id })
                .andWhere({ lead_id })
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("created_at", [from_date, endDate]);
                }
                if (tracking_type) {
                    this.andWhere("tracking_type", tracking_type);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get all lead by emp id
    getAllLeadsByEmpId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, key, from_date, to_date, limit, skip } = payload;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const dtbs = this.db("lead_view as lv");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("lv.id as lead_id", "lv.source_id", "lv.source_name", "lv.product_name", "lv.org_type_name", "lv.lead_organization_id", "lv.product_id", "lv.org_type_id", "lv.org_name", "lv.created_at")
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [id])
                // .whereRaw("(contact_lead->>'assign_lead') = ?", [id])
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("lv.created_at", [from_date, endDate]);
                }
                if (key) {
                    this.andWhere("lv.org_name", "like", `%${key}%`);
                }
            })
                .orderBy("lv.id", "desc");
            const total = yield this.db("lead_view as lv")
                .count("lv.id as total")
                .withSchema(this.CRM_SCHEMA)
                .andWhereRaw(`
    EXISTS (
      SELECT 1
      FROM jsonb_array_elements(lead_assigns_emp::jsonb) AS assign
      WHERE (assign->>'emp_assign_id')::int = ?
    )
  `, [id])
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("lv.created_at", [from_date, endDate]);
                }
                if (key) {
                    this.andWhere("lv.org_name", "like", `%${key}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get lead by assign id
    getLeadByAssignLeadId({ id, limit, skip, contact_person, searchPrm, assign_lead, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("contact_lead");
            // get total row
            const Tdtbs = this.db("crm.contact_lead");
            const result = yield Tdtbs.count("* as total");
            const totalCount = parseInt(result[0].total) || 0;
            if (limit && skip) {
                dtbs.limit(limit);
                dtbs.offset(skip);
            }
            const data = yield this.db("contact_lead as c")
                .withSchema(this.CRM_SCHEMA)
                .select("lead.id as lead_id", "lead.contact_person", "lead.org_address", "lead.contact_email", "lead.contact_number", "lead.created_at", "lead.updated_at", "lead.additional_contact_number", "org_type.name as org_name", "area.name as area_name", "city.name as city_name", "country.name as country_name", "product.name as product_name", "employee.name as assign_lead_name", "c.description", "c.follow_up", "c.follow_up_date", "c.phone_call", "c.call_note", "c.status", "c.id")
                .joinRaw("LEFT JOIN crm.employee AS employee ON c.assign_lead = employee.id")
                .leftJoin("lead", "c.lead_id", "lead.id")
                .leftJoin("org_type", "lead.org_type_id", "org_type.id")
                .leftJoin("area", "lead.area_id", "area.id")
                .leftJoin("city", "area.city_id", "city.id")
                .leftJoin("country", "city.country_id", "country.id")
                .leftJoin("product", "lead.product_id", "product.id")
                .where({ "c.assign_lead": assign_lead })
                .andWhere(function () {
                if (contact_person) {
                    this.andWhere({ "lead.contact_person": contact_person });
                }
                if (searchPrm) {
                    const searchTerm = searchPrm.toLowerCase();
                    this.andWhere((builder) => {
                        builder
                            .whereRaw("LOWER(lead.contact_person) LIKE ?", [
                            `%${searchTerm}%`,
                        ])
                            .orWhereRaw("LOWER(lead.org_address) LIKE ?", [`%${searchTerm}%`])
                            .orWhereRaw("LOWER(lead.contact_email) LIKE ?", [
                            `%${searchTerm}%`,
                        ])
                            .orWhereRaw("LOWER(lead.contact_number) LIKE ?", [
                            `%${searchTerm}%`,
                        ])
                            .orWhereRaw("LOWER(product.name) LIKE ?", [`%${searchTerm}%`])
                            .orWhereRaw("LOWER(city.name) LIKE ?", [`%${searchTerm}%`])
                            .orWhereRaw("LOWER(country.name) LIKE ?", [`%${searchTerm}%`])
                            .orWhereRaw("LOWER(area.name) LIKE ?", [`%${searchTerm}%`]);
                    });
                }
            });
            return {
                data,
                // total: parseInt(total[0].total as string),
                total: totalCount,
            };
        });
    }
    // get lifetime report
    getLifeTimeReport(organization_id, { id, limit, skip, filter_by, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = [];
            // product data report
            if (filter_by === "product") {
                const pdDtbs = this.db("product");
                // Apply limit and skip if provided
                if (limit && skip) {
                    pdDtbs.limit(limit);
                    pdDtbs.offset(skip);
                }
                // Product data report
                returnData = yield pdDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("product.id as product_id", "product.name as product_name", this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.lead_sale ls
       JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
       WHERE l.product_id = product.id) AS sold`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.lead l
       WHERE l.product_id = product.id) AS total_leads`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.product_id = product.id
         AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
       JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
       WHERE l.product_id = product.id
         AND hcl.phone_call = '1') AS contact`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.product_id = product.id
         AND cl.status = 'negative_lead') AS negative`))
                    .where("product.organization_id", organization_id)
                    .groupBy("product.id", "product.name");
            }
            if (filter_by === "source") {
                const srcDtbs = this.db("source");
                if (limit && skip) {
                    srcDtbs.limit(limit);
                    srcDtbs.offset(skip);
                }
                // source data report
                returnData = yield srcDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("source.id as source_id", "source.name as source_name", this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.source_id = source.id
         AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
          (SELECT COUNT(*)
           FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
           JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
           WHERE l.source_id = source.id
             AND hcl.phone_call = '1') AS contact`), this.db.raw(`
          (SELECT COUNT(*)
           FROM ${this.CRM_SCHEMA}.lead_sale ls
           JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
           WHERE l.source_id = source.id) AS sold`), this.db.raw(`
          (SELECT COUNT(*)
           FROM ${this.CRM_SCHEMA}.contact_lead cl
           JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
           WHERE l.source_id = source.id
             AND cl.status = 'negative_lead') AS negative`), this.db.raw(`
      (SELECT COUNT(DISTINCT l.id)
       FROM ${this.CRM_SCHEMA}.lead l
       WHERE l.source_id = source.id) AS total_leads`))
                    .where("source.organization_id", organization_id)
                    .groupBy("source.id", "source.name");
            }
            if (filter_by === "org_type") {
                const orgDtbs = this.db("org_type");
                if (limit && skip) {
                    orgDtbs.limit(limit);
                    orgDtbs.offset(skip);
                }
                // organization data report
                returnData = yield orgDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("org_type.id as org_id", "org_type.name as org_name", this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
       JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         AND hcl.phone_call = '1'
        ) AS contact`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.lead_sale ls
       JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
       WHERE l.org_type_id = org_type.id) AS sold`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         AND cl.status = 'negative_lead') AS negative`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
      (SELECT COUNT(DISTINCT l.id)
       FROM ${this.CRM_SCHEMA}.lead l
       WHERE l.org_type_id = org_type.id) AS total_leads`))
                    .where("org_type.organization_id", organization_id)
                    .groupBy("org_type.id", "org_type.name");
            }
            if (filter_by === "employee") {
                const leadDtbs = this.db("employee as e");
                // Employee data report
                if (limit && skip) {
                    leadDtbs.limit(limit);
                    leadDtbs.offset(skip);
                }
                returnData = yield leadDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("e.id as employee_id", "e.name as employee", this.db.raw(`
      (SELECT COUNT(*) 
       FROM ?? AS ls
       JOIN ?? AS l ON ls.lead_id = l.id 
       WHERE ls.sale_by = e.id 
         AND ls.lead_id IS NOT NULL) AS sold`, [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]), this.db.raw(`
  (SELECT COALESCE(SUM(ls.sale_amount), 0)
   FROM ?? AS ls
   JOIN ?? AS l ON ls.lead_id = l.id 
   WHERE ls.sale_by = e.id 
     AND ls.lead_id IS NOT NULL) AS total_sale_amount`, [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]), this.db.raw(`
          (SELECT COUNT(*)
           FROM ?? AS cl
           WHERE cl.assign_lead = e.id) AS total_leads`, [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
          (SELECT COUNT(*)
           FROM ?? AS cl
           WHERE cl.assign_lead = e.id
             AND cl.status = 'positive_lead') AS positive`, [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
          (SELECT COUNT(*)
           FROM ?? AS cl
           WHERE cl.assign_lead = e.id
             AND cl.status = 'negative_lead') AS negative`, [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
          (SELECT count(*)
           FROM ?? AS hcl
           WHERE hcl.assign_lead = e.id
            AND hcl.phone_call = '1'
          
          ) AS phone_call`, [`${this.CRM_SCHEMA}.history_contact_lead`]), this.db.raw(`
          (SELECT count(*)
           FROM ?? AS visit
           WHERE visit.assign_lead = e.id) AS visit`, [`${this.CRM_SCHEMA}.history_lead_visit`]), this.db.raw(`
          (SELECT count(*)
           FROM ?? AS demo
           WHERE demo.assign_lead = e.id) AS demo`, [`${this.CRM_SCHEMA}.history_lead_demo_link`]), this.db.raw(`
          (SELECT count(*)
           FROM ?? AS agr
           WHERE agr.assign_lead = e.id) AS agreement`, [`${this.CRM_SCHEMA}.history_lead_agreement_paper`]))
                    .where("e.organization_id", organization_id)
                    .groupBy("e.id", "e.name");
            }
            return {
                data: returnData,
                total: (returnData === null || returnData === void 0 ? void 0 : returnData.length) || 0,
            };
        });
    }
    //get daily report
    // get lifetime report
    getDailyReport(organization_id, { limit, skip, filter_by, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = [];
            if (filter_by === "lead") {
                const pdDtbs = this.db("lead_view");
                // Apply limit and skip if provided
                if (limit) {
                    pdDtbs.limit(limit);
                }
                if (skip) {
                    pdDtbs.offset(skip);
                }
                // Get today's date start and end times
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));
                // Fetch data from the database where today's date falls between start_date and end_date
                returnData = yield pdDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("*")
                    .where("organization_id", organization_id)
                    .andWhereBetween("created_at", [startOfDay, endOfDay])
                    .orderBy("id", "desc");
            }
            if (filter_by === "meeting") {
                const pdDtbs = this.db("meeting_view");
                // Apply limit and skip if provided
                if (limit) {
                    pdDtbs.limit(limit);
                }
                if (skip) {
                    pdDtbs.offset(skip);
                }
                // Get today's date start and end times
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                const endOfDay = new Date(today.setHours(23, 59, 59, 999));
                // Fetch data from the database where today's date falls between start_date and end_date
                returnData = yield pdDtbs
                    .withSchema(this.MEETING)
                    .select("*")
                    .where("organization_id", organization_id)
                    .andWhereBetween("meeting_date", [startOfDay, endOfDay])
                    .orderBy("meeting_id", "desc");
            }
            if (filter_by === "leave") {
                const pdDtbs = this.db("employee_leave_view");
                // Apply limit and skip if provided
                if (limit) {
                    pdDtbs.limit(limit);
                }
                if (skip) {
                    pdDtbs.offset(skip);
                }
                // Get today's date in the format that matches your database date format
                const today = new Date();
                // Fetch data from the database where today's date falls between start_date and end_date
                returnData = yield pdDtbs
                    .withSchema(this.LEAVE)
                    .select("*")
                    .where("organization_id", organization_id)
                    .andWhere("leave_status", "approved")
                    .andWhere("start_date", "<=", today)
                    .andWhere("end_date", ">=", today)
                    .orderBy("leave_id", "desc");
            }
            return {
                data: returnData,
                total: (returnData === null || returnData === void 0 ? void 0 : returnData.length) || 0,
            };
        });
    }
    // get month wise Report
    getMonthWiseReport(organization_id, { from_date, to_date, limit, skip, filter_by, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData = [];
            let total;
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
            // product data report
            if (filter_by === "product") {
                const pdDtbs = this.db("product");
                // Apply limit and skip if provided
                if (limit && skip) {
                    pdDtbs.limit(parseInt(limit));
                    pdDtbs.offset(parseInt(skip));
                }
                returnData = yield pdDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("product.id as product_id", "product.name as product_name", this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.lead_sale ls
         JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND ls.sale_time BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS sold`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.lead l
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS total_leads`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.contact_lead cl
         JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
         LEFT JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND hcl.phone_call = '1') AS contact`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.history_lead_demo_link hdl
         JOIN ${this.CRM_SCHEMA}.lead l ON hdl.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND hdl.demo_sent = '1') AS demo_sent`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.history_lead_agreement_paper hap
         JOIN ${this.CRM_SCHEMA}.lead l ON hap.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND hap.paper_sent = '1') AS agreement_paper_sent`), this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.contact_lead cl
         JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
         WHERE l.product_id = product.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND cl.status = 'negative_lead') AS negative`))
                    .where("product.organization_id", organization_id)
                    .groupBy("product.id", "product.name")
                    .orderBy("product.name", "asc");
                // total
                total = yield this.db("product")
                    .withSchema(this.CRM_SCHEMA)
                    .count("product.id as total")
                    .where("product.organization_id", organization_id);
            }
            if (filter_by === "source") {
                const srcDtbs = this.db("source");
                if (limit && skip) {
                    srcDtbs.limit(parseInt(limit));
                    srcDtbs.offset(parseInt(skip));
                }
                // Source data report
                returnData = yield srcDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("source.id as source_id", "source.name as source_name", this.db.raw(`
        (SELECT COUNT(*)
         FROM ${this.CRM_SCHEMA}.contact_lead cl
         JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
         WHERE l.source_id = source.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
           AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
            (SELECT COUNT(*)
             FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
             JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
             WHERE l.source_id = source.id
               ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
               AND hcl.phone_call = '1') AS contact`), this.db.raw(`
            (SELECT COUNT(*)
             FROM ${this.CRM_SCHEMA}.lead_sale ls
             JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
             WHERE l.source_id = source.id
               ${formattedFromDate
                    ? `AND ls.sale_time BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS sold`), this.db.raw(`
            (SELECT COUNT(*)
             FROM ${this.CRM_SCHEMA}.contact_lead cl
             JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
             WHERE l.source_id = source.id
               ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
               AND cl.status = 'negative_lead') AS negative`), this.db.raw(`
        (SELECT COUNT(DISTINCT l.id)
         FROM ${this.CRM_SCHEMA}.lead l
         WHERE l.source_id = source.id
           ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS total_leads`))
                    .where("source.organization_id", organization_id)
                    .groupBy("source.id", "source.name")
                    .orderBy("source.name", "asc");
                // total
                total = yield this.db("source")
                    .withSchema(this.CRM_SCHEMA)
                    .count("source.id as total")
                    .where("source.organization_id", organization_id);
            }
            if (filter_by === "org_type") {
                const orgDtbs = this.db("org_type");
                if (limit && skip) {
                    orgDtbs.limit(parseInt(limit));
                    orgDtbs.offset(parseInt(skip));
                }
                // Organization data report
                returnData = yield orgDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("org_type.id as org_id", "org_type.name as org_name", this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
       JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         ${formattedFromDate
                    ? `AND hcl.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND hcl.phone_call = '1'
        ) AS contact`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.lead_sale ls
       JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         ${formattedFromDate
                    ? `AND ls.sale_time BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS sold`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND cl.status = 'negative_lead') AS negative`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
       WHERE l.org_type_id = org_type.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
      (SELECT COUNT(DISTINCT l.id)
       FROM ${this.CRM_SCHEMA}.lead l
       WHERE l.org_type_id = org_type.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS total_leads`))
                    .where("org_type.organization_id", organization_id)
                    .groupBy("org_type.id", "org_type.name")
                    .orderBy("org_type.name", "asc");
                // total
                total = yield this.db("org_type")
                    .withSchema(this.CRM_SCHEMA)
                    .count("org_type.id as total")
                    .where("org_type.organization_id", organization_id);
            }
            if (filter_by === "organization") {
                const orgDtbs = this.db("lead_organization");
                if (limit && skip) {
                    orgDtbs.limit(parseInt(limit));
                    orgDtbs.offset(parseInt(skip));
                }
                // Organization data report
                returnData = yield orgDtbs
                    .withSchema(this.CRM_SCHEMA)
                    .select("lead_organization.id as lead_organization_id", "lead_organization.lead_org_name", this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.history_contact_lead hcl
       JOIN ${this.CRM_SCHEMA}.lead l ON hcl.lead_id = l.id
       WHERE l.lead_organization_id = lead_organization.id
         ${formattedFromDate
                    ? `AND hcl.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND hcl.phone_call = '1'
        ) AS contact`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.lead_sale ls
       JOIN ${this.CRM_SCHEMA}.lead l ON ls.lead_id = l.id
       WHERE l.lead_organization_id = lead_organization.id
         ${formattedFromDate
                    ? `AND ls.sale_time BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS sold`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
      WHERE l.lead_organization_id = lead_organization.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND cl.status = 'negative_lead') AS negative`), this.db.raw(`
      (SELECT COUNT(*)
       FROM ${this.CRM_SCHEMA}.contact_lead cl
       JOIN ${this.CRM_SCHEMA}.lead l ON cl.lead_id = l.id
WHERE l.lead_organization_id = lead_organization.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}
         AND cl.status = 'positive_lead') AS positive`), this.db.raw(`
      (SELECT COUNT(DISTINCT l.id)
       FROM ${this.CRM_SCHEMA}.lead l
WHERE l.lead_organization_id = lead_organization.id
         ${formattedFromDate
                    ? `AND l.created_at BETWEEN '${formattedFromDate}' AND '${formattedEndDate}'`
                    : ""}) AS total_leads`))
                    .where("lead_organization.organization_id", organization_id)
                    .groupBy("lead_organization.id", "lead_organization.lead_org_name")
                    .orderBy("lead_organization.lead_org_name", "asc");
                // total
                total = yield this.db("lead_organization")
                    .withSchema(this.CRM_SCHEMA)
                    .count("lead_organization.id as total")
                    .where("lead_organization.organization_id", organization_id);
            }
            if (filter_by === "employee") {
                const leadDtbs = this.db("employee as e");
                // Employee data report
                if (limit && skip) {
                    leadDtbs.limit(parseInt(limit));
                    leadDtbs.offset(parseInt(skip));
                }
                // return data
                returnData = yield leadDtbs
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
    ) AS sold`, formattedFromDate && endDate
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
                    ? `AND l.created_at BETWEEN ? AND ?`
                    : ""}
    ) AS total_sale_amount`, formattedFromDate && endDate
                    ? [
                        `${this.CRM_SCHEMA}.lead_sale`,
                        `${this.CRM_SCHEMA}.lead`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.lead_sale`, `${this.CRM_SCHEMA}.lead`]), this.db.raw(`
  (
    SELECT COUNT(*)
    FROM ?? AS cl
    LEFT JOIN crm.contact_lead_assign AS cla ON cl.id = cla.cl_id
    WHERE cla.assign_lead_emp_id = e.id
    ${formattedFromDate && formattedEndDate
                    ? `AND cl.created_at BETWEEN ? AND ?`
                    : ""}
  ) AS total_leads`, formattedFromDate && formattedEndDate
                    ? [`${this.CRM_SCHEMA}.contact_lead`, formattedFromDate, endDate]
                    : [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
  (
    SELECT COUNT(*)
    FROM ?? AS cl
    LEFT JOIN crm.contact_lead_assign AS cla ON cl.id = cla.cl_id
    WHERE cla.assign_lead_emp_id = e.id
      AND cl.status = 'positive_lead'
      ${formattedFromDate && formattedEndDate
                    ? `AND cl.created_at BETWEEN ? AND ?`
                    : ""}
  ) AS positive`, formattedFromDate && formattedEndDate
                    ? [
                        `${this.CRM_SCHEMA}.contact_lead`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
    (
        SELECT COUNT(*)
        FROM ?? AS cl
          LEFT JOIN crm.contact_lead_assign AS cla ON cl.id = cla.cl_id
    WHERE cla.assign_lead_emp_id = e.id
            AND cl.status = 'negative_lead'
            ${formattedFromDate && formattedEndDate
                    ? `AND cl.created_at BETWEEN ? AND ?`
                    : ""}
    ) AS negative`, formattedFromDate && formattedEndDate
                    ? [
                        `${this.CRM_SCHEMA}.contact_lead`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.contact_lead`]), this.db.raw(`
    (
        SELECT count(*)
        FROM ?? AS hcl
        WHERE hcl.assign_lead = e.id
            AND hcl.phone_call = '1'
            ${formattedFromDate && formattedEndDate
                    ? `AND hcl.created_at BETWEEN ? AND ?`
                    : ""}
    ) AS phone_call`, formattedFromDate && formattedEndDate
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
    ) AS visit`, formattedFromDate && formattedEndDate
                    ? [
                        `${this.CRM_SCHEMA}.history_lead_visit`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.history_lead_visit`]), this.db.raw(`
    (
        SELECT count(*)
        FROM ?? AS demo
        WHERE demo.assign_lead = e.id
            ${formattedFromDate && formattedEndDate
                    ? `AND demo.created_at BETWEEN ? AND ?`
                    : ""}
    ) AS demo`, formattedFromDate && formattedEndDate
                    ? [
                        `${this.CRM_SCHEMA}.history_lead_demo_link`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.history_lead_demo_link`]), this.db.raw(`
    (
        SELECT count(*)
        FROM ?? AS agr
        WHERE agr.assign_lead = e.id
            ${formattedFromDate && formattedEndDate
                    ? `AND agr.created_at BETWEEN ? AND ?`
                    : ""}
    ) AS agreement`, formattedFromDate && formattedEndDate
                    ? [
                        `${this.CRM_SCHEMA}.history_lead_agreement_paper`,
                        formattedFromDate,
                        formattedEndDate,
                    ]
                    : [`${this.CRM_SCHEMA}.history_lead_agreement_paper`]), this.db.raw(`
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
              GROUP BY l.product_id, pd.name
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
                    .groupBy("e.id", "e.name")
                    .orderBy("e.name", "asc");
                // total
                total = yield this.db("employee as e")
                    .withSchema(this.CRM_SCHEMA)
                    .count("e.id as total")
                    .where("e.organization_id", organization_id);
            }
            if (filter_by === "meeting") {
                const leadDtbs = this.db("meeting_view as mv")
                    .withSchema(this.MEETING)
                    .where("mv.organization_id", organization_id);
                // Add date filtering
                if (formattedFromDate && formattedEndDate) {
                    leadDtbs.whereBetween("mv.meeting_date", [
                        formattedFromDate,
                        formattedEndDate,
                    ]);
                }
                // Employee data report
                if (limit && skip) {
                    leadDtbs.limit(parseInt(limit));
                    leadDtbs.offset(parseInt(skip));
                }
                // return data
                returnData = yield leadDtbs
                    .select("mv.meeting_id", "mv.meeting_title", "mv.meeting_status", "mv.meeting_date", "mv.meeting_start_time", "mv.meeting_end_time", "mv.place_name as meeting_place_name", "mv.source_name", "mv.org_name")
                    .orderBy("mv.meeting_title", "asc");
                // total
                const totalQuery = this.db("meeting_view as mv")
                    .withSchema(this.MEETING)
                    .where("mv.organization_id", organization_id);
                // Add the same date filtering to the total query
                if (formattedFromDate && formattedEndDate) {
                    totalQuery.whereBetween("mv.meeting_date", [
                        formattedFromDate,
                        formattedEndDate,
                    ]);
                }
                total = yield totalQuery.count("mv.meeting_id as total");
            }
            if (filter_by === "leave") {
                const leadDtbs = this.db("employee_leave_view as elv");
                if (limit && skip) {
                    leadDtbs.limit(parseInt(limit));
                    leadDtbs.offset(parseInt(skip));
                }
                // Date filtering
                if (from_date && to_date) {
                    leadDtbs.where("elv.start_date", ">=", formattedFromDate);
                    leadDtbs.where("elv.start_date", "<", formattedEndDate);
                }
                // return data
                returnData = yield leadDtbs
                    .withSchema(this.LEAVE)
                    .select("elv.leave_id", "elv.start_date", "elv.end_date", "elv.number_of_working_days", "elv.leave_status", "elv.leave_type_name", "elv.leave_deduct_from_allowance", "elv.employee_name", "elv.employee_photo", "elv.employee_designation")
                    .where("elv.organization_id", organization_id)
                    .orderBy("elv.employee_name", "asc");
                // total
                total = yield this.db("employee_leave_view as elv")
                    .withSchema(this.LEAVE)
                    .where("elv.organization_id", organization_id)
                    .count("elv.leave_id as total");
            }
            return {
                data: returnData,
                total: parseInt(total[0].total),
            };
        });
    }
    // get lead overall Report
    getLeadOverallReport(organization_id, { from_date, to_date, limit, skip, product_id, lead_id, filter_by, emp_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            let returnData;
            let total;
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const formattedFromDate = from_date && to_date
                ? new Date(from_date)
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                : null;
            const formattedEndDate = from_date && to_date
                ? endDate.toISOString().slice(0, 19).replace("T", " ")
                : null;
            if (filter_by === "lead") {
                if (lead_id && from_date && to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_lead_counts_by_lead_id(?, ?, ?)
`, [lead_id, formattedFromDate, formattedEndDate]);
                }
                if (lead_id && !from_date && !to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_lead_counts_by_lead_id(?)
`, [lead_id]);
                }
            }
            // product data report
            if (filter_by === "product") {
                if (product_id && from_date && to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_product_lead_counts(?, ?, ?)
`, [product_id, formattedFromDate, formattedEndDate]);
                }
                if (product_id && !from_date && !to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_product_lead_counts(?)
`, [product_id]);
                }
            }
            if (filter_by === "employee") {
                if (emp_id && from_date && to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_assign_emp_lead_counts(?, ?, ?)
`, [emp_id, formattedFromDate, formattedEndDate]);
                }
                if (emp_id && !from_date && !to_date) {
                    returnData = yield this.db.raw(`
    SELECT * 
    FROM ${this.CRM_SCHEMA}.get_assign_emp_lead_counts(?)
`, [emp_id]);
                }
            }
            return {
                data: returnData ? returnData === null || returnData === void 0 ? void 0 : returnData.rows[0] : [],
            };
        });
    }
    // get all lead by lead status
    getLeadCounts(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db("lead")
                .withSchema(this.CRM_SCHEMA)
                .where({ organization_id })
                .select(this.db.raw("COUNT(DISTINCT CASE WHEN contact_lead.status = 'negative_lead' THEN lead.id END) as negative_lead"), this.db.raw("COUNT(DISTINCT CASE WHEN contact_lead.status = 'positive_lead' THEN lead.id END) as positive_lead"), this.db.raw("COUNT(DISTINCT CASE WHEN lead_sale.lead_id IS NOT NULL THEN lead.id END) as sold_lead"), this.db.raw("COUNT(DISTINCT lead.id) as total_lead"))
                .leftJoin("contact_lead", "lead.id", "contact_lead.lead_id")
                .leftJoin("lead_sale", "lead.id", "lead_sale.lead_id")
                .first();
            const Tdtbs = this.db("crm.lead");
            const tResult = yield Tdtbs.count("* as total");
            const totalCount = parseInt(tResult[0].total) || 0;
            const countInfo = {
                negative_lead: parseInt(result.negative_lead),
                positive_lead: parseInt(result.positive_lead),
                sold_lead: parseInt(result.sold_lead),
                total_lead: parseInt(result.total_lead),
            };
            return { data: countInfo, total: totalCount };
        });
    }
    // update lead
    updateLead(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead")
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .update(payload);
        });
    }
    // add to lead sale
    addToLeadSale(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    // get single lead sale by lead id
    getSaleLeadbyLeadId(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .where({ lead_id: payload.lead_id });
        });
    }
    // update lead sale
    updateLeadSale(payload, lead_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ lead_id });
        });
    }
    // delete lead sale
    deleteLeadSale(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .del()
                .where("id", id);
        });
    }
    // delete lead sale history
    deleteLeadSaleHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .del()
                .where("ls_id", id);
        });
    }
    // add to lead sale
    historyLeadSaleInsert(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_lead_sale")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // add to contact lead
    addContactLead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "id");
        });
    }
    // add to contact lead assign
    addContactLeadAssign(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_assign")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // get all contact lead assign
    getAllContactLeadAssign(cl_ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_assign")
                .withSchema(this.CRM_SCHEMA)
                .select("assign_lead_emp_id")
                .whereIn("id", cl_ids);
        });
    }
    // remove to contact lead assign
    removeContactLeadAssign(id, org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_assign as cla")
                .withSchema(this.CRM_SCHEMA)
                .leftJoin("contact_lead as cl", "cla.cl_id", "cl.id")
                .leftJoin("lead as ld", "cl.lead_id", "ld.id")
                .where("cla.id", id)
                .andWhere("ld.organization_id", org_id)
                .del();
        });
    }
    // remove to contact lead assign
    removeContactLeadAssignByEmpId(cl_id, emp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_assign as cla")
                .withSchema(this.CRM_SCHEMA)
                .leftJoin("contact_lead as cl", "cla.cl_id", "cl.id")
                .leftJoin("lead as ld", "cl.lead_id", "ld.id")
                .where("cla.cl_id", cl_id)
                .andWhere("cla.assign_lead_emp_id", emp_id)
                .del();
        });
    }
    // update contact lead
    updateContactLead(payload, lead_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead")
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ lead_id });
        });
    }
    // contact lead forward
    insertLeadForward(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_forward")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // remove from contact lead forward
    removeContactForward(cl_id, forwarded_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("contact_lead_forward")
                .withSchema(this.CRM_SCHEMA)
                .where({ cl_id })
                .andWhere({ forwarded_by })
                .del();
        });
    }
    // add to history lead
    addLeadToHistoryContact(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("history_contact_lead")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // insert other activities
    insertOtherActivities(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("support_activities")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // get all other activities
    getAllOtherActivities({ emp_id, organization_id, from_date, to_date, limit, skip, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = new Date(to_date);
            endDate.setDate(endDate.getDate() + 1);
            const data = yield this.db("support_activities as sa")
                .withSchema(this.CRM_SCHEMA)
                .select("sa.*", "emp.name", "emp.photo", "emp.designation")
                .leftJoin("employee as emp", "sa.emp_id", "emp.id")
                .andWhere("sa.organization_id", organization_id)
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("sa.created_at", [from_date, endDate]);
                }
                if (emp_id) {
                    this.andWhere("sa.emp_id", emp_id);
                }
            })
                .limit(limit || 100)
                .offset(skip || 0);
            const total = yield this.db("support_activities  as sa")
                .withSchema(this.CRM_SCHEMA)
                .count("* as total")
                .leftJoin("employee as emp", "sa.emp_id", "emp.id")
                .andWhere("sa.organization_id", organization_id)
                .where(function () {
                if (from_date && to_date) {
                    this.andWhereBetween("sa.created_at", [from_date, endDate]);
                }
                if (emp_id) {
                    this.andWhere("sa.emp_id", emp_id);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // insert after sale
    insertAfterSale(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("after_sales")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload);
        });
    }
    // get all after sales support by lead id
    getAllSupportByLeadId(lead_id, organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("after_sales")
                .withSchema(this.CRM_SCHEMA)
                .select("id");
        });
    }
    // get all contact lead
    getAllContactLead({ limit, skip, searchPrm, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db("lead_view");
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select("id", "city_name", "country_name", "source_name", "product_name", "area_name", "product_name", "org_type_name", "contact_person", "contact_lead", "contact_number")
                .where(function () {
                this.andWhereRaw("(contact_lead->>'status') = ?", ["positive_lead"]);
                this.orWhereRaw("(contact_lead->>'status') = ?", ["sold"]);
            })
                .orderBy("id", "desc");
            const total = yield this.db("lead_view")
                .withSchema(this.CRM_SCHEMA)
                .count("id as total")
                .where(function () {
                this.andWhereRaw("(contact_lead->>'status') = ?", ["positive_lead"]);
                this.orWhereRaw("(contact_lead->>'status') = ?", ["sold"]);
            });
            return {
                total: parseInt(total[0].total),
                data,
            };
        });
    }
}
exports.default = CRMLeadModel;
