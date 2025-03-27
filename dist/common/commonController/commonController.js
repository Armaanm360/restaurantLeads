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
const common_service_1 = __importDefault(require("../commonService/common.service"));
const noncom_service_1 = __importDefault(require("../commonService/noncom.service"));
class commonController extends abstract_controller_1.default {
    constructor() {
        super();
        this.commonService = new common_service_1.default();
        this.nonCommon = new noncom_service_1.default();
        // send email otp
        this.moveClients = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.commonService.moveClients(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.moveAccounts = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.commonService.moveAccounts(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.moveVendors = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.commonService.moveVendors(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.moveEmployees = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.commonService.moveEmployees(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.invoices = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.commonService.testInvoices(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.invoicenoncom = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.nonCommon.testInvoicesNon(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        this.reissue = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.nonCommon.reissueTransfer(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        this.receipt = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.nonCommon.receipt(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        this.refreshDatabase = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.commonService.refreshDatabase(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        this.refundController = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.commonService.refundTest(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = commonController;
