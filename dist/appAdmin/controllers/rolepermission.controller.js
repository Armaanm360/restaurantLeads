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
const rolepermission_validator_1 = __importDefault(require("../utils/validators/rolepermission.validator"));
const rolepermission_service_1 = __importDefault(require("../services/rolepermission.service"));
class RolePermissionController extends abstract_controller_1.default {
    constructor() {
        super();
        this.rolePermissionService = new rolepermission_service_1.default();
        this.rolePermissionValidator = new rolepermission_validator_1.default();
        //create Role With Permission
        this.createRoleWithPermission = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.rolePermissionService.createRoleWithPermission(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //update Role With Permission
        this.updateRolePermission = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.rolePermissionService.updateRolePermission(req), { code } = _b, data = __rest(_b, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //update Role With Permission
        this.updateRolePermissionEmployee = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.rolePermissionService.updateRolePermissionEmployee(req), { code } = _c, data = __rest(_c, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //get Role With Permission
        this.getRoleWithPermission = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.rolePermissionService.getRolesWithPermission(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //get Single Role With Permission
        this.getSingleRoleWithPermission = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.rolePermissionService.getSingleRoleWithPermission(req), { code } = _e, data = __rest(_e, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //get Single Role With Permission
        this.getSingleRoleWithPermissionEmployee = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.rolePermissionService.getSingleRoleWithPermissionEmployee(req), { code } = _f, data = __rest(_f, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //create Permission Group
        this.createPermissionGroup = this.asyncWrapper.wrap({ bodySchema: this.rolePermissionValidator.createPermissionGroupValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.rolePermissionService.createPermissionGroup(req), { code } = _g, data = __rest(_g, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //get Permission Group
        this.getPermissionGroups = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.rolePermissionService.getPermissionGroups(req), { code } = _h, data = __rest(_h, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //create Permissions
        this.createPermission = this.asyncWrapper.wrap({}, 
        // { arrayBodySchema: this.rolePermissionValidator.createPermission },
        (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.rolePermissionService.createPermissions(req), { code } = _j, data = __rest(_j, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //get Permissions
        this.getPermission = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.rolePermissionService.getPermissions(req), { code } = _k, data = __rest(_k, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        this.getPermissionsEmployee = this.asyncWrapper.wrap({ querySchema: this.commonValidator.queryListLimitSkip }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.rolePermissionService.getPermissionsEmployee(req), { code } = _l, data = __rest(_l, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
    }
}
exports.default = RolePermissionController;
