"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../../client/utils/validators/member.validator"));
const report_controller_1 = __importDefault(require("../controllers/report.controller"));
class AdminReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.AdminReportController = new report_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //getPersonWiseReport
        this.router
            .route('/person-wise-report')
            .get(this.AdminReportController.getPersonWiseReport);
        this.router
            .route('/person-wise-leaves/:id')
            .get(this.AdminReportController.getPersonWiseLeaves);
        this.router
            .route('/person-wise-evaluation/:id')
            .get(this.AdminReportController.getPersonWiseEvaluation);
        this.router
            .route('/meeting-report')
            .get(this.AdminReportController.meetingReport);
    }
}
exports.default = AdminReportRouter;
