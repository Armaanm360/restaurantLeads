"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../../client/utils/validators/member.validator"));
const leave_controller_1 = __importDefault(require("../controllers/leave.controller"));
class AdminLeaveRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.AdminLeaveController = new leave_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router
            .route('/')
            .post(this.AdminLeaveController.createLeave)
            .get(this.AdminLeaveController.getAllLeaves);
        this.router
            .route('/single/:id')
            .get(this.AdminLeaveController.getSingleLeave);
        this.router
            .route('/types')
            .post(this.AdminLeaveController.createLeaveTypes)
            .get(this.AdminLeaveController.getAllLeaveTypes);
        this.router
            .route('/types/:id')
            .patch(this.AdminLeaveController.updateLeaveTypes)
            .delete(this.AdminLeaveController.deleteLeaveTypes);
        this.router
            .route('/:id')
            .patch(this.AdminLeaveController.updateLeave)
            .delete(this.AdminLeaveController.deleteLeaveApplication);
    }
}
exports.default = AdminLeaveRouter;
