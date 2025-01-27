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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class CRMEmpSupportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // insert support
    insertSupport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id: emp_id } = req.employee;
                const { lead_id, type, sub_type, sup_description, sup_medium } = req.body;
                const leadModel = this.Model.crmLeadModel(trx);
                const empLeadmodel = this.Model.crmEmployeeLead(trx);
                if (sub_type == "call") {
                    // insert in after sale
                    yield leadModel.insertAfterSale({
                        lead_id,
                        organization_id,
                        sub_type,
                        type,
                        sup_description,
                        sup_given_by: emp_id,
                    });
                    // insert in lead tracking
                    yield leadModel.insertInLeadTracking({
                        lead_id,
                        emp_id,
                        call_note: sup_description,
                        action_type: "call",
                        tracking_type: "lead",
                        org_id: organization_id,
                    });
                    // insert history contact lead
                    yield leadModel.addLeadToHistoryContact({
                        lead_id,
                        phone_call: 1,
                        assign_lead: emp_id,
                        call_note: sup_description,
                    });
                }
                else if (sub_type == "visit") {
                    // insert in after sale
                    yield leadModel.insertAfterSale({
                        lead_id,
                        organization_id,
                        sub_type,
                        type,
                        sup_given_by: emp_id,
                        sup_description,
                    });
                    // insert in lead tracking
                    yield leadModel.insertInLeadTracking({
                        lead_id,
                        emp_id,
                        description: sup_description,
                        action_type: "visit",
                        tracking_type: "lead",
                        org_id: organization_id,
                    });
                    // insert lead visit history
                    yield empLeadmodel.EngageLeadVisit({
                        visit_note: sup_description,
                        lead_id,
                        assign_lead: emp_id,
                        visit_status: 1,
                    });
                }
                else if (sub_type == "online") {
                    // insert in after sale
                    yield leadModel.insertAfterSale({
                        lead_id,
                        organization_id,
                        sub_type,
                        type,
                        sup_medium,
                        sup_description,
                        sup_given_by: emp_id,
                    });
                    // insert in lead tracking
                    yield leadModel.insertInLeadTracking({
                        lead_id,
                        emp_id,
                        description: sup_description,
                        action_type: "support",
                        tracking_type: "lead",
                        org_id: organization_id,
                    });
                    // insert history contact lead
                    yield leadModel.addLeadToHistoryContact({
                        lead_id,
                        online: 1,
                        description: sup_description,
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get all after sales support by lead id
    getAllSupportByLeadId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.employee;
            const { id } = req.params;
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
}
exports.default = CRMEmpSupportService;
