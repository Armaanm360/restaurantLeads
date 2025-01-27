"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const property_controller_1 = __importDefault(require("../controllers/property.controller"));
class ClientPropertyRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new property_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //inquiry
        this.router.route('/inquiry').post(this.controller.addInquiry);
        //inquiry
        this.router.route('/property-types').get(this.controller.getPropertyTypes);
        //listing property
        this.router.route('/listing').post(this.controller.listingProperty);
        this.router.route('/').get(this.controller.getProperty);
        this.router.route('/:id').get(this.controller.getSingleProperty);
    }
}
exports.default = ClientPropertyRouter;
