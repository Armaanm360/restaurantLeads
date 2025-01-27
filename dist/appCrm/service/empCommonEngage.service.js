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
class EmpCommonEngageService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get all product
    getAllProduct(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.retrieveProduct(organization_id, {
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
    getAllSource(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.retrieveSources(organization_id, {
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
    // get all organization
    getAllOrganization(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.retrieveOrganization(organization_id, {
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
    // get all country
    getAllCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.retrieveCountry(organization_id, {
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
    // get all city
    getallCityByCountry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.getAllCityByCountry(organization_id, {
                    id,
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
    // get all area by city
    getAllAreaByCity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { limit, skip } = req.query;
                const { organization_id } = req.employee;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const { data, total } = yield model.getAllAreaByCity(organization_id, {
                    id,
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
    // get all employee
    getAllEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const { organization_id } = req.employee;
                const { limit, skip } = req.query;
                // limit
                const limitData = limit ? limit : 10;
                // skip
                const skipData = skip ? skip : 0;
                const model = this.Model.crmSettingModel();
                const empModel = this.Model.employeeModel();
                const { data, total } = yield empModel.getAllEmploye({
                    organization_id,
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
}
exports.default = EmpCommonEngageService;
