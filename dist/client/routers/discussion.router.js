"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const discussion_controller_1 = __importDefault(require("../controllers/discussion.controller"));
class EmployeeDiscussionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.EmployeeDiscussionController = new discussion_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create discussion
        this.router
            .route('/polls')
            .get(this.EmployeeDiscussionController.getAllPolls)
            .post(this.EmployeeDiscussionController.castMyVote);
        /// meal planner
        this.router
            .route('/select-today-meal')
            .get(this.EmployeeDiscussionController.getTodayMeals)
            .post(this.EmployeeDiscussionController.selectTodayMeal);
        /// get my current meal with employee info
        this.router
            .route('/my-meal-plan')
            .get(this.EmployeeDiscussionController.getMyMealPlans);
        this.router
            .route('/polls')
            .get(this.EmployeeDiscussionController.getAllPolls)
            .post(this.EmployeeDiscussionController.castMyVote);
        this.router
            .route('/polls/:id')
            .get(this.EmployeeDiscussionController.getSinglePolls);
        this.router
            .route('/comment')
            .post(this.EmployeeDiscussionController.createComment);
        this.router
            .route('/comment/:id')
            .delete(this.EmployeeDiscussionController.deleteComment);
        this.router
            .route('/:id')
            .get(this.EmployeeDiscussionController.getSingleDiscussion);
        this.router
            .route('/')
            .post(this.EmployeeDiscussionController.createDiscussion)
            .get(this.EmployeeDiscussionController.getAllDiscussion);
    }
}
exports.default = EmployeeDiscussionRouter;
