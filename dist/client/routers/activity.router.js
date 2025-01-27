"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
class MemberActivityRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.MemberActivityController = new MemberActivityController();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/my-activity/list/:id')
            .get(this.MemberActivityController.getMyActivityList);
    }
}
exports.default = MemberActivityRouter;
