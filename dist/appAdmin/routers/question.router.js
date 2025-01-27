"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../../client/utils/validators/member.validator"));
const question_controller_1 = __importDefault(require("../controllers/question.controller"));
class AdminQuestionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.AdminQuestionController = new question_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create question
        this.router.route('/').post(this.AdminQuestionController.createQuestion);
        // get,update,delete Questions
        this.router
            .route('/:id')
            .patch(this.AdminQuestionController.updateQuesion)
            .get(this.AdminQuestionController.getQuestions);
        //delete question
        this.router
            .route('/:id/:ev_id')
            .delete(this.AdminQuestionController.deleteQuestion);
    }
}
exports.default = AdminQuestionRouter;
