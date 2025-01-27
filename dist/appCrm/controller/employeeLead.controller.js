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
const employeeLead_service_1 = __importDefault(require("../service/employeeLead.service"));
const engage_validator_1 = __importDefault(require("../utils/validation/employee/engage.validator"));
class EployeeLeadController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new employeeLead_service_1.default();
        this.validator = new engage_validator_1.default();
        // add initial lead
        this.addLead = this.asyncWrapper.wrap({ bodySchema: this.validator.createLeadValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.addLead(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get single lead
        this.getSingleLead = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getSingleLead(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // update lead
        this.updateLead = this.asyncWrapper.wrap({
            bodySchema: this.validator.updateLeadValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.updateLead(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get lead tracking
        this.getLeadTracking = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.getLeadTracking(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get current day all lead by employee id
        this.getCurrentDayAllLead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.getCurrentDayAllLead(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get current day all lead by employee id
        this.getCurrentDayAllAfterSaleLead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.getCurrentDayAllAfterSaleLead(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // get lead
        this.getAllLeadByEmp = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.service.getAllLeadByEmp(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // get lead
        this.getAllLead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.service.getAllLead(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // get all received/forwared lead list
        this.getAllReceivedLead = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.service.getAllReceivedLead(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // get all assigned lead list
        this.AllAssignedLeadList = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.service.AllAssignedLeadList(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //after sale lead list
        this.AllAfterSaleAssignedLeadList = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.service.AllAfterSaleAssignedLeadList(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        // get employee lead count by employee id & status
        this.getEmployeeLeadCount = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.service.getEmployeeLeadCount(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        // get employee monthly target
        this.getEmployeeMonthlyTarget = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.service.getEmployeeMonthlyTarget(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        // get today lead statistics
        this.getCurrentDayStatistics = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.service.getCurrentDayStatistics(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        // get lead permission
        this.getLeadPermission = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.service.getLeadPermission(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
        // // engage lead controller
        // public EngageLead = this.asyncWrapper.wrap(
        //   {
        //     bodySchema: this.validator.EngageLead,
        //     paramSchema: this.commonValidator.singleParamValidator("id"),
        //   },
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.service.EngageLead(req);
        //     res.status(code).json(data);
        //   }
        // );
        // get single Lead History by id
        this.getLeadHistoryById = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator() }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _r = yield this.service.getLeadHistoryById(req), { code } = _r, data = __rest(_r, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = EployeeLeadController;
