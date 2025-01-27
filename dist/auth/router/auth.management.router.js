"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementAuthRouter = void 0;
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_validator_1 = __importDefault(require("../../common/validators/auth.validator"));
const auth_management_controller_1 = require("../controller/auth.management.controller");
class ManagementAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.authValidator = new auth_validator_1.default();
        this.controller = new auth_management_controller_1.AuthManagementController();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        //login router
        this.router
            .route('/login')
            .post(this.authValidator.loginValidator(), this.controller.login);
        // profile
        this.router
            .route('/profile')
            .get(this.authChecker.ManagementAuthChecker, this.controller.getProfile);
        // // forget password
        // this.router
        //   .route('/forget-password')
        //   .post(
        //     this.commonValidator.commonForgetPassInputValidation(),
        //     this.controller.forgetPassword
        //   );
        // // change password
        // this.router
        //   .route('/change-password')
        //   .post(
        //     this.authChecker.ServiceCenterAuthChecker,
        //     this.controller.changePassword
        //   );
    }
}
exports.ManagementAuthRouter = ManagementAuthRouter;
