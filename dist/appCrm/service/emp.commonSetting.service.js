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
class CommonSettingService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create product service
    creatSupportType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const model = this.Model.crmSettingModel(trx);
                const { data } = yield model.getAllSupportType(organization_id, {
                    name: req.body.name,
                });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield model.insertSupportType({
                    organization_id,
                    created_by: id,
                    name: req.body.name,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    //  get all support type
    getAllSupportType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const { limit, skip, name } = req.query;
                const { total, data } = yield this.Model.crmSettingModel().getAllSupportType(organization_id, {
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
    // update support type
    updateSupportType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.employee;
            const model = this.Model.crmSettingModel();
            const { data } = yield model.getAllSupportType(organization_id, {
                name: req.body.name,
            });
            if (data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            yield model.updateSupportType({
                organization_id,
                id: parseInt(req.params.id),
                name: req.body.name,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
}
exports.default = CommonSettingService;
