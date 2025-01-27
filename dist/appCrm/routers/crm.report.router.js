"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const crm_report_controller_1 = __importDefault(require("../controller/crm.report.controller"));
class reportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new crm_report_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // report month wise
        this.router
            .route("/lead-overall-report")
            .get(this.controller.getLeadReport);
    }
}
exports.default = reportRouter;
