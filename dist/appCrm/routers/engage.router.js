"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const engage_controller_1 = __importDefault(require("../controller/engage.controller"));
class EngageLeadRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new engage_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // engage contact lead
        this.router
            .route("/contact-lead/:id")
            .post(this.controller.EngageContactLead);
        // engage sale data
        this.router.route("/sale/:id").post(this.controller.SaleEngageLead);
        // engage agreement
        this.router.route("/agreement/:id").post(this.controller.EngageAgreement);
        // engage demo link
        this.router.route("/demo/:id").post(this.controller.EngageDemoLink);
        // engage visit
        this.router.route("/visit/:id").post(this.controller.EngageVisit);
        // engage lead forward
        this.router.route("/forward/:id").post(this.controller.EngageLeadForward);
        // engage lead activity
        this.router.route("/activity/:id").post(this.controller.insertLeadActivity);
        // engage lead forward
        this.router
            .route("/after-sale-lead/:id")
            .post(this.controller.updateAfterSaleLead);
    }
}
exports.default = EngageLeadRouter;
