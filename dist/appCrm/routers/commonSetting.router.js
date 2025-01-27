"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const commonSetting_controller_1 = __importDefault(require("../controller/commonSetting.controller"));
// common setting routes
class CommonSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new commonSetting_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get all support type
        this.router
            .route("/support-type")
            .post(this.controller.creatSupportType)
            .get(this.controller.getAllSupportType);
        // update support type
        this.router
            .route("/support-type/:id")
            .patch(this.controller.updateSupportType);
    }
}
exports.default = CommonSettingRouter;
