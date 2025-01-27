"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const employee_controller_1 = __importDefault(require("../controllers/employee.controller"));
class AdminEmployeeRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.employeeController = new employee_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.EMPLOYEE_FILES), this.employeeController.createEmployee)
            .get(this.employeeController.getAllEmployee);
        // get single employee
        this.router
            .route("/:id")
            .get(this.commonValidator.commonSingleParamsIdInputValidator(), this.employeeController.getSingleEmployee)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.EMPLOYEE_FILES), this.employeeController.updateSingleEmployee);
        this.router
            .route("/work/shift")
            .post(this.employeeController.createShift)
            .get(this.employeeController.getAllShift);
        this.router
            .route("/work/shift/:id")
            .patch(this.employeeController.updateShift);
        // .get(this.employeeController.getAllShift);
    }
}
exports.default = AdminEmployeeRouter;
