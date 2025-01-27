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
const meeting_service_1 = __importDefault(require("../services/meeting.service"));
const meeting_validator_1 = __importDefault(require("../utils/validators/meeting.validator"));
class AdminMeetingController extends abstract_controller_1.default {
    constructor() {
        super();
        this.AdminMeetingService = new meeting_service_1.default();
        this.meetingValidator = new meeting_validator_1.default();
        //get team report
        this.createMeeting = this.asyncWrapper.wrap({ bodySchema: this.meetingValidator.createMeeting }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.AdminMeetingService.createMeeting(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.createMeetingPlace = this.asyncWrapper.wrap({ bodySchema: this.meetingValidator.createPlace }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.AdminMeetingService.createMeetingPlace(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.updateMeetingPlace = this.asyncWrapper.wrap({ bodySchema: this.meetingValidator.updatePlace }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.AdminMeetingService.updateMeetingPlace(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.getMeeting = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.AdminMeetingService.getMeeting(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.getMyMeeting = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.AdminMeetingService.getMyMeeting(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.addMeetingPerson = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.AdminMeetingService.addMeetingPerson(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // public updateMeeting = this.asyncWrapper.wrap(
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.meetingService.updateMeeting(req);
        //     res.status(code).json(data);
        //   }
        // );
        // public getMeeting = this.asyncWrapper.wrap(
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } = await this.meetingService.getMeeting(req);
        //     res.status(code).json(data);
        //   }
        // );
        this.getMeetingPersons = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.AdminMeetingService.getMeetingPersons(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        this.getMeetingPlaces = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.AdminMeetingService.getMeetingPlaces(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        this.getMeetingDashboard = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.AdminMeetingService.getMeetingDashboard(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        this.singleMeeting = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.AdminMeetingService.singleMeeting(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        this.updateMeeting = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.AdminMeetingService.updateMeeting(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        this.removeMeetingPerson = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.doubleParamStringValidator('meeting_id', 'person_id'),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.AdminMeetingService.removeMeetingPerson(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminMeetingController;
