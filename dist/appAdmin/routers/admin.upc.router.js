"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_upcCard_router_1 = __importDefault(require("./admin.upcCard.router"));
const admin_upcConfiguration_router_1 = __importDefault(require("./admin.upcConfiguration.router"));
const admin_upcServiceCenter_router_1 = __importDefault(require("./admin.upcServiceCenter.router"));
const admin_upcUser_router_1 = __importDefault(require("./admin.upcUser.router"));
class AdminUpcRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // upc user router
        this.router.use("/user", new admin_upcUser_router_1.default().router);
        // card router
        this.router.use("/card", new admin_upcCard_router_1.default().router);
        // service router
        this.router.use("/service-center", new admin_upcServiceCenter_router_1.default().router);
        // configuration router
        this.router.use("/configuration", new admin_upcConfiguration_router_1.default().router);
    }
}
exports.default = AdminUpcRouter;
