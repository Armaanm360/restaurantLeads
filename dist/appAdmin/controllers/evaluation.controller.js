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
const evaluation_service_1 = __importDefault(require("../services/evaluation.service"));
const evaluation_validator_1 = __importDefault(require("../utils/validators/evaluation.validator"));
class AdminEvaluationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.evaluationService = new evaluation_service_1.default();
        this.evaluationValidator = new evaluation_validator_1.default();
        //create evaluation
        this.createEvaluation = this.asyncWrapper.wrap({
            bodySchema: this.evaluationValidator.createEvaluation,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.evaluationService.createEvaluation(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //get evaluation
        this.getAllEvaluations = this.asyncWrapper.wrap({ querySchema: this.evaluationValidator.getAllEvaluation }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.evaluationService.getAllEvaluations(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //update evaluation
        this.updateEvaluation = this.asyncWrapper.wrap({
            bodySchema: this.evaluationValidator.updateEvaluation,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.evaluationService.updateEvaluation(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //teamwise evaluation list
        this.getTeamWiseEvaluationList = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator('id'),
            querySchema: this.evaluationValidator.getAllEvaluation,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.evaluationService.getTeamWiseEvaluationList(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // //teamwise evaluation list
        // public getTeamWiseEvaluationList = this.asyncWrapper.wrap(
        //   {
        //     paramSchema: this.commonValidator.singleParamStringValidator('id'),
        //     querySchema: this.evaluationValidator.getAllEvaluation,
        //   },
        //   async (req: Request, res: Response) => {
        //     const { code, ...data } =
        //       await this.evaluationService.getTeamWiseEvaluationList(req);
        //     res.status(code).json(data);
        //   }
        // );
        //create eligable evaluation
        this.createEligableTeamEvaluation = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.evaluationService.createEligableTeamEvaluation(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //assign evaluation to team
        this.assignEvaluationToTeam = this.asyncWrapper.wrap({
            bodySchema: this.evaluationValidator.assignEvaluationTeamValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.evaluationService.assignEvaluationToTeam(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //assign evaluation to team
        this.updateTeamWiseEvaluation = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamStringValidator('id'),
            bodySchema: this.evaluationValidator.updateTeamWiseEvaluationValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.evaluationService.updateTeamWiseEvaluation(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //get evaluation score team wise
        this.getEvaluationScoreTeamWise = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.evaluationService.getTestAvarageOfTeam(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminEvaluationController;
