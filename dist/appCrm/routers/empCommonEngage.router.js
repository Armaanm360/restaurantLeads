"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const empCommonEngage_controller_1 = __importDefault(require("../controller/empCommonEngage.controller"));
class EmpCommonEngageRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new empCommonEngage_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get all product
        this.router.route("/product").get(this.controller.getAllProduct);
        // get all source
        this.router.route("/source").get(this.controller.getAllSource);
        // get all organization
        this.router.route("/org").get(this.controller.getAllOrganization);
        // get all country
        this.router.route("/country").get(this.controller.getAllCountry);
        // get all city by country id
        this.router.route("/country/:id").get(this.controller.getallCityByCountry);
        // get all area by city id
        this.router.route("/city/:id").get(this.controller.getAllAreaByCity);
        // get all employee
        this.router.route("/emp").get(this.controller.getAllEmployee);
    }
}
exports.default = EmpCommonEngageRouter;
