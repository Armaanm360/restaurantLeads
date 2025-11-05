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
const reissue_service_1 = __importDefault(require("../commonService/reissue.service"));
const refund_service_1 = require("../commonService/refund.service");
class commonController extends abstract_controller_1.default {
    constructor() {
        super();
        this.commonService = new common_service_1.default();
        this.nonCommon = new noncom_service_1.default();
        this.reIssue = new reissue_service_1.default();
        this.reFund = new refund_service_1.RefundService();
        // send email otp
        this.moveClients = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.commonService.moveClients(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.movePassports = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.commonService.movePassports(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.moveAirports = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.commonService.moveAirports(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.moveAirlines = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.commonService.moveAirlines(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.moveAccounts = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.commonService.moveAccounts(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.moveVendors = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.commonService.moveVendors(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        this.moveEmployees = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.commonService.moveEmployees(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        this.moveUsers = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.commonService.moveUsers(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        this.invoices = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.commonService.testInvoices(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        this.testInvoicesReissues = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.commonService.testInvoicesReissues(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        this.voidsMigration = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.commonService.voidsMigration(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        this.invoicenoncom = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.nonCommon.testInvoicesNon(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        this.reissue = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.reIssue.reissueTransfer(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        this.receipt = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.nonCommon.receipt(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        this.payment = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.nonCommon.payment(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
        this.refreshDatabase = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _r = yield this.commonService.refreshDatabase(req), { code } = _r, data = __rest(_r, ["code"]);
            res.status(code).json(data);
        }));
        this.resetVoid = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _s = yield this.commonService.resetVoid(req), { code } = _s, data = __rest(_s, ["code"]);
            res.status(code).json(data);
        }));
        this.resetReceipts = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _t = yield this.commonService.resetReceipt(req), { code } = _t, data = __rest(_t, ["code"]);
            res.status(code).json(data);
        }));
        this.resetRefund = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _u = yield this.commonService.resetRefund(req), { code } = _u, data = __rest(_u, ["code"]);
            res.status(code).json(data);
        }));
        this.refreshRecDatabase = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _v = yield this.commonService.refreshRecDatabase(req), { code } = _v, data = __rest(_v, ["code"]);
            res.status(code).json(data);
        }));
        this.refundController = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _w = yield this.reFund.refundTest(req), { code } = _w, data = __rest(_w, ["code"]);
            res.status(code).json(data);
        }));
        this.refundControllerNon = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _x = yield this.reFund.refundTestNon(req), { code } = _x, data = __rest(_x, ["code"]);
            res.status(code).json(data);
        }));
        // Add this new method for sequential execution
        this.refreshAllData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Starting sequential data refresh...');
                // //PHASE 1
                // Execute each service method directly in sequence
                console.log('Processing clients...');
                yield this.commonService.moveClients(req);
                console.log('Processing accounts...');
                yield this.commonService.moveAccounts(req);
                console.log('Processing vendors...');
                yield this.commonService.moveVendors(req);
                console.log('Processing employees...');
                yield this.commonService.moveEmployees(req);
                console.log('Processing passports...');
                yield this.commonService.movePassports(req);
                console.log('Processing Airports...');
                yield this.commonService.moveAirports(req);
                console.log('Processing Airlines...');
                yield this.commonService.moveAirlines(req);
                // console.log('Processing invoices...');
                // await this.commonService.testInvoices(req);
                // console.log('Processing invoice noncom...');
                // await this.nonCommon.testInvoicesNon(req);
                // // console.log('Processing reissue...');
                // await this.reIssue.reissueTransfer(req);
                // // ///PHASE 2
                // console.log('Processing refunds...');
                // await this.reFund.refundTest(req);
                // console.log('Processing refunds...');
                // await this.commonService.voidsMigration(req);
                // console.log('Processing receipt...');
                // await this.nonCommon.receipt(req);
                // console.log('Processing payment...');
                // await this.nonCommon.payment(req);
                console.log('All processes completed successfully!');
                res.status(200).json({
                    code: 200,
                    success: true,
                    message: 'All data refresh operations completed successfully',
                });
            }
            catch (error) {
                console.error('Error in sequential refresh:', error);
                res.status(500).json({
                    code: 500,
                    success: false,
                    message: 'Error during data refresh operations',
                });
            }
        });
    }
}
exports.default = commonController;
