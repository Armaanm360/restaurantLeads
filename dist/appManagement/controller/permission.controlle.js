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
const permission_service_1 = __importDefault(require("../service/permission.service"));
const permission_validation_1 = __importDefault(require("../utils/validation/permission.validation"));
class PermissionController extends abstract_controller_1.default {
    constructor() {
        super();
        this.permissionService = new permission_service_1.default();
        this.permissionValidate = new permission_validation_1.default();
        this.getAllPermissionGroup = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.permissionService.getAllPermissionGroup(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        this.getAllGroupWisePermissions = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.permissionService.getAllGroupWisePermissions(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        this.getSingleOrganizeWisePermissions = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.permissionService.getSingleOrganizeWisePermissions(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.createGroup = this.asyncWrapper.wrap({ bodySchema: this.permissionValidate.createGroup }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.permissionService.createGroups(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.updateOrganizationPermission = this.asyncWrapper.wrap(
        // { bodySchema: this.permissionValidate.createGroup },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.permissionService.updateOrganizationPermissions(req), { code } = _e, data = __rest(_e, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.createPermissions = this.asyncWrapper.wrap(
        // { bodySchema: this.permissionValidate.createGroupPermission },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.permissionService.createGroupWisePermissions(req), { code } = _f, data = __rest(_f, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
    }
}
exports.default = PermissionController;
