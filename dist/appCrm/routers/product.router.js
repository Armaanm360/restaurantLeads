"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const product_controller_1 = __importDefault(require("../controller/product.controller"));
const product_validator_1 = __importDefault(require("../utils/validation/setting/product.validator"));
// product routes
class CRMProductRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new product_controller_1.default();
        this.validator = new product_validator_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createProduct)
            .get(this.controller.retrieveProduct);
        // get all lead by product
        this.router
            .route("/leads/by-product/:id")
            .get(this.controller.getAllLeadByProduct);
        this.router
            .route("/:id")
            .put(this.controller.updateProduct)
            .delete(this.controller.deleteProduct)
            .get(this.controller.retrieveSingleProduct);
    }
}
exports.default = CRMProductRouter;
