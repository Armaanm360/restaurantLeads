"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const lead_controller_1 = __importDefault(require("../controller/lead.controller"));
class CRMRootLeadsRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new lead_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // created lead validator, get all lead,
        this.router
            .route('/')
            .post(this.controller.addLead)
            .get(this.controller.getAllLead);
        // get all lead by lead status for dashboard
        this.router
            .route('/dashboard')
            .get(this.controller.getDashboardLeadsStatics);
        // get dashoboard lifetime report
        this.router
            .route('/dashboard/report')
            .get(this.controller.getLifeTimeReport);
        // get daily lifetime report
        this.router.route('/dashboard/daily').get(this.controller.getDailyReport);
        // lead payment
        this.router.route('/payment/:id').post(this.controller.leadPayment);
        // contact lead
        this.router
            .route('/contact')
            .post(this.controller.addContactLead)
            .get(this.controller.getAllContactLead);
        // lead tracking
        this.router
            .route('/by-employee-id/:id')
            .get(this.controller.getAllLeadByEmpId);
        // lead tracking
        this.router.route('/tracking/:id').get(this.controller.getLeadTracking);
        // report month wise
        this.router
            .route('/month-wise-report')
            .get(this.controller.getMonthWiseReport);
        // get single lead history by lead id
        this.router
            .route('/history/by/:id')
            .get(this.controller.getLeadHistoryById);
        // get lead by assign id
        this.router.get('/assign_lead/:id', this.controller.getLeadByAssignLeadId);
        // get lead by assign id
        this.router.post('/assign-after-sales', this.controller.assignAfterSales);
        // update lead
        this.router
            .route('/:id')
            .put(this.controller.updateLead)
            .get(this.controller.getSingleLead);
    }
}
exports.default = CRMRootLeadsRouter;
