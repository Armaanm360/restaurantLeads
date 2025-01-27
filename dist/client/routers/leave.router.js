"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const leave_controller_1 = __importDefault(require("../controllers/leave.controller"));
class MemberLeaveRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.LeaveController = new leave_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router
            .route('/')
            .post(this.LeaveController.createLeaveApplication)
            .get(this.LeaveController.getMyLeaveApplication);
        this.router
            .route('/:id')
            .patch(this.LeaveController.updateLeaveApplicaiton)
            .delete(this.LeaveController.deleteLeaveApplication);
        this.router.route('/types').get(this.LeaveController.getLeaveTypes);
    }
}
exports.default = MemberLeaveRouter;
