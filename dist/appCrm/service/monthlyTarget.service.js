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
class CRMMonthlyTargetService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create organization controller
    assignMonthlyTarget(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { employee_ids, month, pd_target } = _a, rest = __rest(_a, ["employee_ids", "month", "pd_target"]);
                const { id, organization_id } = req.admin;
                req.body["organization_id"] = organization_id;
                const model = this.Model.crmSettingModel();
                const inputDate = new Date(month);
                const year = inputDate.getUTCFullYear();
                const months = inputDate.getUTCMonth();
                const startDate = new Date(Date.UTC(year, months, 1));
                const endDate = new Date(Date.UTC(year, months + 1, 0));
                const startDateStr = startDate.toISOString().split("T")[0];
                const endDateStr = endDate.toISOString().split("T")[0];
                const { data } = yield model.retrieveMonthlyTarget(organization_id, {
                    emp_ids: req.body.employee_ids,
                    from_date: startDateStr,
                    to_date: endDateStr,
                });
                if (data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: "Already assigned monthly target for this month",
                    };
                }
                yield Promise.all(employee_ids.map((emp) => __awaiter(this, void 0, void 0, function* () {
                    const mtRes = yield model.assignMonthlyTarget(Object.assign(Object.assign({}, rest), { employee_id: emp, month,
                        organization_id, created_by: id }));
                    if (pd_target) {
                        const pd_t_pld = pd_target.map((item) => {
                            return {
                                mt_id: mtRes[0].id,
                                pd_id: item.pd_id,
                                sale: item.sale,
                            };
                        });
                        yield model.assignMonthlyPdTarget(pd_t_pld);
                    }
                })));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get all monthly target
    retrieveMonthlyTargetWithAllEmp(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const { limit, skip, month, searchPrm } = req.query;
                let startDateStr;
                let endDateStr;
                if (month) {
                    const inputDate = new Date(month);
                    const year = inputDate.getUTCFullYear();
                    const months = inputDate.getUTCMonth();
                    const startDate = new Date(Date.UTC(year, months, 1));
                    const endDate = new Date(Date.UTC(year, months + 1, 0));
                    startDateStr = startDate.toISOString().split("T")[0];
                    endDateStr = endDate.toISOString().split("T")[0];
                }
                const { data: getAllEmp, total: empTotal } = yield this.Model.employeeModel().getAllEmploye({
                    organization_id,
                    key: searchPrm,
                });
                const { data: retriveMonthlyTarget, total } = yield this.Model.crmSettingModel().retrieveMonthlyTargetWithAllEmp(organization_id, {
                    emp_ids: req.body.employee_ids,
                    from_date: startDateStr,
                    to_date: endDateStr,
                    searchPrm: searchPrm,
                    limit: limit,
                    skip: skip,
                });
                const modifiedData = [];
                for (let i = 0; i < getAllEmp.length; i++) {
                    let found = false;
                    for (let j = 0; j < retriveMonthlyTarget.length; j++) {
                        if (getAllEmp[i].id == retriveMonthlyTarget[j].emp_id) {
                            modifiedData.push({
                                emp_id: getAllEmp[i].id,
                                emp_name: getAllEmp[i].name,
                                photo: getAllEmp[i].photo,
                                id: retriveMonthlyTarget[j].id,
                                month: retriveMonthlyTarget[j].month,
                                organization_id: retriveMonthlyTarget[j].organization_id,
                                phone_call: retriveMonthlyTarget[j].phone_call,
                                product_target: retriveMonthlyTarget[j].product_target,
                                sale_in_amount: retriveMonthlyTarget[j].sale_in_amount,
                                sale: retriveMonthlyTarget[j].sale,
                                visit: retriveMonthlyTarget[j].visit,
                            });
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        modifiedData.push({
                            emp_id: getAllEmp[i].id,
                            emp_name: getAllEmp[i].name,
                            photo: getAllEmp[i].photo,
                            id: null,
                            month: null,
                            organization_id: null,
                            phone_call: null,
                            product_target: null,
                            sale_in_amount: null,
                            sale: null,
                            visit: null,
                        });
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    total: empTotal,
                    data: modifiedData,
                };
            }));
        });
    }
    // get all monthly target
    retrieveMonthlyTarget(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const { limit, skip, month, searchPrm } = req.query;
                let startDateStr;
                let endDateStr;
                if (month) {
                    const inputDate = new Date(month);
                    const year = inputDate.getUTCFullYear();
                    const months = inputDate.getUTCMonth();
                    const startDate = new Date(Date.UTC(year, months, 1));
                    const endDate = new Date(Date.UTC(year, months + 1, 0));
                    startDateStr = startDate.toISOString().split("T")[0];
                    endDateStr = endDate.toISOString().split("T")[0];
                }
                const model = this.Model.crmSettingModel();
                const { total, data } = yield model.retrieveMonthlyTarget(organization_id, {
                    limit: limit,
                    skip: skip,
                    from_date: startDateStr,
                    to_date: endDateStr,
                    searchPrm: searchPrm,
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
    // update monthly target
    updateMonthlyTarget(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { pd_target_update, pd_target_add, pd_target_remove } = _a, targetInfo = __rest(_a, ["pd_target_update", "pd_target_add", "pd_target_remove"]);
                const { id } = req.params;
                const model = this.Model.crmSettingModel(trx);
                const data = yield this.Model.crmSettingModel().retrieveSingleMonthlyTarget(id);
                if (!data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                if (req.body.month) {
                    const inputDate = new Date(req.body.month);
                    const year = inputDate.getUTCFullYear();
                    const months = inputDate.getUTCMonth();
                    const startDate = new Date(Date.UTC(year, months, 1));
                    const endDate = new Date(Date.UTC(year, months + 1, 0));
                    const startDateStr = startDate.toISOString().split("T")[0];
                    const endDateStr = endDate.toISOString().split("T")[0];
                    const { data: monthCheck } = yield model.retrieveMonthlyTarget(req.admin.organization_id, {
                        emp_id: req.body.employee_id,
                        from_date: startDateStr,
                        to_date: endDateStr,
                    });
                    if (monthCheck.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Already assigned monthly target for this month",
                        };
                    }
                }
                yield model.updateMonthlyTarget(Object.assign(Object.assign({}, targetInfo), { id }));
                const { product_target } = data[0];
                if (pd_target_update === null || pd_target_update === void 0 ? void 0 : pd_target_update.length) {
                    yield Promise.all(pd_target_update.map((el) => __awaiter(this, void 0, void 0, function* () {
                        yield model.updateAssignMonthlyPdTarget({ pd_id: el.pd_id, sale: el.sale }, el.id);
                    })));
                }
                if (pd_target_add === null || pd_target_add === void 0 ? void 0 : pd_target_add.length) {
                    const distinct_pd = [];
                    console.log({ pd_target_add });
                    console.log({ product_target });
                    for (let i = 0; i < pd_target_add.length; i++) {
                        let found = false;
                        for (let j = 0; j < (product_target === null || product_target === void 0 ? void 0 : product_target.length); j++) {
                            if (pd_target_add[i].pd_id == product_target[j].pd_id) {
                                found = true;
                            }
                        }
                        if (!found) {
                            distinct_pd.push(pd_target_add[i]);
                        }
                    }
                    console.log({ distinct_pd });
                    if (distinct_pd.length) {
                        const pd_t_pld = distinct_pd.map((item) => {
                            return {
                                mt_id: parseInt(id),
                                pd_id: item.pd_id,
                                sale: item.sale,
                            };
                        });
                        yield model.assignMonthlyPdTarget(pd_t_pld);
                    }
                }
                if (pd_target_remove === null || pd_target_remove === void 0 ? void 0 : pd_target_remove.length) {
                    yield model.deleteMonthlyTargetProduct(pd_target_remove);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // delete monthly target
    deleteMonthlyTarget(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.crmSettingModel();
                yield model.deleteMonthlyTarget(id);
                yield model.deleteMonthlyTargetProductByMt_Id(parseInt(id));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // retrieve single target
    retrieveSingleMonthlyTarget(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.Model.crmSettingModel().retrieveSingleMonthlyTarget(id);
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
exports.default = CRMMonthlyTargetService;
