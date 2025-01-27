"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_router_1 = __importDefault(require("./routers/team.router"));
const evaluation_router_1 = __importDefault(require("./routers/evaluation.router"));
const activity_router_1 = __importDefault(require("./routers/activity.router"));
const report_router_1 = __importDefault(require("./routers/report.router"));
const dashboard_router_1 = __importDefault(require("./routers/dashboard.router"));
const leave_router_1 = __importDefault(require("./routers/leave.router"));
const meeting_router_1 = __importDefault(require("./routers/meeting.router"));
const express_1 = require("express");
const employee_router_1 = __importDefault(require("./routers/employee.router"));
const admin_upc_router_1 = __importDefault(require("./routers/admin.upc.router"));
const crm_router_1 = __importDefault(require("../appCrm/crm.router"));
const rolepermssion_router_1 = __importDefault(require("./routers/rolepermssion.router"));
const admin_user_router_1 = __importDefault(require("./routers/admin.user.router"));
const discussion_router_1 = __importDefault(require("./routers/discussion.router"));
const admin_notice_router_1 = __importDefault(require("./routers/admin.notice.router"));
const requisition_router_1 = __importDefault(require("./routers/requisition.router"));
const project_router_1 = __importDefault(require("./routers/project.router"));
class AdminRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() {
        // role permission
        this.router.use('/role-permissions', new rolepermssion_router_1.default().router);
        // employee
        this.router.use('/employee', new employee_router_1.default().router);
        // admin user
        this.router.use('/user', new admin_user_router_1.default().router);
        //team router
        this.router.use('/teams', new team_router_1.default().router);
        //evaluation router
        this.router.use('/evaluation', new evaluation_router_1.default().router);
        //activity log router
        this.router.use('/activity', new activity_router_1.default().router);
        //report router
        this.router.use('/report', new report_router_1.default().router);
        //dashboard log router
        this.router.use('/dashboard', new dashboard_router_1.default().router);
        //leave router
        this.router.use('/meeting', new meeting_router_1.default().router);
        // upc router
        this.router.use('/upc', new admin_upc_router_1.default().router);
        // crm router
        this.router.use('/crm', new crm_router_1.default().router);
        //leave  router
        this.router.use('/leave', new leave_router_1.default().router);
        // notice router
        this.router.use('/notice', new admin_notice_router_1.default().router);
        //discussion  router
        this.router.use('/discussion', new discussion_router_1.default().router);
        //project management
        this.router.use('/pm', new project_router_1.default().router);
        //requisition  router
        this.router.use('/requisition', new requisition_router_1.default().router);
    }
}
exports.default = AdminRouter;
