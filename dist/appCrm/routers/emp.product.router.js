"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_product_controller_1 = __importDefault(require("../controller/emp.product.controller"));
const product_validator_1 = __importDefault(require("../utils/validation/setting/product.validator"));
// product routes
class CRMEmpProductRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new emp_product_controller_1.default();
        this.validator = new product_validator_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router.route("/").get(this.controller.retrieveProduct);
        // get all lead by product
        this.router
            .route("/leads/by-product/:id")
            .get(this.controller.getAllLeadByProduct);
        this.router.route("/:id").get(this.controller.retrieveSingleProduct);
    }
}
exports.default = CRMEmpProductRouter;
