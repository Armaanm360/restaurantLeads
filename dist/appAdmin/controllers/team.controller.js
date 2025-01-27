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
const team_service_1 = __importDefault(require("../services/team.service"));
const team_validator_1 = __importDefault(require("../utils/validators/team.validator"));
class AdminTeamController extends abstract_controller_1.default {
    constructor() {
        super();
        this.TeamService = new team_service_1.default();
        this.TeamValidator = new team_validator_1.default();
        // create team
        this.createTeam = this.asyncWrapper.wrap({ bodySchema: this.TeamValidator.createTeamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.TeamService.createTeam(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // create team
        this.createVerifier = this.asyncWrapper.wrap(
        // { bodySchema: this.TeamValidator.createTeamValidator },
        null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.TeamService.createVerifier(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get team
        this.getTeam = this.asyncWrapper.wrap({ querySchema: this.TeamValidator.getTeamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.TeamService.getAllTeam(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        this.getEmployeeTeamWise = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('team_id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.TeamService.getEmployeeTeamWise(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //assign employee to team
        this.assignEmployeeToTeam = this.asyncWrapper.wrap({ bodySchema: this.TeamValidator.assignEmployeeToTeam }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.TeamService.assignEmployeeToTeam(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //Create Evaluate employee permission
        // public createEvaluateEmployePermission = this.asyncWrapper.wrap(
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } =
        //       await this.TeamService.createEvaluateEmployePermission(req);
        //     res.status(code).json(data);
        //   }
        // );
        //Update Evaluate employee permission
        this.updateEvaluateEmployePermission = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.TeamService.updateEvaluateEmployePermission(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // get evaluate employee permission by team
        this.getEvaluateEmployePermissionByTeam = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator('team_id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.TeamService.getEvaluateEmployePermissionByTeam(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //unappointed employee
        this.assignEmployeeToTeamLeader = this.asyncWrapper.wrap({ bodySchema: this.TeamValidator.assignTeamLeaderValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.TeamService.assignEmployeeToTeamLeader(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // remove employee
        this.removeEmployee = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.doubleParamStringValidator('employee_id', 'team_id'),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.TeamService.removeEmployee(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // team evaluation report
        this.teamWiseEvaluationReport = this.asyncWrapper.wrap({
        // paramSchema: this.commonValidator.doubleParamStringValidator(
        //   'employee_id',
        //   'team_id'
        // ),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.TeamService.teamWiseEvaluationReport(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        // update team
        this.updateTeam = this.asyncWrapper.wrap({ bodySchema: this.TeamValidator.updateTeamValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.TeamService.updateTeam(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminTeamController;
