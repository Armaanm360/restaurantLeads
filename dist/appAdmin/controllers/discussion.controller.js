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
const discussion_validator_1 = __importDefault(require("../utils/validators/discussion.validator"));
const discussion_service_1 = __importDefault(require("../services/discussion.service"));
class AdminDiscussionController extends abstract_controller_1.default {
    constructor() {
        super();
        this.DiscussionService = new discussion_service_1.default();
        this.DiscussionValidator = new discussion_validator_1.default();
        //create discussion
        this.createDiscussion = this.asyncWrapper.wrap({ bodySchema: this.DiscussionValidator.createDiscussion }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.DiscussionService.createDiscussion(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //create polls
        this.createPolls = this.asyncWrapper.wrap({ bodySchema: this.DiscussionValidator.createPolls }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.DiscussionService.createPolls(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get all discussion
        this.getAllDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.DiscussionService.getAllDiscussion(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //get all polls
        this.getAllPolls = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.DiscussionService.getAllPolls(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get meal info
        this.getMealInfo = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.DiscussionService.getMealInfo(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //get meal trx
        this.getMealTrx = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.DiscussionService.getMealTrx(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //get single meal trx
        this.getSingleDayMealTrx = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.DiscussionService.getSingleDayMealTrx(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //add a new meal
        this.addNewMeal = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.DiscussionService.addNewMeal(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get all meals
        this.getAllMeals = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.DiscussionService.getAllMeals(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //create meal plan
        this.createMealPlan = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.DiscussionService.createMealPlan(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //order new meal
        this.orderNewMeal = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.DiscussionService.orderNewMeal(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        //employee meal payment
        this.createMealPayment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.DiscussionService.createMealPayment(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        //mutiple employee meal payment
        this.multipleEmployeePayment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.DiscussionService.multipleEmployeePayment(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        //single employee meal payment
        this.getEmployeePaymentHistory = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.DiscussionService.getEmployeeWisePaymentInfo(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        //get meal payments
        this.getMealPaymentList = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.DiscussionService.getMealPaymentList(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
        //single meal paymenbt
        this.getSingleMealPayment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _r = yield this.DiscussionService.getSingleMealPayment(req), { code } = _r, data = __rest(_r, ["code"]);
            res.status(code).json(data);
        }));
        //meal payment list
        this.getOverAllPayment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _s = yield this.DiscussionService.getSingleMealPayment(req), { code } = _s, data = __rest(_s, ["code"]);
            res.status(code).json(data);
        }));
        //get All meal plans
        this.getAllMealPlans = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _t = yield this.DiscussionService.getAllMealPlans(req), { code } = _t, data = __rest(_t, ["code"]);
            res.status(code).json(data);
        }));
        this.employeeWithTransactions = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _u = yield this.DiscussionService.getEmployeeTransactions(req), { code } = _u, data = __rest(_u, ["code"]);
            res.status(code).json(data);
        }));
        //get single polls
        this.getSinglePolls = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _v = yield this.DiscussionService.getSinglePolls(req), { code } = _v, data = __rest(_v, ["code"]);
            res.status(code).json(data);
        }));
        //update Discussion
        this.updateDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _w = yield this.DiscussionService.updateDiscussion(req), { code } = _w, data = __rest(_w, ["code"]);
            res.status(code).json(data);
        }));
        //delete Discussion
        this.deleteDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _x = yield this.DiscussionService.deleteDiscussion(req), { code } = _x, data = __rest(_x, ["code"]);
            res.status(code).json(data);
        }));
        //get single discussion
        this.getSingleDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _y = yield this.DiscussionService.getSingleDiscussion(req), { code } = _y, data = __rest(_y, ["code"]);
            res.status(code).json(data);
        }));
        //create comment
        this.createComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _z = yield this.DiscussionService.createComment(req), { code } = _z, data = __rest(_z, ["code"]);
            res.status(code).json(data);
        }));
        //delete comment
        this.deleteComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _0 = yield this.DiscussionService.deleteComment(req), { code } = _0, data = __rest(_0, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminDiscussionController;
