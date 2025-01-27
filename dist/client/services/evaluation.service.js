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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class MemberEvaluationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { association_id } = req.employee;
                const model = this.Model.userModel();
                const getTeams = yield model.getEvaluation(association_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: getTeams,
                };
            }));
        });
    }
    getEvaluationWiseQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.employee;
                const evaluation_id = parseInt(req.params.id);
                const model = this.Model.memberQuestionModel();
                const getQuestion = yield model.getEvaluationQuestions(organization_id, evaluation_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: getQuestion,
                };
            }));
        });
    }
    createResponses(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.userModel();
                const createEvaluationsPromises = req.body.map((evaluation) => __awaiter(this, void 0, void 0, function* () {
                    // Assuming createEvaluation method exists in your model
                    yield model.createResponses(Object.assign(Object.assign({}, evaluation), { evaluate_by: req.employee.id }));
                }));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
}
exports.default = MemberEvaluationService;
