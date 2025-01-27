"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_commonSetting_router_1 = __importDefault(require("./emp.commonSetting.router"));
const emp_location_router_1 = __importDefault(require("./emp.location.router"));
const emp_organization_route_1 = __importDefault(require("./emp.organization.route"));
const emp_product_router_1 = __importDefault(require("./emp.product.router"));
const emp_source_route_1 = __importDefault(require("./emp.source.route"));
// setting routes
class CRMEmpSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        this.router.use("/organization", new emp_organization_route_1.default().router);
        this.router.use("/source", new emp_source_route_1.default().router);
        this.router.use("/product", new emp_product_router_1.default().router);
        this.router.use("/location", new emp_location_router_1.default().router);
        this.router.use("/common", new emp_commonSetting_router_1.default().router);
    }
}
exports.default = CRMEmpSettingRouter;
