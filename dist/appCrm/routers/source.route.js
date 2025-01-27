"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const source_controller_1 = __importDefault(require("../controller/source.controller"));
// source routes
class CRMSourceRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new source_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route("/")
            .post(this.controller.createSource)
            .get(this.controller.retrieveSources);
        // get all lead by source
        this.router
            .route("/leads/by-source/:id")
            .get(this.controller.getAllLeadsBySource);
        this.router
            .route("/:id")
            .put(this.controller.updateSources)
            .get(this.controller.retrieveSingleSource);
    }
}
exports.default = CRMSourceRouter;
