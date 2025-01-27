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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const socket_1 = require("../../app/socket");
class LeadService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create intial lead
    addLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                const { id, organization_id, name } = req.admin;
                const { lead, contact_lead } = req.body;
                const settingModel = this.Model.crmSettingModel(trx);
                const leadModel = this.Model.crmLeadModel(trx);
                const empModel = this.Model.employeeModel(trx);
                const { description, assign_lead, follow_up, follow_up_date, phone_call, call_note, requirement, sale_amount, sale_time, sale_by, sale_type, paid_amount, } = contact_lead;
                const { status, team_id, org_type_id, source_id, product_id } = lead;
                // check the organization exist or not
                const isOrgExist = yield settingModel.retrieveSingleOrganization(org_type_id);
                if (!isOrgExist.data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "organization doesn't exist",
                    };
                }
                // check the area exist or not
                // const isAreaExist = await settingModel.getSingleArea(area_id);
                // if (!isAreaExist.data) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_NOT_FOUND,
                //     message: "area doesn't exist",
                //   };
                // }
                // check the source exist or not
                // const isSourceExist = await settingModel.retrieveSingleSource(source_id);
                //check if team exists
                // const ifTeamExist = await this.Model.adminTeamModel().getSingleTeam(
                //   team_id
                // );
                // if (!ifTeamExist[0].length) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_NOT_FOUND,
                //     message: "Team Doesn't Exist",
                //   };
                // }
                // if (!isSourceExist.length) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_NOT_FOUND,
                //     message: "source doesn't exist",
                //   };
                // }
                // check the product exist or not
                // const isProductExist = await settingModel.retrieveSingleProduct(
                //   product_id
                // );
                // if (!isProductExist.data) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_NOT_FOUND,
                //     message: "product doesn't exist",
                //   };
                // }
                // /* organization info */
                // let lead_organization_name = lead.org_name;
                // lead_organization_name = lead_organization_name.trim().toLowerCase(); // Trim and convert to lowercase
                // const org_name_exist = await leadModel.checkOrganizationNameExists(
                //   organization_id,
                //   lead_organization_name
                // );
                // let lead_organization_id;
                // if (org_name_exist.length) {
                //   // Retrieve existing id
                //   lead_organization_id = org_name_exist[0].id;
                // } else {
                //   // Insert new
                //   const newOrg = await leadModel.addOrganization({
                //     lead_org_name: lead_organization_name,
                //     organization_id: organization_id,
                //   });
                //   lead_organization_id = newOrg[0].id;
                // }
                //============== check organization =================//
                let lead_organization_id = 0;
                if (lead.org_name) {
                    // check same lead created by product id and org name
                    const { data: checkOrgWithSameProductLeadExistOrNot } = yield leadModel.checkLead(organization_id, {
                        searchPrm: lead.org_name,
                        product_id,
                    });
                    if (checkOrgWithSameProductLeadExistOrNot.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Already lead exist with this product by this organization",
                        };
                    }
                    const lead_organization_name = lead === null || lead === void 0 ? void 0 : lead.org_name.trim().toLowerCase();
                    const org_name_exist = yield leadModel.checkOrganizationNameExists(organization_id, lead_organization_name);
                    if (org_name_exist.length) {
                        lead_organization_id = org_name_exist[0].id;
                    }
                    else {
                        const newOrg = yield leadModel.addOrganization({
                            lead_org_name: lead === null || lead === void 0 ? void 0 : lead.org_name,
                            organization_id: organization_id,
                        });
                        lead_organization_id = newOrg[0].id;
                    }
                }
                else {
                    // check same lead created by product id and contact number
                    const { data: checkContactWithSameProductLeadExistOrNot } = yield leadModel.checkLead(organization_id, {
                        contact_number: lead.contact_number,
                        product_id,
                    });
                    if (checkContactWithSameProductLeadExistOrNot.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Already lead exist with this product by this contact number",
                        };
                    }
                }
                /*==================== organization end =====================*/
                // Insert to lead table
                const leadRes = yield leadModel.addLead({
                    area_id: lead.area_id,
                    source_id: lead.source_id,
                    org_type_id: lead.org_type_id,
                    contact_person: lead.contact_person,
                    org_name: lead.org_name,
                    org_address: lead.org_address,
                    contact_email: lead.contact_email,
                    contact_number: lead.contact_number,
                    additional_contact_number: lead.additional_contact_number,
                    product_id: lead.product_id,
                    reference: lead.reference,
                    created_by: id,
                    organization_id: organization_id,
                    team_id: team_id,
                    lead_organization_id: lead_organization_id, // Correctly assigned here
                });
                // cehck the assign lead employee exist
                // const isAssignLeadEmployeeExist = await empModel.getSingleEmployee({
                //   id: assign_lead,
                // });
                // if (!isAssignLeadEmployeeExist.length) {
                //   return {
                //     success: false,
                //     code: this.StatusCode.HTTP_NOT_FOUND,
                //     message: "assign lead doesn't exist",
                //   };
                // }
                // const { name: assign_by_name } = isAssignLeadEmployeeExist[0];
                if (status === "positive_lead") {
                    if (!assign_lead ||
                        !follow_up.toString() ||
                        !follow_up_date ||
                        !phone_call.toString() ||
                        !status) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Some field is missing for positive lead",
                        };
                    }
                    // insert contact lead
                    const cntctLdRs = yield leadModel.addContactLead({
                        lead_id: (_a = leadRes[0]) === null || _a === void 0 ? void 0 : _a.id,
                        description,
                        follow_up,
                        follow_up_date,
                        phone_call,
                        call_note,
                        status,
                    });
                    // multiple assign
                    yield Promise.all(assign_lead.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addContactLeadAssign({
                            cl_id: cntctLdRs[0].id,
                            assign_lead_emp_id: emp_id,
                        });
                    })));
                    // insert history contact lead
                    yield Promise.all(assign_lead.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addLeadToHistoryContact({
                            lead_id: leadRes[0].id,
                            assign_lead: emp_id,
                            description,
                            follow_up,
                            follow_up_date,
                            phone_call,
                            call_note,
                            status,
                        });
                    })));
                    // insert into lead tracking
                    const leadTrackingRes = yield leadModel.insertInLeadTracking({
                        action_type: "create",
                        tracking_type: "lead",
                        description: description,
                        admin_id: id,
                        // emp_id: assign_lead,
                        lead_id: leadRes[0].id,
                        org_id: organization_id,
                        call_note: call_note,
                        follow_up_date,
                    });
                    // multiple assign in lead tracking
                    yield Promise.all(assign_lead.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        // insert into lead tracking
                        yield leadModel.insertInLeadTracking({
                            action_type: "create",
                            tracking_type: "lead",
                            description: description,
                            emp_id: emp_id,
                            lead_id: leadRes[0].id,
                            call_note: call_note,
                            org_id: organization_id,
                        });
                    })));
                }
                else if (status === "negative_lead") {
                    if (!assign_lead ||
                        // !follow_up.toString() ||
                        // !follow_up_date ||
                        // !phone_call.toString() ||
                        !status) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Some field is missing for negative lead",
                        };
                    }
                    // insert contact lead
                    const cntctLdRs = yield leadModel.addContactLead({
                        lead_id: (_b = leadRes[0]) === null || _b === void 0 ? void 0 : _b.id,
                        description,
                        // assign_lead,
                        follow_up,
                        follow_up_date,
                        phone_call,
                        call_note,
                        status,
                    });
                    // multiple assign
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addContactLeadAssign({
                            cl_id: cntctLdRs[0].id,
                            assign_lead_emp_id: emp_id,
                        });
                    }));
                    //
                    yield Promise.all(assign_lead.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addLeadToHistoryContact({
                            lead_id: leadRes[0].id,
                            assign_lead: emp_id,
                            description,
                            follow_up,
                            follow_up_date,
                            phone_call,
                            call_note,
                            status,
                        });
                    })));
                    // multiple assign in lead tracking
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        // insert into lead tracking
                        yield leadModel.insertInLeadTracking({
                            action_type: "create",
                            tracking_type: "lead",
                            description: description,
                            emp_id: emp_id,
                            lead_id: leadRes[0].id,
                            call_note: call_note,
                            org_id: organization_id,
                        });
                    }));
                }
                else if (status === "sold") {
                    if (
                    // !assign_lead ||
                    // !follow_up.toString() ||
                    // !follow_up_date ||
                    !sale_amount ||
                        !sale_time ||
                        !sale_by ||
                        !sale_type ||
                        !status) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Some field is missing for sold lead",
                        };
                    }
                    // insert contact lead
                    const cntctLdRs = yield leadModel.addContactLead({
                        lead_id: (_c = leadRes[0]) === null || _c === void 0 ? void 0 : _c.id,
                        description,
                        // assign_lead: sale_by,
                        follow_up,
                        follow_up_date,
                        phone_call,
                        call_note,
                        status,
                    });
                    // multiple assign
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addContactLeadAssign({
                            cl_id: cntctLdRs[0].id,
                            assign_lead_emp_id: emp_id,
                        });
                    }));
                    // insert history contact lead
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addLeadToHistoryContact({
                            lead_id: leadRes[0].id,
                            description,
                            follow_up,
                            follow_up_date,
                            phone_call,
                            call_note,
                            status,
                            assign_lead: emp_id,
                        });
                    }));
                    const due_amount = sale_amount - paid_amount;
                    // insert into to lead_sale table
                    const leadSaleRes = yield leadModel.addToLeadSale({
                        lead_id: leadRes[0].id,
                        requirement,
                        sale_amount,
                        sale_time,
                        sale_by,
                        sale_type,
                        due_amount,
                        paid_amount,
                    });
                    // insert into to lead_sale history table
                    yield leadModel.historyLeadSaleInsert({
                        ls_id: leadSaleRes[0].id,
                        sale_amount,
                        paid_amount,
                        due_amount,
                    });
                    // check the sale by employee exist
                    const isSaleByEmployeeExist = yield empModel.getSingleEmployee({
                        id: sale_by,
                    });
                    if (!isSaleByEmployeeExist.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Sale by doesn't exist",
                        };
                    }
                    const { name: sale_by_name } = isSaleByEmployeeExist[0];
                    // insert into lead tracking
                    yield leadModel.insertInLeadTracking({
                        action_type: "create-and-sold",
                        tracking_type: "lead",
                        description: description,
                        lead_id: leadRes[0].id,
                        admin_id: id,
                        org_id: organization_id,
                        due_amount: due_amount,
                        paid_amount: paid_amount,
                        call_note: call_note,
                        sale_amount,
                        emp_id: sale_by,
                    });
                }
                else {
                    if (!assign_lead || !status) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: "Some field is missing for positive lead",
                        };
                    }
                    // insert contact lead
                    const cntctLdRs = yield leadModel.addContactLead({
                        lead_id: (_d = leadRes[0]) === null || _d === void 0 ? void 0 : _d.id,
                        description,
                        follow_up,
                        follow_up_date,
                        phone_call,
                        call_note,
                        status,
                    });
                    // multiple assign
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addContactLeadAssign({
                            cl_id: cntctLdRs[0].id,
                            assign_lead_emp_id: emp_id,
                        });
                    }));
                    //
                    yield Promise.all(assign_lead.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        yield leadModel.addLeadToHistoryContact({
                            lead_id: leadRes[0].id,
                            assign_lead: emp_id,
                            description,
                            follow_up,
                            follow_up_date,
                            phone_call,
                            call_note,
                            status,
                        });
                    })));
                    // multiple assign in lead tracking
                    assign_lead.forEach((emp_id) => __awaiter(this, void 0, void 0, function* () {
                        // insert into lead tracking
                        yield leadModel.insertInLeadTracking({
                            action_type: "create",
                            tracking_type: "lead",
                            description: description,
                            emp_id: emp_id,
                            lead_id: leadRes[0].id,
                            call_note: call_note,
                            org_id: organization_id,
                        });
                    }));
                }
                //==============================================
                //                Notification Section
                //==============================================
                const notify = yield this.Model.commonModel().createNotification({
                    type: "lead",
                    ref_id: leadRes[0].id,
                    message: `lead assign to you at ${lead.org_name ? lead.org_name : lead.contact_number}`,
                });
                yield Promise.all(assign_lead.map((person) => __awaiter(this, void 0, void 0, function* () {
                    yield this.Model.commonModel().addEmployeeNotification({
                        notification_id: notify[0].id,
                        user_id: person,
                    });
                })));
                const allUsers = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id, assign_lead);
                if (!allUsers.length) {
                    console.error("No connected users found.");
                }
                else {
                    yield Promise.all(allUsers.map((user) => {
                        if (user && user.socket_id) {
                            socket_1.io.to(user.socket_id).emit("notification", {
                                message: notify[0].message,
                                type: "Lead",
                                ref_id: leadRes[0].id,
                            });
                            console.log("Notification emitted to socket ID:", user.socket_id);
                        }
                        else {
                            console.error("Socket ID not found for user:", user.id);
                        }
                    }));
                }
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get all leads
    getAllLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, searchPrm, status, sec_status, third_status, from_date, to_date, team_id, } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.crmLeadModel();
            const { total, data } = yield model.getAllLead(organization_id, {
                limit: limit,
                skip: skip,
                searchPrm: searchPrm,
                from_date: from_date,
                to_date: to_date,
                status: status,
                sec_status: sec_status,
                third_status: third_status,
                team_id: team_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single lead
    getSingleLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const data = yield this.Model.crmLeadModel().getSingleLead(parseInt(req.params.id));
                if (!data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: data[0],
                };
            }));
        });
    }
    updateLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { id } = req.params;
                const { id: admin_id, organization_id } = req.admin;
                const { lead, contact_lead } = req.body;
                const _c = contact_lead || {}, { follow_up_date, sale_amount, sale_time, sale_by, paid_amount, sale_type, call_note, requirement, status, assign_lead, remove_assign_lead } = _c, restContact = __rest(_c, ["follow_up_date", "sale_amount", "sale_time", "sale_by", "paid_amount", "sale_type", "call_note", "requirement", "status", "assign_lead", "remove_assign_lead"]);
                const _d = lead || {}, { org_type_id, team_id, source_id, product_id, area_id } = _d, rest = __rest(_d, ["org_type_id", "team_id", "source_id", "product_id", "area_id"]);
                const empModel = this.Model.employeeModel(trx);
                const model = this.Model.crmLeadModel(trx);
                // check the lead exist or not
                const isLeadExist = yield model.getSingleLead(parseInt(id));
                if (!isLeadExist) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "lead doesn't exist",
                    };
                }
                // destructure lead
                const { contact_lead: getLeadContactLead, lead_sale: getLeadSale, lead_assigns_emp, } = isLeadExist[0];
                // let isAssignLeadEmployeeExist: any = [];
                // if (assign_lead) {
                //   isAssignLeadEmployeeExist = await empModel.getSingleEmployee({
                //     id: assign_lead,
                //   });
                //   if (!isAssignLeadEmployeeExist.length) {
                //     return {
                //       success: false,
                //       code: this.StatusCode.HTTP_NOT_FOUND,
                //       message: "assign lead doesn't exist",
                //     };
                //   }
                // }
                // ============== lead organization step ==============//
                let lead_organization_id;
                if (lead === null || lead === void 0 ? void 0 : lead.org_name) {
                    let lead_organization_name;
                    lead_organization_name = lead.org_name;
                    lead_organization_name = lead_organization_name.trim().toLowerCase();
                    // Trim and convert to lowercase
                    const org_name_exist = yield model.checkOrganizationNameExists(organization_id, lead_organization_name);
                    if (org_name_exist.length) {
                        // Retrieve existing id
                        lead_organization_id = org_name_exist[0].id;
                    }
                    else {
                        // Insert new
                        const newOrg = yield model.addOrganization({
                            lead_org_name: lead_organization_name,
                            organization_id: organization_id,
                        });
                        lead_organization_id = newOrg[0].id;
                    }
                    if (lead_organization_id) {
                        lead.lead_organization_id = lead_organization_id;
                    }
                }
                /* organization end */
                // update lead
                if (lead && Object.keys(lead).length) {
                    const leadUpdatePayload = {};
                    const lead_payload = Object.assign(Object.assign({}, rest), { product_id,
                        area_id,
                        org_type_id,
                        source_id,
                        lead_organization_id });
                    Object.keys(lead_payload).forEach((key) => {
                        if (lead_payload[key] !== undefined) {
                            leadUpdatePayload[key] = lead_payload[key];
                        }
                    });
                    if (Object.keys(leadUpdatePayload).length) {
                        yield model.updateLead(leadUpdatePayload, parseInt(id));
                        // insert into lead tracking
                        yield model.insertInLeadTracking({
                            tracking_type: "lead",
                            action_type: "update",
                            description: "lead info updated",
                            lead_id: parseInt(id),
                            admin_id,
                            org_id: organization_id,
                        });
                    }
                }
                // insert contact lead
                if ((contact_lead && Object.keys(contact_lead).length) || status) {
                    const cntctPldUpdate = {};
                    const cntctPld = Object.assign(Object.assign({}, restContact), { status,
                        call_note,
                        follow_up_date });
                    // remove assign lead
                    if (remove_assign_lead === null || remove_assign_lead === void 0 ? void 0 : remove_assign_lead.length) {
                        // insert into lead tracking
                        const removedData = yield model.getAllContactLeadAssign(remove_assign_lead);
                        if (removedData.length) {
                            // multiple assign in lead tracking
                            yield Promise.all(removedData.map((item) => __awaiter(this, void 0, void 0, function* () {
                                yield model.insertInLeadTracking({
                                    action_type: "update",
                                    tracking_type: "lead",
                                    description: "Removed employees from lead",
                                    lead_id: parseInt(id),
                                    org_id: organization_id,
                                    emp_id: item.assign_lead_emp_id,
                                });
                            })));
                        }
                        yield Promise.all(remove_assign_lead.map((item) => __awaiter(this, void 0, void 0, function* () {
                            yield model.removeContactLeadAssign(item, organization_id);
                        })));
                    }
                    if (assign_lead === null || assign_lead === void 0 ? void 0 : assign_lead.length) {
                        const updateLeadAssginEMp = [];
                        if (lead_assigns_emp.length) {
                            for (let i = 0; i < assign_lead.length; i++) {
                                let found = false;
                                for (let j = 0; j < lead_assigns_emp.length; j++) {
                                    if (assign_lead[i] == lead_assigns_emp[j].emp_assign_id) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    updateLeadAssginEMp.push(assign_lead[i]);
                                }
                            }
                        }
                        if (updateLeadAssginEMp.length) {
                            // multiple assign
                            yield Promise.all(updateLeadAssginEMp.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                                yield model.addContactLeadAssign({
                                    cl_id: getLeadContactLead.id,
                                    assign_lead_emp_id: emp_id,
                                });
                            })));
                            // multiple assign in history contact lead assign
                            yield Promise.all(updateLeadAssginEMp.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                                yield model.addLeadToHistoryContact({
                                    lead_id: parseInt(id),
                                    follow_up_date,
                                    assign_lead: emp_id,
                                });
                            })));
                            // multiple assign in lead tracking
                            yield Promise.all(updateLeadAssginEMp.map((emp_id) => __awaiter(this, void 0, void 0, function* () {
                                yield model.insertInLeadTracking({
                                    action_type: "update",
                                    tracking_type: "lead",
                                    description: "Assigned more employees",
                                    lead_id: parseInt(id),
                                    org_id: organization_id,
                                    emp_id,
                                });
                            })));
                        }
                    }
                    Object.keys(cntctPld).forEach((key) => {
                        if (typeof cntctPld[key] != "undefined") {
                            cntctPldUpdate[key] = cntctPld[key];
                        }
                    });
                    if (Object.keys(cntctPldUpdate).length) {
                        if (getLeadContactLead.status != status ||
                            Object.keys(cntctPldUpdate).length > 1) {
                            yield model.updateContactLead(cntctPldUpdate, parseInt(id));
                            // insert into lead tracking
                            yield model.insertInLeadTracking({
                                tracking_type: "lead",
                                action_type: "update",
                                description: contact_lead.description
                                    ? contact_lead.description
                                    : "lead contact info updated",
                                lead_id: parseInt(id),
                                admin_id,
                                call_note: call_note,
                                org_id: organization_id,
                                follow_up_date,
                            });
                        }
                    }
                    if ((getLeadContactLead === null || getLeadContactLead === void 0 ? void 0 : getLeadContactLead.status) == "sold" &&
                        status &&
                        status === "sold") {
                        const modified_sale_amount = sale_amount
                            ? sale_amount
                            : getLeadSale.sale_amount;
                        const modified_paid_amount = paid_amount
                            ? paid_amount
                            : getLeadSale.paid_amount;
                        const due_amount = modified_sale_amount - modified_paid_amount;
                        if (modified_sale_amount ||
                            modified_paid_amount ||
                            sale_by ||
                            sale_time ||
                            sale_type) {
                            // get single sold lead
                            const data = yield model.getSaleLeadbyLeadId({
                                lead_id: parseInt(id),
                            });
                            if (data.length) {
                                // update into to lead_sale table
                                yield model.updateLeadSale({
                                    team_id,
                                    sale_amount: modified_sale_amount,
                                    paid_amount: modified_paid_amount,
                                    due_amount,
                                    sale_by,
                                    sale_time,
                                    sale_type,
                                }, parseInt(id));
                                //  delete lead sale history
                                yield model.deleteLeadSaleHistory((_a = data[0]) === null || _a === void 0 ? void 0 : _a.id);
                                // insert into to lead_sale history table
                                yield model.historyLeadSaleInsert({
                                    ls_id: data[0].id,
                                    sale_amount: modified_sale_amount,
                                    paid_amount: modified_paid_amount,
                                    due_amount,
                                });
                                // insert into lead tracking
                                yield model.insertInLeadTracking({
                                    tracking_type: "lead",
                                    action_type: "updated-sold-amount",
                                    description: (contact_lead === null || contact_lead === void 0 ? void 0 : contact_lead.description) || (contact_lead === null || contact_lead === void 0 ? void 0 : contact_lead.requirement),
                                    lead_id: parseInt(id),
                                    org_id: organization_id,
                                    sale_amount: modified_sale_amount,
                                    paid_amount: modified_paid_amount,
                                    call_note: call_note,
                                    due_amount,
                                    admin_id,
                                });
                            }
                        }
                    }
                    else if ((getLeadContactLead === null || getLeadContactLead === void 0 ? void 0 : getLeadContactLead.status) == "sold" &&
                        status &&
                        status !== "sold") {
                        // get single sold lead
                        const data = yield model.getSaleLeadbyLeadId({
                            lead_id: parseInt(id),
                        });
                        if (data.length) {
                            //  delete lead sale history
                            yield model.deleteLeadSaleHistory((_b = data[0]) === null || _b === void 0 ? void 0 : _b.id);
                            // delete lead sale
                            yield model.deleteLeadSale(data[0].id);
                        }
                        // insert into lead tracking
                        yield model.insertInLeadTracking({
                            tracking_type: "lead",
                            action_type: "update",
                            description: (contact_lead === null || contact_lead === void 0 ? void 0 : contact_lead.description) ||
                                `From Sold Status, The Lead Has Been Edited to Other Status`,
                            lead_id: parseInt(id),
                            org_id: organization_id,
                            due_amount: 0,
                            paid_amount: 0,
                            call_note: call_note,
                            sale_amount: 0,
                            admin_id,
                        });
                    }
                    else if ((getLeadContactLead === null || getLeadContactLead === void 0 ? void 0 : getLeadContactLead.status) != "sold" &&
                        status &&
                        status === "sold") {
                        const modified_sale_amount = sale_amount ? sale_amount : 0;
                        const modified_paid_amount = paid_amount ? paid_amount : 0;
                        const due_amount = modified_sale_amount - modified_paid_amount;
                        // insert into to lead_sale table
                        const leadSaleRes = yield model.addToLeadSale({
                            lead_id: parseInt(id),
                            requirement,
                            sale_amount: modified_sale_amount,
                            paid_amount: modified_paid_amount,
                            sale_time,
                            sale_by,
                            sale_type,
                            due_amount,
                        });
                        // insert into to lead_sale history table
                        yield model.historyLeadSaleInsert({
                            ls_id: leadSaleRes[0].id,
                            sale_amount: modified_sale_amount,
                            paid_amount: modified_paid_amount,
                            due_amount,
                        });
                        // insert into lead tracking
                        yield model.insertInLeadTracking({
                            action_type: "create-and-sold",
                            tracking_type: "lead",
                            description: (contact_lead === null || contact_lead === void 0 ? void 0 : contact_lead.description) || (contact_lead === null || contact_lead === void 0 ? void 0 : contact_lead.requirement),
                            lead_id: parseInt(id),
                            org_id: organization_id,
                            due_amount,
                            paid_amount: modified_paid_amount,
                            sale_amount: modified_sale_amount,
                            call_note: call_note,
                            emp_id: sale_by,
                        });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // get lead by assign_lead from contact_lead table
    getLeadByAssignLeadId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { limit, skip, page, contact_person, searchPrm } = req
                    .query;
                // limit
                const limitData = parseInt(limit) || 10;
                // page
                const pageData = parseInt(page) || 1;
                // skip
                const skipData = (pageData - 1) * limitData;
                const model = this.Model.crmLeadModel(trx);
                const { total, data } = yield model.getLeadByAssignLeadId({
                    id,
                    limit: limitData,
                    skip: skipData,
                    contact_person,
                    searchPrm,
                    assign_lead: id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    total,
                    data,
                };
            }));
        });
    }
    // get all leads By lead Status
    getDashboardLeadsStatics(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const model = this.Model.crmLeadModel(trx);
                const { data, total } = yield model.getLeadCounts(organization_id);
                if (!data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "data doesn't exist",
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    total,
                    data,
                };
            }));
        });
    }
    // get lifetime report
    getLifeTimeReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter_by } = req.query;
            const { organization_id } = req.admin;
            const filterBy = filter_by ? filter_by : "product";
            const model = this.Model.crmLeadModel();
            const { data, total } = yield model.getLifeTimeReport(organization_id, {
                filter_by: filterBy,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get daily report
    getDailyReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter_by } = req.query;
            const { organization_id } = req.admin;
            const filterBy = filter_by ? filter_by : "lead";
            const model = this.Model.crmLeadModel();
            const { data, total } = yield model.getDailyReport(organization_id, {
                filter_by: filterBy,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // lead payment
    leadPayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const leadInfo = __rest(req.body, []);
                const settingModel = this.Model.crmSettingModel(trx);
                const model = this.Model.crmLeadModel(trx);
                const EmpModel = this.Model.employeeModel(trx);
                // check the lead exist or not
                const isLeadExist = yield model.getSingleLead(leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id);
                if (!isLeadExist) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "lead doesn't exist",
                    };
                }
                if ((leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status) === "sold") {
                    const soldInfo = {
                        lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                        requirement: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.requirement,
                        sale_amount: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_amount,
                        sale_time: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_time,
                        sale_by: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_by,
                        sale_type: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_type,
                    };
                    // add lead to lead_sale table
                    yield model.addToLeadSale(soldInfo);
                    yield model.updateContactLead({ status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status }, leadInfo.lead_id);
                    yield model.addLeadToHistoryContact({
                        lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                        status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                    };
                    // update status
                }
                // check assign_lead exist or not
                const isAssignLeadExist = yield EmpModel.getSingleEmployee({
                    id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.assign_lead,
                });
                if (!isAssignLeadExist.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "assign lead doesn't exist",
                    };
                }
                // add lead to contact table
                const updateContactLead = {
                    description: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.description,
                    follow_up: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up,
                    follow_up_date: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up_date,
                    phone_call: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.phone_call,
                    call_note: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.call_note,
                    status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                };
                yield model.updateContactLead(updateContactLead, leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id);
                // add lead to history
                const historyInfo = {
                    lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                    description: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.description,
                    follow_up: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up,
                    follow_up_date: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up_date,
                    phone_call: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.phone_call,
                    call_note: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.call_note,
                    status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                };
                yield model.addLeadToHistoryContact(historyInfo);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // add contact lead
    addContactLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const leadInfo = __rest(req.body, []);
                const settingModel = this.Model.crmSettingModel(trx);
                const model = this.Model.crmLeadModel(trx);
                const EmpModel = this.Model.employeeModel(trx);
                // check the lead exist or not
                const isLeadExist = yield model.getSingleLead(leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id);
                if (!isLeadExist) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "lead doesn't exist",
                    };
                }
                if ((leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status) === "sold") {
                    const soldInfo = {
                        lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                        requirement: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.requirement,
                        sale_amount: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_amount,
                        sale_time: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_time,
                        sale_by: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_by,
                        sale_type: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.sale_type,
                    };
                    // add lead to lead_sale table
                    yield model.addToLeadSale(soldInfo);
                    yield model.updateContactLead({ status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status }, leadInfo.lead_id);
                    yield model.addLeadToHistoryContact({
                        lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                        status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                    };
                    // update status
                }
                // check assign_lead exist or not
                const isAssignLeadExist = yield EmpModel.getSingleEmployee({
                    id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.assign_lead,
                });
                if (!isAssignLeadExist.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "assign lead doesn't exist",
                    };
                }
                // add lead to contact table
                const updateContactLead = {
                    description: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.description,
                    follow_up: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up,
                    follow_up_date: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up_date,
                    phone_call: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.phone_call,
                    call_note: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.call_note,
                    status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                };
                yield model.updateContactLead(updateContactLead, leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id);
                // add lead to history
                const historyInfo = {
                    lead_id: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.lead_id,
                    description: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.description,
                    follow_up: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up,
                    follow_up_date: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.follow_up_date,
                    phone_call: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.phone_call,
                    call_note: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.call_note,
                    status: leadInfo === null || leadInfo === void 0 ? void 0 : leadInfo.status,
                };
                yield model.addLeadToHistoryContact(historyInfo);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // assign after sales
    assignAfterSales(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const lead_id = req.body["lead_id"];
                const { organization_id, id } = req.admin;
                const model = this.Model.crmLeadModel(trx);
                const getSingleLead = yield this.Model.crmLeadModel().getSingleLead(Number(req.body["lead_id"]));
                // check the lead exist or not
                const isLeadExist = yield model.getSingleLead(lead_id);
                if (!isLeadExist) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: "lead doesn't exist",
                    };
                }
                const afterSalesInfo = {
                    lead_id: lead_id,
                    organization_id: organization_id,
                    assign_to: req.body["assign_to"],
                    assign_by: id,
                    follow_up_date: req.body["follow_up_date"],
                    note: req.body["note"],
                    type: req.body["type"],
                };
                // Conditionally add paying_amount and payment_collection_date for payment_collection type
                if (req.body["type"] === "admin_payment") {
                    afterSalesInfo.paying_amount = req.body["paying_amount"];
                    afterSalesInfo.payment_collection_date =
                        req.body["payment_collection_date"];
                    afterSalesInfo.service_provided = true;
                }
                if (req.body["type"] === "payment_collection") {
                    afterSalesInfo.targeted_amount = req.body["targeted_amount"];
                }
                yield model.insertAfterSale(afterSalesInfo);
                const personinfo = yield this.Model.userModel().getProfile(parseInt(req.body["assign_to"]));
                const message = `${personinfo[0].name} has been assigned to handle the after-sales service for the requested service type: ${req.body["type"]}.`;
                const paid_amount = parseInt(getSingleLead[0].lead_sale.paid_amount) +
                    parseInt(req.body["paying_amount"]);
                const due_amount = parseInt(getSingleLead[0].lead_sale.due_amount) -
                    parseInt(req.body["paying_amount"]);
                if (req.body["type"] === "admin_payment") {
                    yield this.Model.crmLeadModel().updateLeadSale({
                        paid_amount: paid_amount,
                        due_amount: due_amount,
                    }, parseInt(req.body["lead_id"]));
                }
                let description = "";
                const actionData = {
                    action_type: "create",
                    tracking_type: "after-sale",
                    lead_id: Number(req.body["lead_id"]),
                    emp_id: req.body["assign_to"],
                    org_id: organization_id,
                    description: description,
                    payment_collection_date: req.body["payment_collection_date"],
                    follow_up_date: req.body["follow_up_date"],
                };
                if (req.body["type"] === "admin_payment") {
                    const saleAmount = getSingleLead[0].lead_sale.sale_amount;
                    const paidAmount = req.body["paying_amount"];
                    const dueAmount = getSingleLead[0].lead_sale.due_amount - paidAmount; // Assuming due amount calculation here
                    description = `Payment collected. Sold amount: ${saleAmount}, paid amount: ${paidAmount}, due amount: ${dueAmount}`;
                    Object.assign(actionData, {
                        description: description,
                        due_amount: dueAmount,
                        paid_amount: paidAmount,
                        sale_amount: saleAmount,
                    });
                }
                else if (req.body["type"] === "training") {
                    description = `${personinfo[0].name} has been assigned the responsibility of providing Training`;
                    actionData.description = description;
                }
                else if (req.body["type"] === "payment_collection") {
                    description = `${personinfo[0].name} has been tasked with securing payments`; // Adjust this description as needed
                    actionData.description = description;
                }
                else if (req.body["type"] === "support") {
                    description =
                        description = `${personinfo[0].name}  has been tasked with providing Support.`; // Adjust this description as needed
                    actionData.description = description;
                }
                else {
                    description = `${personinfo[0].name} has been assigned for ${req.body["type"]}`;
                    actionData.description = description;
                }
                yield this.Model.crmLeadModel().insertInLeadTracking(actionData);
                //==============================================
                //                Notification Section
                //==============================================
                const notify = yield this.Model.commonModel().createNotification({
                    type: "after-sales",
                    ref_id: Number(req.body["lead_id"]),
                    message: `An After Sales Support Has Been Assigned To You On ${req.body["type"]}`,
                });
                yield this.Model.commonModel().addEmployeeNotification({
                    notification_id: notify[0].id,
                    user_id: Number(req.body["assign_to"]),
                });
                const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(Number(req.body["assign_to"]));
                const getUserName = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                if (!get_user_socket_id || !get_user_socket_id.socket_id) {
                    console.error("Socket ID not found for user:", Number(req.body["assign_to"]));
                }
                else {
                    console.log("Socket ID:", get_user_socket_id.socket_id);
                }
                if (get_user_socket_id && get_user_socket_id.socket_id) {
                    socket_1.io.to(get_user_socket_id.socket_id).emit("notification", {
                        message: notify[0].message,
                        type: "after-sales",
                        ref_id: Number(req.body["lead_id"]),
                    });
                    console.log("Notification emitted to socket ID:", get_user_socket_id.socket_id);
                }
                else {
                    console.error("Failed to emit notification, socket ID is invalid.");
                }
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get all contact leads
    getAllContactLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, searchPrm } = req.query;
            const { total, data } = yield this.Model.crmLeadModel().getAllContactLead({
                limit: limit,
                skip: skip,
                searchPrm: searchPrm,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    //created by armaan
    getMonthWiseReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filter_by, from_date, to_date, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const filterBy = filter_by ? filter_by : "product";
            const model = this.Model.crmLeadModel();
            const { data, total } = yield model.getMonthWiseReport(organization_id, {
                filter_by: filterBy,
                from_date,
                to_date,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get lead tracking
    getLeadTracking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const { id } = req.params;
            const { from_date, to_date, limit, skip, tracking_type } = req.query;
            const { data, total } = yield this.Model.crmLeadModel().getAllLeadTracking({
                lead_id: parseInt(id),
                org_id: organization_id,
                from_date: from_date,
                to_date: to_date,
                tracking_type: tracking_type,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get all lead by employee id
    getAllLeadByEmpId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const { id } = req.params;
            const { key, from_date, to_date, limit, skip } = req.query;
            const { data, total } = yield this.Model.crmLeadModel().getAllLeadsByEmpId({
                id,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                key: key,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single lead history by id
    getLeadHistoryById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const leadModel = this.Model.crmLeadModel();
            // single lead model data
            const getSingleLead = yield leadModel.getSingleLead(parseInt(req.params.id));
            if (!getSingleLead.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const lead_tracking = yield leadModel.getSingleLeadTracking_view(parseInt(req.params.id));
            const contact_history_data = yield this.Model.crmEmployeeLead().getContactHistoryByLeadId(parseInt(req.params.id));
            const visit_history_data = yield this.Model.crmEmployeeLead().getVisitHistoryByLeadId(parseInt(req.params.id));
            const forward_history_data = yield this.Model.crmEmployeeLead().getHistoryForwardLeadByLeadId(parseInt(req.params.id));
            const agreement_history_data = yield this.Model.crmEmployeeLead().getAgreementHistoryLeadByLeadId(parseInt(req.params.id));
            const demo_history_data = yield this.Model.crmEmployeeLead().getDemoHistoryLeadByLeadId(parseInt(req.params.id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: {
                    lead_info: getSingleLead[0],
                    contact_history_data,
                    visit_history_data,
                    forward_history_data,
                    agreement_history_data,
                    demo_history_data,
                    lead_tracking,
                },
            };
        });
    }
}
exports.default = LeadService;
