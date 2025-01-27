"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const checkIn_controller_1 = __importDefault(require("../controllers/checkIn.controller"));
class CheckInRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.checkInController = new checkIn_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all check in
        this.router.route("/").get(this.checkInController.getAllCheckIn);
        // single and update check in
        this.router
            .route("/:id")
            .get(this.checkInController.getSingleCheckIn)
            .patch(this.checkInController.updateCheckIn);
    }
}
exports.default = CheckInRouter;
