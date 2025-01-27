"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const auth_validator_1 = __importDefault(require("../../common/validators/auth.validator"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_upc_controller_1 = __importDefault(require("../controller/auth.upc.controller"));
class UpcAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.authValidator = new auth_validator_1.default();
        this.controller = new auth_upc_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        //login router
        this.router
            .route("/login")
            .post(this.authValidator.loginValidator(), this.controller.login);
        // profile
        this.router
            .route("/profile")
            .get(this.authChecker.UpcAuthChecker, this.controller.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.UPC_USER_FILES), this.authChecker.UpcAuthChecker, this.controller.updateProfile);
        // forget password
        this.router
            .route("/forget-password")
            .post(this.commonValidator.commonForgetPassInputValidation(), this.controller.forgetPassword);
        // change password
        this.router
            .route("/change-password")
            .post(this.authChecker.UpcAuthChecker, this.controller.changeAdminPassword);
    }
}
exports.default = UpcAuthRouter;
