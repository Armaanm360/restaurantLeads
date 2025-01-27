"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const notice_controller_1 = __importDefault(require("../controllers/notice.controller"));
class EmpNoticeRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new notice_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //get all notice
        this.router.route("/").get(this.controller.getAllNotice);
        // get single notice
        this.router.route("/:id").get(this.controller.getSingleNotice);
    }
}
exports.default = EmpNoticeRouter;
