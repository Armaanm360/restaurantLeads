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
class EmpNoticeService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get all notice
    getAllNotice(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.employee;
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
            const data = yield this.Model.noticeModel().getSingleNotice(parseInt(req.params.id), req.employee.organization_id);
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
}
exports.default = EmpNoticeService;
