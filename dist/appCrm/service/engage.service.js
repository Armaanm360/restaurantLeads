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
class LeadEngageService extends abstract_service_1.default {
    constructor() {
        super();
    }
    EngageContactLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const { id: emp_id, organization_id, name } = req.employee;
                const { id } = req.params;
                const leadModel = this.Model.crmLeadModel(trx);
                // update contact lead
                yield leadModel.updateContactLead(Object.assign({}, req.body), parseInt(id));
                // insert in history contact lead
                yield leadModel.addLeadToHistoryContact(Object.assign(Object.assign({}, req.body), { lead_id: id, assign_lead: emp_id }));
                // insert into lead tracking
                yield leadModel.insertInLeadTracking({
                    action_type: "engaged",
                    tracking_type: "lead",
                    lead_id: parseInt(id),
                    emp_id,
                    org_id: organization_id,
                    call_note: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.call_note,
                    follow_up_date: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.follow_up_date,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // sale engage lead
    SaleEngageLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { id: employee_id, organization_id, name } = req.employee;
                const { sale_amount, paid_amount, requirement, sale_time, sale_type } = req.body;
                const model = this.Model.crmEmployeeLead(trx);
                const LModel = this.Model.crmLeadModel(trx);
                const isLeadSold = yield model.isLeadSold(id);
                if (isLeadSold.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "the lead already sold",
                    };
                }
                const isLeadExist = yield model.isLeadExist(id);
                if (!isLeadExist.data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "the lead doesn't exist",
                    };
                }
                // update contact lead history status
                yield LModel.addLeadToHistoryContact({
                    lead_id: id,
                    status: "sold",
                });
                // update contact lead
                yield LModel.updateContactLead({ status: "sold" }, id);
                const due_amount = sale_amount - paid_amount;
                // insert into to lead_sale table
                const leadSaleRes = yield LModel.addToLeadSale({
                    lead_id: id,
                    requirement,
                    sale_amount,
                    sale_time,
                    sale_by: employee_id,
                    sale_type,
                    due_amount,
                    paid_amount,
                });
                console.log({ leadSaleRes });
                // insert into to lead_sale history table
                yield LModel.historyLeadSaleInsert({
                    ls_id: leadSaleRes[0].id,
                    sale_amount,
                    paid_amount,
                    due_amount,
                });
                // insert into lead tracking table
                yield LModel.insertInLeadTracking({
                    action_type: "sold",
                    tracking_type: "lead",
                    description: requirement,
                    lead_id: id,
                    emp_id: employee_id,
                    org_id: organization_id,
                    due_amount: due_amount,
                    paid_amount: paid_amount,
                    sale_amount,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // engage agreement
    EngageAgreement(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { id: emp_id, organization_id, name } = req.employee;
                const model = this.Model.crmEmployeeLead(trx);
                const isLeadExist = yield model.isLeadExist(parseInt(id));
                if (!isLeadExist.data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "the lead doesn't exist",
                    };
                }
                yield model.EngageLeadAgreementHistory(Object.assign(Object.assign({}, req.body), { lead_id: id, assign_lead: emp_id }));
                // insert into lead tracking
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: "engaged",
                    tracking_type: "lead",
                    description: `Agreement paper sent by ${name}`,
                    lead_id: parseInt(id),
                    emp_id: emp_id,
                    org_id: organization_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // engage demo link
    EngageDemoLink(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { id: emp_id, organization_id, name } = req.employee;
                const model = this.Model.crmEmployeeLead(trx);
                const isLeadExist = yield model.isLeadExist(parseInt(id));
                if (!isLeadExist.data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "the lead doesn't exist",
                    };
                }
                yield model.LeadDemoLink(Object.assign(Object.assign({}, req.body), { lead_id: parseInt(id), assign_lead: emp_id }));
                // insert into lead tracking
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: "engaged",
                    tracking_type: "lead",
                    description: `Demo link sent by ${name}`,
                    lead_id: parseInt(id),
                    emp_id: emp_id,
                    org_id: organization_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // engae visit to the lead
    EngageVisit(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id: emp_id, organization_id, name } = req.employee;
                const { id } = req.params;
                const model = this.Model.crmEmployeeLead(trx);
                const visitInfo = __rest(req === null || req === void 0 ? void 0 : req.body, []);
                const isLeadExist = yield model.isLeadExist(parseInt(id));
                if (!isLeadExist.data) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "the lead doesn't exist",
                    };
                }
                yield model.EngageLeadVisit(Object.assign(Object.assign({}, visitInfo), { lead_id: parseInt(id), assign_lead: emp_id }));
                // insert into lead tracking
                yield this.Model.crmLeadModel().insertInLeadTracking({
                    action_type: "engaged",
                    tracking_type: "lead",
                    description: `Visited by ${name}`,
                    lead_id: parseInt(id),
                    emp_id: emp_id,
                    org_id: organization_id,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // engage forward
    EngageLeadForward(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { id: employee_id, organization_id, name } = req.employee;
                const model = this.Model.crmEmployeeLead(trx);
                const LModel = this.Model.crmLeadModel(trx);
                const { forward_to, forward_note } = req.body;
                const isLeadExist = yield LModel.getSingleLead(parseInt(id));
                if (!isLeadExist.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "The lead doesn't exist",
                    };
                }
                const { contact_lead, lead_assigns_emp, contact_lead_forward } = isLeadExist[0];
                // update contact
                yield LModel.updateContactLead({ forward_status: 1 }, parseInt(id));
                // update contact lead history status
                yield LModel.addLeadToHistoryContact({
                    lead_id: parseInt(id),
                    forward_status: "1",
                });
                // insert in lead forward
                yield Promise.all(forward_to.map((person) => __awaiter(this, void 0, void 0, function* () {
                    yield LModel.insertLeadForward({
                        cl_id: contact_lead.id,
                        forwarded_by: employee_id,
                        forwarded_to: person,
                        forward_note: forward_note ? forward_note : "forwarded",
                    });
                })));
                const findLeadAssign = lead_assigns_emp === null || lead_assigns_emp === void 0 ? void 0 : lead_assigns_emp.find((item) => item.emp_assign_id == employee_id);
                if (findLeadAssign) {
                    // remove emp from contact lead assign
                    yield LModel.removeContactLeadAssignByEmpId(contact_lead.id, employee_id);
                }
                const findLdFrwrdAssign = contact_lead_forward === null || contact_lead_forward === void 0 ? void 0 : contact_lead_forward.find((item) => item.forwarded_by == employee_id);
                if (findLdFrwrdAssign) {
                    yield LModel.removeContactForward(contact_lead.id, employee_id);
                }
                // insert into lead tracking
                yield Promise.all(forward_to.map((person) => __awaiter(this, void 0, void 0, function* () {
                    yield this.Model.crmLeadModel().insertInLeadTracking({
                        tracking_type: "lead",
                        action_type: "forwarded",
                        lead_id: parseInt(id),
                        forward_note,
                        emp_id: person,
                        org_id: organization_id,
                    });
                })));
                //==============================================
                //                Notification Section
                //==============================================
                const notify = yield this.Model.commonModel().createNotification({
                    type: "lead-forward",
                    ref_id: parseInt(id),
                    message: `${name} Has Forwarded A Lead To You`,
                });
                yield Promise.all(forward_to.map((person) => __awaiter(this, void 0, void 0, function* () {
                    yield this.Model.commonModel().addEmployeeNotification({
                        notification_id: notify[0].id,
                        user_id: person,
                    });
                })));
                const allUsers = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id, forward_to);
                if (!allUsers.length) {
                    console.error("No connected users found.");
                }
                else {
                    allUsers.forEach((user) => {
                        if (user && user.socket_id) {
                            socket_1.io.to(user.socket_id).emit("notification", {
                                message: notify[0].message,
                                type: "lead-forward",
                                ref_id: id,
                            });
                            console.log("Notification emitted to socket ID:", user.socket_id);
                        }
                        else {
                            console.error("Socket ID not found for user:", user.id);
                        }
                    });
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
    // insert lead activity
    insertLeadActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: emp_id, organization_id } = req.employee;
            yield this.Model.crmLeadModel().insertInLeadTracking({
                emp_id,
                lead_id: parseInt(req.params.id),
                tracking_type: "lead",
                description: req.body.description,
                action_type: "activity",
                org_id: organization_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // after sale lead
    updateAfterSaleLead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { id: employee_id, organization_id, name } = req.employee;
                const model = this.Model.crmEmployeeLead(trx);
                const LModel = this.Model.crmLeadModel(trx);
                //get single afterLeadSale
                const singleAfterSale = yield model.getSingleAfterSale(Number(id));
                const getSingleLead = yield this.Model.crmLeadModel().getSingleLead(Number(req.body["lead_id"]));
                yield model.updateAfterSaleLead(Number(id), req.body);
                const paid_amount = parseInt(getSingleLead[0].lead_sale.paid_amount) +
                    parseInt(req.body["paying_amount"]);
                const due_amount = parseInt(getSingleLead[0].lead_sale.due_amount) -
                    parseInt(req.body["paying_amount"]);
                if (singleAfterSale[0].type === "payment_collection") {
                    yield this.Model.crmLeadModel().updateLeadSale({
                        paid_amount: paid_amount,
                        due_amount: due_amount,
                    }, parseInt(req.body["lead_id"]));
                }
                const personinfo = yield this.Model.userModel().getProfile(employee_id);
                let description = "";
                const actionData = {
                    action_type: "create",
                    tracking_type: "after-sale",
                    lead_id: Number(req.body["lead_id"]),
                    emp_id: employee_id,
                    org_id: organization_id,
                    description: "",
                    payment_collection_date: req.body["payment_collection_date"],
                    follow_up_date: req.body["follow_up_date"],
                    remarks: req.body["note"],
                };
                if (singleAfterSale[0].type === "payment_collection") {
                    const saleAmount = getSingleLead[0].lead_sale.sale_amount;
                    const paidAmount = req.body["paying_amount"];
                    const dueAmount = getSingleLead[0].lead_sale.due_amount - paidAmount; // Assuming due amount calculation here
                    description = `Payment collected By ${personinfo[0].name} Sold amount: ${saleAmount}, paid amount: ${paidAmount}, due amount: ${dueAmount}`;
                    Object.assign(actionData, {
                        description: description,
                        due_amount: dueAmount,
                        paid_amount: paidAmount,
                        sale_amount: saleAmount,
                    });
                }
                else if (singleAfterSale[0].type === "training") {
                    description = "Training provided"; // Adjust this description as needed
                    actionData.description = description;
                }
                else if (singleAfterSale[0].type === "support") {
                    description = "Support provided"; // Adjust this description as needed
                    actionData.description = description;
                }
                else {
                    description = "Action taken"; // Fallback description
                    actionData.description = description;
                }
                yield this.Model.crmLeadModel().insertInLeadTracking(actionData);
                //employee to admin
                //==============================================
                //                Notification Section
                //==============================================
                const get_user_socket_id = yield this.Model.employeeModel().getSingleInfoEmployee(employee_id);
                const notify = yield this.Model.commonModel().createNotificationAdmin({
                    type: "after-sale-service",
                    ref_id: Number(req.body["lead_id"]),
                    message: `${get_user_socket_id.name} has finished his after sale service`,
                });
                // Send notification to admins
                if (get_user_socket_id && get_user_socket_id.socket_id) {
                    const allUsers = yield this.Model.UserAdminModel().getAllAdminSocket(organization_id); // Fetch all connected users
                    if (!allUsers || allUsers.length === 0) {
                        console.error("No connected users found.");
                    }
                    else {
                        console.log("All connected users:", allUsers);
                        allUsers.forEach((user) => {
                            if (user && user.socket_id) {
                                socket_1.io.to(user.socket_id).emit("notification", {
                                    message: notify[0].message,
                                    type: "leave",
                                    ref_id: Number(req.body["lead_id"]),
                                });
                                this.Model.commonModel().addAdminNotification({
                                    notification_id: notify[0].id,
                                    user_id: user.id,
                                });
                                console.log("Notification emitted to socket ID:", user.socket_id);
                            }
                            else {
                                console.error("Socket ID not found for user:", user.id);
                            }
                        });
                    }
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
}
exports.default = LeadEngageService;
