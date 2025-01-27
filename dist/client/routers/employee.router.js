"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const employee_controller_1 = __importDefault(require("../controllers/employee.controller"));
class MemberEmployeeRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.employeeController = new employee_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all employee
        this.router.route('/').get(this.employeeController.getAllEmployee);
        // get all employeem for conversation
        this.router
            .route('/for-conversation')
            .get(this.employeeController.getAllEmployeeForConversation);
        this.router
            .route('/clear-notification')
            .delete(this.employeeController.clearNotification);
        this.router
            .route('/employee-current-location')
            .post(this.employeeController.createEmployeeCurrentLocation);
        this.router
            .route('/notification/employee-view-notification')
            .patch(this.employeeController.allNotificationViewEmployee);
        this.router
            .route('/notification/employee-notifications')
            .get(this.employeeController.getAllNotification)
            .patch(this.employeeController.updateNotificationStatus);
        // get single employee
        this.router
            .route('/:id')
            .get(this.commonValidator.commonSingleParamsIdInputValidator(), this.employeeController.getSingleEmployee);
    }
}
exports.default = MemberEmployeeRouter;
