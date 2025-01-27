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
const organization_validation_1 = __importDefault(require("../utils/validation/organization.validation"));
const organization_service_1 = __importDefault(require("../service/organization.service"));
class OrganizationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.organizationService = new organization_service_1.default();
        this.orgValidate = new organization_validation_1.default();
        //create Restaurant
        this.createOrganization = this.asyncWrapper.wrap({ bodySchema: this.orgValidate.createOrganization }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.organizationService.createOrganization(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //Get all organization
        this.getAllOrganization = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.organizationService.getAllOrganization(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //update organization Status
        this.updateOrganizationStatus = this.asyncWrapper.wrap(
        // { querySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.organizationService.updateOrganizationStatus(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //Get Dashboard Data
        this.getDashboard = this.asyncWrapper.wrap(
        // { querySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.organizationService.getDashboardData(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //get all organization users
        this.getAllOrganizationUser = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.organizationService.getAllOrganizationUser(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //get all permission group
        this.getAllPermissionGroup = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.organizationService.getAllPermissionGroup(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //get all permission group
        this.createPermissionGroup = this.asyncWrapper.wrap(
        // { querySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.organizationService.getAllPermissionGroup(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //create employee
        this.createManagementEmployee = this.asyncWrapper.wrap(
        // { querySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.organizationService.createManagementEmployee(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //get management employee
        this.getManagementEmployee = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.organizationService.getAllManagementEmployee(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //create management admin
        this.createManagementAdmin = this.asyncWrapper.wrap(
        // { querySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.organizationService.createManagementAdmin(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //get management admin
        this.getManagementAdmin = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.organizationService.getManagementAdmin(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = OrganizationController;
