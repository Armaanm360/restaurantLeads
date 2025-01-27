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
const engage_validator_1 = __importDefault(require("../utils/validation/employee/engage.validator"));
const engage_service_1 = __importDefault(require("../service/engage.service"));
class LeadEngageControlller extends abstract_controller_1.default {
    constructor() {
        super();
        this.validator = new engage_validator_1.default();
        this.service = new engage_service_1.default();
        // engage contact lead
        this.EngageContactLead = this.asyncWrapper.wrap({
            bodySchema: this.validator.contactLeadValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.EngageContactLead(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // sale engage lead
        this.SaleEngageLead = this.asyncWrapper.wrap({
            bodySchema: this.validator.SaleValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.SaleEngageLead(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // engage agreement
        this.EngageAgreement = this.asyncWrapper.wrap({
            bodySchema: this.validator.aggreementValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.EngageAgreement(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // engage demo link
        this.EngageDemoLink = this.asyncWrapper.wrap({
            bodySchema: this.validator.DemoValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.EngageDemoLink(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // engage visit
        this.EngageVisit = this.asyncWrapper.wrap({
            bodySchema: this.validator.VisitValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.EngageVisit(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // engage Lead Forward
        this.EngageLeadForward = this.asyncWrapper.wrap({
            bodySchema: this.validator.ForwardValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.EngageLeadForward(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // insert activity
        this.insertLeadActivity = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.service.insertLeadActivity(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // after sale lead forward
        this.updateAfterSaleLead = this.asyncWrapper.wrap(
        // {
        //   bodySchema: this.validator.ForwardValidator,
        //   paramSchema: this.commonValidator.singleParamValidator('id'),
        // },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.service.updateAfterSaleLead(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = LeadEngageControlller;
