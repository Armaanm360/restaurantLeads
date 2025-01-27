"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const requisition_controller_1 = __importDefault(require("../controllers/requisition.controller"));
class EmployeeRequisitionRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.EmployeeRequisitionController = new requisition_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create requisition
        this.router
            .route('/')
            .get(this.EmployeeRequisitionController.getMyRequisitions)
            .post(this.EmployeeRequisitionController.createRequisition);
        this.router
            .route('/items')
            .get(this.EmployeeRequisitionController.getStockItems);
        //edit requisition
        this.router
            .route('/:id')
            .patch(this.EmployeeRequisitionController.updateRequisition)
            .get(this.EmployeeRequisitionController.getMyRequisitionTrack);
    }
}
exports.default = EmployeeRequisitionRouter;
