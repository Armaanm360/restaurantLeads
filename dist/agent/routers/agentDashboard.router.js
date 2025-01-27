"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const agentDashboard_controller_1 = __importDefault(require("../controllers/agentDashboard.controller"));
class AgentDashboardRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new agentDashboard_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // agent dashboard routes
        this.router.route("/").get(this.controller.getAgentDashboard);
    }
}
exports.default = AgentDashboardRouter;
