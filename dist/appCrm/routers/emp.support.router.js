"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_support_controller_1 = __importDefault(require("../controller/emp.support.controller"));
// support routes
class CRMEmpSupportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new emp_support_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // insert support by lead id
        this.router.route("/").post(this.controller.insertSupport);
        // get all support by lead id
        this.router.route("/:id").get(this.controller.getAllSupportByLeadId);
    }
}
exports.default = CRMEmpSupportRouter;
