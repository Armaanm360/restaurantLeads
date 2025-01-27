"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_client_router_1 = __importDefault(require("./router/auth.client.router"));
const auth_agent_router_1 = __importDefault(require("./router/auth.agent.router"));
const auth_admin_router_1 = __importDefault(require("./router/auth.admin.router"));
class AuthRouter {
    constructor() {
        this.AuthRouter = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() {
        //client auth router
        this.AuthRouter.use("/client", new auth_client_router_1.default().router);
        //agent auth router
        this.AuthRouter.use("/agent", new auth_agent_router_1.default().router);
        //admin auth router
        this.AuthRouter.use("/admin", new auth_admin_router_1.default().router);
    }
}
exports.default = AuthRouter;
