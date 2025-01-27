"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../abstract/abstract.router"));
const crm_report_router_1 = __importDefault(require("./routers/crm.report.router"));
const crmRootLead_router_1 = __importDefault(require("./routers/crmRootLead.router"));
const setting_router_1 = __importDefault(require("./routers/setting.router"));
class CRMRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // setting routes
        this.router.use("/setting", new setting_router_1.default().router);
        // lead routes
        this.router.use("/lead", new crmRootLead_router_1.default().router);
        // report routes
        this.router.use("/report", new crm_report_router_1.default().router);
    }
}
exports.default = CRMRouter;
