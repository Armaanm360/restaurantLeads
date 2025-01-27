"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const discussion_controller_1 = __importDefault(require("../controllers/discussion.controller"));
class AdminDiscussionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.AdminDiscussionController = new discussion_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create discussion
        this.router
            .route('/polls')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.POLLS), this.AdminDiscussionController.createPolls)
            .get(this.AdminDiscussionController.getAllPolls);
        //get meal info
        this.router
            .route('/meal-info')
            .get(this.AdminDiscussionController.getMealInfo);
        //get meal info
        this.router
            .route('/meal-trx')
            .get(this.AdminDiscussionController.getMealTrx);
        //single date meal order transactions
        this.router
            .route('/single-meal-trx')
            .get(this.AdminDiscussionController.getSingleDayMealTrx);
        //get meal info
        this.router
            .route('/meals')
            .post(this.AdminDiscussionController.addNewMeal)
            .get(this.AdminDiscussionController.getAllMeals);
        this.router
            .route('/meal-plan')
            .post(this.AdminDiscussionController.createMealPlan)
            .get(this.AdminDiscussionController.getAllMealPlans);
        //employee with their all transactions
        this.router
            .route('/employees-with-transactions')
            .get(this.AdminDiscussionController.employeeWithTransactions);
        //add new meal
        this.router
            .route('/order-new-meal')
            .post(this.AdminDiscussionController.orderNewMeal);
        this.router
            .route('/meal-payment')
            .post(this.AdminDiscussionController.createMealPayment)
            .get(this.AdminDiscussionController.getEmployeePaymentHistory);
        //multiple meal payment
        this.router
            .route('/multiple-meal-payment')
            .post(this.AdminDiscussionController.multipleEmployeePayment);
        this.router
            .route('/meal-payment-list')
            .get(this.AdminDiscussionController.getMealPaymentList);
        this.router
            .route('/single-meal-payment/:id')
            .get(this.AdminDiscussionController.getSingleMealPayment);
        this.router
            .route('/overall-payment-list')
            .get(this.AdminDiscussionController.getOverAllPayment);
        this.router
            .route('/polls/:id')
            .get(this.AdminDiscussionController.getSinglePolls);
        this.router
            .route('/')
            .post(this.AdminDiscussionController.createDiscussion)
            .get(this.AdminDiscussionController.getAllDiscussion);
        this.router
            .route('/:id')
            .get(this.AdminDiscussionController.getSingleDiscussion)
            .patch(this.AdminDiscussionController.updateDiscussion)
            .delete(this.AdminDiscussionController.deleteDiscussion);
        this.router
            .route('/comment')
            .post(this.AdminDiscussionController.createComment);
        this.router
            .route('/comment/:id')
            .delete(this.AdminDiscussionController.deleteComment);
    }
}
exports.default = AdminDiscussionRouter;
