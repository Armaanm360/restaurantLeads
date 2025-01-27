"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const evaluation_controller_1 = __importDefault(require("../controllers/evaluation.controller"));
const question_router_1 = __importDefault(require("./question.router"));
class AdminEvaluationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.EvaluationController = new evaluation_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //question root router
        this.router.use('/question', new question_router_1.default().router);
        //create evaluation && list
        this.router
            .route('/')
            .post(this.EvaluationController.createEvaluation)
            .get(this.EvaluationController.getAllEvaluations);
        // update evaluation
        this.router.route('/:id').patch(this.EvaluationController.updateEvaluation);
        //assign evaluation to team
        this.router
            .route('/assign-evaluation')
            .post(this.EvaluationController.assignEvaluationToTeam);
        //team wise evaluation list
        this.router
            .route('/teamwise-evaluation-list/:id')
            .get(this.EvaluationController.getTeamWiseEvaluationList);
        //team wise evaluation update
        this.router
            .route('/teamwise-evaluation-update/:id')
            .patch(this.EvaluationController.updateTeamWiseEvaluation);
        //teamwise score
        this.router
            .route('/teamwise-score')
            .get(this.EvaluationController.getEvaluationScoreTeamWise);
    }
}
exports.default = AdminEvaluationRouter;
