"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_upcServiceCenter_controller_1 = __importDefault(require("../controllers/admin.upcServiceCenter.controller"));
class AdminUpcServiceCenterRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_upcServiceCenter_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // get single card
        this.router
            .route("/:id")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.UPC_SERVICE_CENTER_FILES), this.commonValidator.commonSingleParamsIdInputValidator(), this.controller.updateServiceCenter);
    }
}
exports.default = AdminUpcServiceCenterRouter;
