"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementRouter = void 0;
const express_1 = require("express");
const organization_router_1 = __importDefault(require("./routers/organization.router"));
const permission_router_1 = __importDefault(require("./routers/permission.router"));
const users_router_1 = __importDefault(require("./routers/users.router"));
class ManagementRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() {
        // organization
        this.router.use("/organizations", new organization_router_1.default().router);
        // permission groups
        this.router.use("/permissions", new permission_router_1.default().router);
        //users
        this.router.use("/users", new users_router_1.default().router);
    }
}
exports.ManagementRouter = ManagementRouter;
