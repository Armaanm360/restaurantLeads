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
const requisition_validator_1 = __importDefault(require("../utils/validators/requisition.validator"));
const requisition_service_1 = __importDefault(require("../services/requisition.service"));
class AdminRequisitionController extends abstract_controller_1.default {
    constructor() {
        super();
        this.AdminRequisitionService = new requisition_service_1.default();
        this.RequisitionValidator = new requisition_validator_1.default();
        //create items
        this.createRequisition = this.asyncWrapper.wrap({ bodySchema: this.RequisitionValidator.createRequisition }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.AdminRequisitionService.createRequisition(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //create items
        this.createItem = this.asyncWrapper.wrap({ bodySchema: this.RequisitionValidator.createItem }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.AdminRequisitionService.createItem(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //update items
        this.updateItem = this.asyncWrapper.wrap({ bodySchema: this.RequisitionValidator.updateItem }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.AdminRequisitionService.updateItem(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //create items
        this.deleteItem = this.asyncWrapper.wrap(
        // { bodySchema: this.RequisitionValidator.updateItem },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.AdminRequisitionService.deleteItem(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //create new stock
        this.createNewStock = this.asyncWrapper.wrap(
        // { bodySchema: this.RequisitionValidator.createNewStock },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.AdminRequisitionService.createNewStock(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //create items
        this.updateRequisition = this.asyncWrapper.wrap(
        // { bodySchema: this.RequisitionValidator.createRequisition },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.AdminRequisitionService.updateRequisition(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //get Single Requisition Track
        this.getSingleRequisitionTrack = this.asyncWrapper.wrap(
        // { bodySchema: this.RequisitionValidator.createRequisition },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.AdminRequisitionService.getSingleRequisitionTrack(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //get all discussion
        this.getAllDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.AdminRequisitionService.getAllDiscussion(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get all items
        this.getAllItems = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.AdminRequisitionService.getAllItems(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //get all transactions
        this.getAllTransactions = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.AdminRequisitionService.getAllTransactions(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //get all requisitions
        this.getAllRequisitions = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.AdminRequisitionService.getAllRequisitions(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        //get current stock
        this.getCurrentStock = this.asyncWrapper.wrap({ bodySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.AdminRequisitionService.getCurrentStock(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        //get current stock
        this.adjustStock = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.AdminRequisitionService.adjustStock(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        //update Discussion
        this.updateDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.AdminRequisitionService.updateDiscussion(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        //delete Discussion
        this.deleteDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.AdminRequisitionService.deleteDiscussion(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
        //get single discussion
        this.getSingleDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _r = yield this.AdminRequisitionService.getSingleDiscussion(req), { code } = _r, data = __rest(_r, ["code"]);
            res.status(code).json(data);
        }));
        //create comment
        this.createComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _s = yield this.AdminRequisitionService.createComment(req), { code } = _s, data = __rest(_s, ["code"]);
            res.status(code).json(data);
        }));
        //delete comment
        this.deleteComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _t = yield this.AdminRequisitionService.deleteComment(req), { code } = _t, data = __rest(_t, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminRequisitionController;
