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
const activity_service_1 = __importDefault(require("../services/activity.service"));
const activity_validator_1 = __importDefault(require("../../appAdmin/utils/validators/activity.validator"));
class MemberActivityController extends abstract_controller_1.default {
    constructor() {
        super();
        this.MemberActivityService = new activity_service_1.default();
        this.ActivityValidator = new activity_validator_1.default();
        this.createActivity = this.asyncWrapper.wrap({ arrayBodySchema: this.ActivityValidator.createActivity }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.MemberActivityService.createActivity(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // create other activity
        this.createOtherActivity = this.asyncWrapper.wrap({ bodySchema: this.ActivityValidator.createOtherActivity }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.MemberActivityService.createOtherActivity(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // get all other activity
        this.getAllOtherActivity = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.MemberActivityService.getAllOtherActivity(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.getPrayerTimes = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.MemberActivityService.getPrayerTimes(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get team
        this.getActivities = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
            querySchema: this.commonValidator.queryListLimitSkip,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.MemberActivityService.getActivities(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.getMyActivity = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
            querySchema: this.commonValidator.queryListLimitSkip,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.MemberActivityService.getMyActivity(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        this.getMyActivityList = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
            querySchema: this.commonValidator.queryListLimitSkip,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.MemberActivityService.getMyActivityList(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //update activity
        this.updateActivity = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.MemberActivityService.updateActivity(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        this.updateActivityEmployee = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.MemberActivityService.updateActivityByEmployee(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = MemberActivityController;
