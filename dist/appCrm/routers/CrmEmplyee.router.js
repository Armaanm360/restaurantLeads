"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_setting_router_1 = __importDefault(require("./emp.setting.router"));
const emp_support_router_1 = __importDefault(require("./emp.support.router"));
const empCommonEngage_router_1 = __importDefault(require("./empCommonEngage.router"));
const emplyeeLead_router_1 = __importDefault(require("./emplyeeLead.router"));
const engage_router_1 = __importDefault(require("./engage.router"));
class CrmEmplyeeRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        // lead routes
        this.router.use("/lead", new emplyeeLead_router_1.default().router);
        // engage lead routes
        this.router.use("/lead/engage", new engage_router_1.default().router);
        // setting routes
        this.router.use("/setting", new emp_setting_router_1.default().router);
        // support routes
        this.router.use("/support", new emp_support_router_1.default().router);
        // common engage routes
        this.router.use("/", new empCommonEngage_router_1.default().router);
    }
}
exports.default = CrmEmplyeeRouter;
