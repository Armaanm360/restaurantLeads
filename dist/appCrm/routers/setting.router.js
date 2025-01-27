"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const commonSetting_router_1 = __importDefault(require("./commonSetting.router"));
const location_router_1 = __importDefault(require("./location.router"));
const monthlyTarget_route_1 = __importDefault(require("./monthlyTarget.route"));
const organization_route_1 = __importDefault(require("./organization.route"));
const product_router_1 = __importDefault(require("./product.router"));
const source_route_1 = __importDefault(require("./source.route"));
// setting routes
class CRMSettingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.callRouter();
    }
    callRouter() {
        this.router.use("/organization", new organization_route_1.default().router);
        this.router.use("/source", new source_route_1.default().router);
        this.router.use("/product", new product_router_1.default().router);
        this.router.use("/common", new commonSetting_router_1.default().router);
        this.router.use("/monthly_target", new monthlyTarget_route_1.default().router);
        this.router.use("/location", new location_router_1.default().router);
    }
}
exports.default = CRMSettingRouter;
