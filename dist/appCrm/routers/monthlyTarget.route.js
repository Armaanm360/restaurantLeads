"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const monthlyTarget_controller_1 = __importDefault(require("../controller/monthlyTarget.controller"));
const monthlyTarget_validation_1 = __importDefault(require("../utils/validation/setting/monthlyTarget.validation"));
class CRMMonthlyTargetRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new monthlyTarget_controller_1.default();
        this.validator = new monthlyTarget_validation_1.default();
        this.callRouter();
    }
    callRouter() {
        // create monthly target, get monthly target routes
        this.router
            .route("/")
            .post(this.controller.assingMonthlyTarget)
            .get(this.controller.retrieveMonthlyTarget);
        //
        this.router
            .route("/all-emp")
            .get(this.controller.retrieveMonthlyTargetWithAllEmp);
        // update monthly target , delete monthly target, retrieve signly target routes
        this.router
            .route("/:id")
            .put(this.controller.updateMonthlyTarget)
            .delete(this.controller.deleteMonthlyTarget)
            .get(this.controller.retrieveSingleMonthlyTarget);
    }
}
exports.default = CRMMonthlyTargetRouter;
