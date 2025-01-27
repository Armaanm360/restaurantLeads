"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("../auth/auth.router"));
const common_router_1 = __importDefault(require("../common/commonRouter/common.router"));
const authChecker_1 = __importDefault(require("./../common/middleware/authChecker/authChecker"));
const client_router_1 = __importDefault(require("../client/client.router"));
const agent_router_1 = __importDefault(require("../agent/agent.router"));
const admin_router_1 = __importDefault(require("../admin/admin.router"));
/**
 * RootRouter class that initializes and configures the version 1 (v1) router
 * for handling various routes related to authentication, common functionalities,
 * client operations, and agent operations.
 */
class RootRouter {
    /**
     * Constructor that initializes the v1Router by calling the setup method.
     */
    constructor() {
        this.v1Router = (0, express_1.Router)(); // Express Router for version 1 of the API
        this.authRouter = new auth_router_1.default(); // Instance of AuthRouter for authentication routes
        this.commonRouter = new common_router_1.default(); // Instance of commonRouter for shared routes
        this.authChecker = new authChecker_1.default(); // Middleware for authentication checks
        this.callV1Router();
    }
    /**
     * Sets up the v1Router by defining the routes and associating them
     * with the appropriate router instances and middleware.
     */
    callV1Router() {
        // Authentication routes for members
        this.v1Router.use('/auth', this.authRouter.AuthRouter);
        // Common routes accessible to all users
        this.v1Router.use('/common', this.commonRouter.router);
        // Client-specific routes, currently without authentication middleware
        this.v1Router.use('/client', 
        // this.authChecker.clientAuthChecker, // Uncomment to enable client authentication
        new client_router_1.default().router);
        // Agent-specific routes with authentication checks
        this.v1Router.use('/agent', this.authChecker.agentAuthChecker, // Middleware to ensure agent authentication
        new agent_router_1.default().router);
        // Admin-specific routes with authentication checks
        this.v1Router.use('/admin', this.authChecker.adminAuthChecker, // Middleware to ensure admin authentication
        new admin_router_1.default().router);
    }
}
exports.default = RootRouter;
