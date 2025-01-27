"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_upcConfiguration_controller_1 = __importDefault(require("../controllers/admin.upcConfiguration.controller"));
class AdminUpcConfigurationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_upcConfiguration_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create amenities
        this.router
            .route("/amenities")
            .post(this.controller.createAmenities)
            .get(this.controller.getAllAmenities);
        // update amenities
        this.router.route("/amenities/:id").patch(this.controller.updateAmenities);
    }
}
exports.default = AdminUpcConfigurationRouter;
