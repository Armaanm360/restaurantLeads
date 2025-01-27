"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const evaluation_controller_1 = __importDefault(require("../controllers/evaluation.controller"));
class MemberEvaluationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.EvaluationController = new evaluation_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router.route('/').get(this.EvaluationController.getEvaluation);
        this.router.route('/').post(this.EvaluationController.createResponses);
        this.router
            .route('/:id')
            .get(this.EvaluationController.getEvaluationWiseQuestion);
    }
}
exports.default = MemberEvaluationRouter;
