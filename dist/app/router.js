"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const common_router_1 = __importDefault(require("../common/commonRouter/common.router"));
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
        this.commonRouter = new common_router_1.default(); // Instance of commonRouter for shared routes
        this.callV1Router();
    }
    callV1Router() {
        this.v1Router.use('/main', new common_router_1.default().router);
    }
}
exports.default = RootRouter;
