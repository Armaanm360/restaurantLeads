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
const admin_user_service_1 = __importDefault(require("../services/admin.user.service"));
const admin_users_validator_1 = __importDefault(require("../../auth/utils/validator/admin.users.validator"));
class AdminUserController extends abstract_controller_1.default {
    constructor() {
        super();
        this.adminUserService = new admin_user_service_1.default();
        this.adminUserValidator = new admin_users_validator_1.default();
        //create Employee
        this.createAdminUser = this.asyncWrapper.wrap({ bodySchema: this.adminUserValidator.createAdminValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.adminUserService.createUserAdmin(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.dummyOrganizationCreate = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.adminUserService.dummyOrganizationCreate(req), { code } = _b, data = __rest(_b, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //remove admin
        //Get all Employee
        this.clearNotification = this.asyncWrapper.wrap(
        // {
        //   bodySchema:
        //     this.employeeServiceValidator.createOrUpdateEmployeeLocationValidator,
        // },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.adminUserService.clearNotification(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //Get all Admin
        this.getAllAdmin = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.adminUserService.getAllAdmin(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.getOrganization = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.adminUserService.getOrganization(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //Get single Employee
        this.getSingleAdmin = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.adminUserService.getSingleAdmin(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //update Employee
        this.updateSingleAdmin = this.asyncWrapper.wrap({ bodySchema: this.adminUserValidator.updateAdminValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.adminUserService.updateSingleAdmin(req), { code } = _g, data = __rest(_g, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.updateOrganization = this.asyncWrapper.wrap({ bodySchema: this.adminUserValidator.updateOrganizationValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.adminUserService.updateOrganization(req), { code } = _h, data = __rest(_h, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //upsert shift
        this.upsertShift = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.adminUserService.upsertShift(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //employee shift create
        this.createShift = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.adminUserService.createShift(req), { code } = _k, data = __rest(_k, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //Get all Shifts
        this.getAllShift = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.adminUserService.getAllShifts(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        //update Shift
        this.updateShift = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.adminUserService.updateShift(req), { code } = _m, data = __rest(_m, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.getAllNotification = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.adminUserService.getAllNotification(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        this.viewAllNotification = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.adminUserService.viewAllNotification(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        this.updateNotificationStatus = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.adminUserService.updateNotificationStatus(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminUserController;
