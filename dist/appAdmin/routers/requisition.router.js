"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const requisition_controller_1 = __importDefault(require("../controllers/requisition.controller"));
class AdminRequisitionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.AdminRequisitionController = new requisition_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //stock in requisition items
        this.router
            .route('/current-stock')
            .get(this.AdminRequisitionController.getCurrentStock);
        //stock in requisition items
        this.router
            .route('/stock')
            .post(this.AdminRequisitionController.createNewStock)
            .get(this.AdminRequisitionController.getAllTransactions);
        //stock in requisition items
        this.router
            .route('/stock/adjust')
            .post(this.AdminRequisitionController.adjustStock);
        //requisition items
        this.router
            .route('/items')
            .post(this.AdminRequisitionController.createItem)
            .get(this.AdminRequisitionController.getAllItems);
        //requisition edit
        this.router
            .route('/items/:id')
            .patch(this.AdminRequisitionController.updateItem)
            .delete(this.AdminRequisitionController.deleteItem);
        //requisition items
        this.router
            .route('/')
            .post(this.AdminRequisitionController.createRequisition)
            .get(this.AdminRequisitionController.getAllRequisitions);
        //requisition items
        this.router
            .route('/:id')
            .patch(this.AdminRequisitionController.updateRequisition);
        this.router
            .route('/track/:id')
            .get(this.AdminRequisitionController.getSingleRequisitionTrack);
    }
}
exports.default = AdminRequisitionRouter;
