"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_upcCard_controller_1 = __importDefault(require("../controllers/admin.upcCard.controller"));
class AdminUpcCardRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_upcCard_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create card
        this.router
            .route("/")
            .post(this.controller.createCard)
            .get(this.controller.getAllCard);
        // card amenities add
        this.router.route("/amenities").post(this.controller.amenitiesAddInCard);
        // get single card
        this.router
            .route("/:id")
            .get(this.controller.getSingleCard)
            .patch(this.commonValidator.commonSingleParamsIdInputValidator(), this.controller.updateCard);
    }
}
exports.default = AdminUpcCardRouter;
