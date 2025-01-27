"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const commonController_1 = __importDefault(require("../commonController/commonController"));
class commonRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.commonController = new commonController_1.default();
        this.callRouter();
    }
    callRouter() {
        // send email otp
        this.router.post('/send-email-otp', this.commonController.sendEmailOtpController);
        // match email otp
        this.router.post('/match-email-otp', this.commonController.matchEmailOtpController);
        // restaurant leads
        this.router.get('/restaurants', this.commonController.restaurantLeads);
    }
}
exports.default = commonRouter;
