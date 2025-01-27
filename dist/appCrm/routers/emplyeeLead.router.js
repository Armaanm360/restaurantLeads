"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const employeeLead_controller_1 = __importDefault(require("../controller/employeeLead.controller"));
class EmployeeLeadRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new employeeLead_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all leads
        this.router
            .route("/")
            .post(this.controller.addLead)
            .get(this.controller.getAllLeadByEmp);
        // get all lead by no employee
        this.router.route("/all").get(this.controller.getAllLead);
        // get all lead by current date
        this.router.route("/current-day").get(this.controller.getCurrentDayAllLead);
        // get all lead by current date
        this.router
            .route("/after-sale/current-day")
            .get(this.controller.getCurrentDayAllAfterSaleLead);
        // received/forwared lead list
        this.router.route("/forward").get(this.controller.getAllReceivedLead);
        // assign lead
        this.router.route("/assigned").get(this.controller.AllAssignedLeadList);
        // after sale assigned lead
        this.router
            .route("/after-sale-assigned")
            .get(this.controller.AllAfterSaleAssignedLeadList);
        // getEmployeeLeadCount
        this.router.route("/count").get(this.controller.getEmployeeLeadCount);
        // monthly target
        this.router
            .route("/monthly-target")
            .get(this.controller.getEmployeeMonthlyTarget);
        // get today lead statistics
        this.router
            .route("/statistics")
            .get(this.controller.getCurrentDayStatistics);
        // lead permission
        this.router.route("/permission").get(this.controller.getLeadPermission);
        // lead tracking
        this.router.route("/tracking/:id").get(this.controller.getLeadTracking);
        // get single lead history by lead id
        this.router.route("/history/:id").get(this.controller.getLeadHistoryById);
        // update lead
        this.router
            .route("/:id")
            .put(this.controller.updateLead)
            .get(this.controller.getSingleLead);
    }
}
exports.default = EmployeeLeadRouter;
