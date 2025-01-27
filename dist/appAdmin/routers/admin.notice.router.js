"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_notice_controller_1 = __importDefault(require("../controllers/admin.notice.controller"));
class AdminNoticeRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_notice_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.NOTICE_FILES), this.controller.createNotice)
            .get(this.controller.getAllNotice);
        // this.router
        //   .route("/types")
        //   .post(this.controller.createLeaveTypes)
        //   .get(this.controller.getAllLeaveTypes);
        // this.router
        //   .route("/types/:id")
        //   .patch(this.controller.updateLeaveTypes)
        //   .delete(this.controller.deleteLeaveTypes);
        // get single notice
        this.router
            .route("/:id")
            .get(this.controller.getSingleNotice)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.NOTICE_FILES), this.controller.updateSingleNotice);
        //   .delete(this.controller.deleteLeaveApplication);
    }
}
exports.default = AdminNoticeRouter;
