"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_location_controller_1 = __importDefault(require("../controller/emp.location.controller"));
const location_validation_1 = __importDefault(require("../utils/validation/setting/location.validation"));
// location routes
class CRMEmpLocationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new emp_location_controller_1.default();
        this.validator = new location_validation_1.default();
        this.callRouter();
    }
    callRouter() {
        // get address
        this.router.route("/").get(this.controller.getAllAddress);
        this.router
            .route("/country")
            .post(this.controller.addCountry)
            .get(this.controller.retrieveCountry);
        // update city, delete country, and get city by country routes
        this.router
            .route("/country/:id")
            .put(this.controller.updateCountry)
            .delete(this.controller.deleteCountry)
            .get(this.controller.getAllCityByCountry);
        // city
        this.router.route("/city").post(this.controller.addCity);
        this.router
            .route("/city/:id")
            .put(this.controller.updateCity)
            .get(this.controller.getAllAreaByCity);
        // create area
        this.router.route("/area").post(this.controller.addArea);
        // update area
        this.router.route("/area/:id").put(this.controller.updateArea);
    }
}
exports.default = CRMEmpLocationRouter;
