"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const organizationController_1 = __importDefault(require("../controller/organizationController"));
// organization routes
class CrmOrganizationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new organizationController_1.default();
        this.callRouter();
    }
    callRouter() {
        // create organization type
        this.router
            .route('/')
            .post(this.controller.createCategoryOrganization)
            .get(this.controller.retrieveOrganization);
        // get all lead by product
        this.router
            .route('/leads/by-orgtype/:id')
            .get(this.controller.getAllLeadsByOrganizationType);
        // get all lead by product
        this.router
            .route('/leads/by-org/:id')
            .get(this.controller.getAllLeadsByOrganizationName);
        this.router
            .route('/:id')
            .put(this.controller.updateOrganizatioType)
            .delete(this.controller.deleteOrganizationType)
            .get(this.controller.retrieveSingleOrganization);
    }
}
exports.default = CrmOrganizationRouter;
