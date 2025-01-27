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
const abstract_controller_1 = __importDefault(require("../../abstract/abstract.controller"));
const monthlyTarget_service_1 = __importDefault(require("../service/monthlyTarget.service"));
const monthlyTarget_validation_1 = __importDefault(require("../utils/validation/setting/monthlyTarget.validation"));
class CRMmonthlyTargetController extends abstract_controller_1.default {
    constructor() {
        super();
        this.MonthlyTargetController = new monthlyTarget_service_1.default();
        this.validator = new monthlyTarget_validation_1.default();
        // assign monthly target
        this.assingMonthlyTarget = this.asyncWrapper.wrap({ bodySchema: this.validator.CreateMonthlyTarget }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.MonthlyTargetController.assignMonthlyTarget(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // retrieve monthly target
        this.retrieveMonthlyTarget = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.MonthlyTargetController.retrieveMonthlyTarget(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // retrieve monthly target
        this.retrieveMonthlyTargetWithAllEmp = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.MonthlyTargetController.retrieveMonthlyTargetWithAllEmp(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // update monthly target
        this.updateMonthlyTarget = this.asyncWrapper.wrap({ bodySchema: this.validator.updateMonthlyTarget }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.MonthlyTargetController.updateMonthlyTarget(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // delete montly target
        this.deleteMonthlyTarget = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.MonthlyTargetController.deleteMonthlyTarget(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get sinlge monthly target
        this.retrieveSingleMonthlyTarget = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.MonthlyTargetController.retrieveSingleMonthlyTarget(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = CRMmonthlyTargetController;
