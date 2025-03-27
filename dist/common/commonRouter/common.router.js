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
        this.router.get('/clients', this.commonController.moveClients);
        this.router.get('/accounts', this.commonController.moveAccounts);
        this.router.get('/vendors', this.commonController.moveVendors);
        this.router.get('/employees', this.commonController.moveEmployees);
        this.router.get('/invoices', this.commonController.invoices);
        this.router.get('/refresh', this.commonController.refreshDatabase);
        this.router.get('/refunds', this.commonController.refundController);
        this.router.get('/invoicenoncom', this.commonController.invoicenoncom);
        this.router.get('/reissue', this.commonController.reissue);
        this.router.get('/receipt', this.commonController.receipt);
    }
}
exports.default = commonRouter;
