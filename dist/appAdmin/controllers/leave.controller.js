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
const leave_service_1 = __importDefault(require("../services/leave.service"));
const leave_validator_1 = __importDefault(require("../utils/validators/leave.validator"));
class AdminLeaveController extends abstract_controller_1.default {
    constructor() {
        super();
        this.LeaveService = new leave_service_1.default();
        this.LeaveValidator = new leave_validator_1.default();
        //create leave
        this.createLeave = this.asyncWrapper.wrap({ bodySchema: this.LeaveValidator.createLeave }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.LeaveService.createLeave(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.updateLeave = this.asyncWrapper.wrap({ bodySchema: this.LeaveValidator.updateLeave }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.LeaveService.updateLeave(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //create leave types
        this.createLeaveTypes = this.asyncWrapper.wrap({ arrayBodySchema: this.LeaveValidator.createLeaveTypes }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.LeaveService.createLeaveTypes(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllLeaveTypes = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.LeaveService.getAllLeaveTypes(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllLeaves = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.LeaveService.getAllLeaves(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        this.getSingleLeave = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.LeaveService.getSingleLeave(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        this.updateLeaveTypes = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
            bodySchema: this.LeaveValidator.updateLeaveTypes,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.LeaveService.updateLeaveTypes(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        this.deleteLeaveTypes = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.LeaveService.deleteLeaveTypes(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        this.deleteLeaveApplication = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.LeaveService.deleteLeaveApplication(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminLeaveController;
