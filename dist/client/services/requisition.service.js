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
const notification_service_1 = __importDefault(require("../../common/commonService/notification.service"));
class employeeRequisitionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getMyRequisitions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.employee;
            const { limit, skip, name, employee_name, status, employee_id, item_id, category, from_date, to_date, } = req.query;
            const { total, data } = yield this.Model.requisitionModel().getAllRequisitions(organization_id, {
                name: name,
                employee_name: employee_name,
                status: status,
                category: category,
                employee_id: id,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //get my items
    getStockItems(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.employee;
            const { data } = yield this.Model.requisitionModel().getAllItems(organization_id, {});
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    //create a new item for requisition
    createRequisition(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.requisitionModel(trx);
                const notifyService = new notification_service_1.default();
                const { organization_id, id } = req.employee;
                // Ensure req.body is an array
                const requisitions = Array.isArray(req.body) ? req.body : [req.body];
                const createdRequisitions = [];
                for (const requisitionData of requisitions) {
                    const fullRequisitionData = Object.assign(Object.assign({}, requisitionData), { user_id: id, organization_id: organization_id, status: 'PENDING' });
                    const [requisition] = yield model.createRequisition(fullRequisitionData);
                    createdRequisitions.push(requisition);
                    const requisitionTrack = yield model.getSingleRequisition(requisition.id);
                    // Insert requisition track
                    yield model.insertRequisitionTrack({
                        requisition_id: requisition.id,
                        status: 'PENDING',
                        track_description: `A requisition has been submitted by ${requisitionTrack.user_name} for ${requisitionTrack.item_name} on ${new Date(requisitionTrack.created_at).toLocaleString('en-US', {
                            timeZone: 'Asia/Dhaka',
                            dateStyle: 'long',
                            timeStyle: 'short',
                        })} (BST), citing the reason: "${requisitionTrack.require_reason}".`,
                    });
                    // Create notification for each requisition
                    const notificationPayload = {
                        user_id: id,
                        type: 'requisition',
                        ref_id: requisition.id,
                        message: `Has Added A New Requisition`,
                        organization_id: organization_id,
                    };
                    // Send notification to admin
                    yield notifyService.employeeToAllAdmin(notificationPayload);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: `${createdRequisitions.length} Requisition(s) Submitted Successfully`,
                };
            }));
        });
    }
    //create a new item for requisition
    updateRequisition(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const status = req.body.status;
                const model = this.Model.requisitionModel();
                const requisition_id = Number(req.params.id);
                yield model.updateRequisition(requisition_id, req.body);
                const requisitionTrack = yield model.getSingleRequisition(requisition_id);
                //requisition track
                yield model.insertRequisitionTrack({
                    requisition_id: requisition_id,
                    status: 'UPDATE',
                    track_description: `${requisitionTrack.user_name} has updated the requisition`,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Requisition Has Been Updated',
                };
            }));
        });
    }
    //get my requisition track
    //get all discussion and comments
    getSingleRequisitionTrack(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.requisitionModel();
            const requisition_id = Number(req.params.id);
            const data = yield model.getSingleRequisitionTrack(requisition_id);
            // Return formatted response
            return {
                success: true,
                data: data,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.default = employeeRequisitionService;
