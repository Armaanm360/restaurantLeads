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
const employee_service_1 = __importDefault(require("../services/employee.service"));
const employee_validator_1 = __importDefault(require("../utils/validators/employee.validator"));
class AdminEmployeeController extends abstract_controller_1.default {
    constructor() {
        super();
        this.employeeService = new employee_service_1.default();
        this.adminEmployeeValidator = new employee_validator_1.default();
        //create Employee
        this.createEmployee = this.asyncWrapper.wrap({ bodySchema: this.adminEmployeeValidator.createEmployeeValidator }, 
        // null,
        (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.employeeService.createEmployee(req), { code } = _a, data = __rest(_a, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //Get all Employee
        this.getAllEmployee = this.asyncWrapper.wrap({ querySchema: this.adminEmployeeValidator.getAllEmployeeValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.employeeService.getAllEployee(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //Get single Employee
        this.getSingleEmployee = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.employeeService.getSingleEmployee(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //update Employee
        this.updateSingleEmployee = this.asyncWrapper.wrap({ bodySchema: this.adminEmployeeValidator.updateEmployeeValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.employeeService.updateSingleEmployee(req), { code } = _d, data = __rest(_d, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //upsert shift
        this.upsertShift = this.asyncWrapper.wrap({ bodySchema: this.adminEmployeeValidator.employeeShiftValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.employeeService.upsertShift(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //employee shift create
        this.createShift = this.asyncWrapper.wrap({ bodySchema: this.adminEmployeeValidator.createShiftValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.employeeService.createShift(req), { code } = _f, data = __rest(_f, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
        //Get all Shifts
        this.getAllShift = this.asyncWrapper.wrap({ querySchema: this.adminEmployeeValidator.getAllShiftValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.employeeService.getAllShifts(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //update Shift
        this.updateShift = this.asyncWrapper.wrap({ bodySchema: this.adminEmployeeValidator.updateShiftValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.employeeService.updateShift(req), { code } = _h, data = __rest(_h, ["code"]);
            if (data.success) {
                res.status(code).json(data);
            }
            else {
                this.error(data.message, code);
            }
        }));
    }
}
exports.default = AdminEmployeeController;
