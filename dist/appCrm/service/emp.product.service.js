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
class CRMEmpProductService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // retrieve product service
    retrieveProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const { limit, skip, name } = req.query;
                const { total, data } = yield this.Model.crmSettingModel().retrieveProduct(organization_id, {
                    name: name,
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
            }));
        });
    }
    // get all lead by product
    getAllLeadByProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, from_date, to_date, limit, skip } = req.query;
            const { id: pid } = req.params;
            const { total, data } = yield this.Model.crmSettingModel().getAllLeadByProduct({
                id: parseInt(pid),
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
                key: key,
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
    // update product
    updateProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { name } = req.body;
                const model = this.Model.crmSettingModel();
                const result = yield model.updateProduct({ id, name });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // delete product
    deleteProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.crmSettingModel();
                const result = yield model.deleteProduct(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // retrieve single product
    retrieveSingleProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const model = this.Model.crmSettingModel();
            const { data } = yield model.retrieveSingleProduct(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
}
exports.default = CRMEmpProductService;
