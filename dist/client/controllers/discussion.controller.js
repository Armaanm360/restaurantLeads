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
const discussion_service_1 = __importDefault(require("../services/discussion.service"));
const discussion_validator_1 = __importDefault(require("../../appAdmin/utils/validators/discussion.validator"));
class EmployeeDiscussionController extends abstract_controller_1.default {
    constructor() {
        super();
        this.DiscussionService = new discussion_service_1.default();
        this.DiscussionValidator = new discussion_validator_1.default();
        //create discussion
        this.createDiscussion = this.asyncWrapper.wrap({ bodySchema: this.DiscussionValidator.createDiscussion }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.DiscussionService.createDiscussion(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //create discussion
        this.castMyVote = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.DiscussionService.castMyVote(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //select today meal
        this.selectTodayMeal = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.DiscussionService.selectMyMeals(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //create discussion
        this.getSinglePolls = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.DiscussionService.getSinglePolls(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get all discussion
        this.getAllDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.DiscussionService.getAllDiscussion(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllPolls = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.DiscussionService.getAllPolls(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //get my meals
        this.getTodayMeals = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.DiscussionService.getTodayMeals(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //get my meal plan for next 30 days!
        this.getMyMealPlans = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.DiscussionService.getMyMealPlans(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get single discussion
        this.getSingleDiscussion = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.DiscussionService.getSingleDiscussion(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //create comment
        this.createComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.DiscussionService.createComment(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //delete comment
        this.deleteComment = this.asyncWrapper.wrap(
        // { bodySchema: this.DiscussionValidator.createDiscussion },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.DiscussionService.deleteComment(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = EmployeeDiscussionController;
