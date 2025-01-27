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
class AdminNoticeService extends abstract_service_1.default {
    constructor() {
        super();
    }
    createNotice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id: admin_id } = req.admin;
            const notifyService = new notification_service_1.default();
            const files = req.files || [];
            if (files.length) {
                req.body['docs'] = files[0].filename;
            }
            const res = yield this.Model.noticeModel().createNotice(Object.assign(Object.assign({}, req.body), { created_by: admin_id, org_id: organization_id }));
            //==============================================
            //                Notification Section
            //==============================================
            const notificationPayload = {
                type: 'notice',
                ref_id: res[0].id,
                message: `New notice - ${req.body.title}`,
                organization_id: organization_id,
                title: `${req.body.title}`,
                description: `${req.body.description}`,
            };
            yield notifyService.adminToAllEmployee(notificationPayload);
            //==============================================
            //            End of Notification Section
            //==============================================
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get all notice
    getAllNotice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const { searchPrm, status, limit, skip } = req.query;
            const { data, total } = yield this.Model.noticeModel().getAllNotice({
                org_id: organization_id,
                searchPrm: searchPrm,
                status: status,
                limit: limit,
                skip: skip,
            });
            return {
                code: this.StatusCode.HTTP_OK,
                total,
                data,
            };
        });
    }
    // get single notice
    getSingleNotice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.Model.noticeModel().getSingleNotice(parseInt(req.params.id), req.admin.organization_id);
            if (!data.length) {
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
        });
    }
    // update single notice
    updateSingleNotice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.Model.noticeModel().getSingleNotice(parseInt(req.params.id), req.admin.organization_id);
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { organization_id } = req.admin;
            const files = req.files || [];
            if (files.length) {
                req.body['docs'] = files[0].filename;
            }
            yield this.Model.noticeModel().updateNotice(req.body, {
                id: parseInt(req.params.id),
                org_id: organization_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.default = AdminNoticeService;
