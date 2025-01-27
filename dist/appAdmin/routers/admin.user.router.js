"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_user_controllert_1 = __importDefault(require("../controllers/admin.user.controllert"));
class AdminUserRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.adminUserController = new admin_user_controllert_1.default();
        this.callRouter();
    }
    callRouter() {
        //create admin
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_USER_FILES), this.adminUserController.createAdminUser)
            .get(this.adminUserController.getAllAdmin);
        this.router
            .route("/clear-notification")
            .delete(
        // this.uploader.cloudUploadRaw(this.fileFolders.DUMMY_ORGANIZATION),
        this.adminUserController.clearNotification)
            .get(this.adminUserController.getAllAdmin);
        this.router
            .route("/create-dummy-organization-user")
            .post(
        // this.uploader.cloudUploadRaw(this.fileFolders.DUMMY_ORGANIZATION),
        this.adminUserController.dummyOrganizationCreate)
            .get(this.adminUserController.getAllAdmin);
        // get single employee
        this.router
            .route("/:id")
            .get(this.commonValidator.commonSingleParamsIdInputValidator(), this.adminUserController.getSingleAdmin)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_USER_FILES), this.adminUserController.updateSingleAdmin);
        this.router
            .route("/organization/update-organization")
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.ORGANIZATION), this.adminUserController.updateOrganization)
            .get(this.adminUserController.getOrganization);
        this.router
            .route("/notification/view-admin-notifications")
            .patch(this.adminUserController.viewAllNotification);
        this.router
            .route("/notification/admin-notifications")
            .get(this.adminUserController.getAllNotification)
            .patch(this.adminUserController.updateNotificationStatus);
    }
}
exports.default = AdminUserRouter;
