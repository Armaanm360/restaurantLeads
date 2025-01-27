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
class CrmEmpOrganizationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create organization controller
    createCategoryOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const organizationInfo = __rest(req.body, []);
                const { id, organization_id } = req.employee;
                const newOrg = Object.assign(Object.assign({}, organizationInfo), { organization_id, created_by_emp_id: id });
                const model = this.Model.crmSettingModel();
                const { data } = yield model.retrieveOrganization(organization_id, {
                    name: organizationInfo.name,
                });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                yield model.insertOrganizationType(newOrg);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // retrieve organization
    retrieveOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.employee;
                const { limit, skip, name } = req.query;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { total, data } = yield model.retrieveOrganization(organization_id, {
                    name: name,
                    limit: limitData,
                    skip: skipData,
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
    // Get all leads organization type
    getAllLeadsByOrganizationType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, from_date, to_date, limit, skip } = req.query;
            const { id } = req.params;
            const { total, data } = yield this.Model.crmSettingModel().getAllLeadsByOrganizationType({
                id: parseInt(id),
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
    // update organization
    updateOrganizatioType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { name } = req.body;
                const model = this.Model.crmSettingModel();
                const { data } = yield model.retrieveOrganization(req.employee.organization_id, {
                    name,
                });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                const result = yield model.EditOrganizationType({ id, name });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: result,
                };
            }));
        });
    }
    // delete organization
    deleteOrganizationType(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.crmSettingModel();
                const result = yield model.deleteOrganizationType(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data: result,
                };
            }));
        });
    }
    // retrieve single organization
    retrieveSingleOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.crmSettingModel();
                const { data } = yield model.retrieveSingleOrganization(id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    data,
                };
            }));
        });
    }
}
exports.default = CrmEmpOrganizationService;
