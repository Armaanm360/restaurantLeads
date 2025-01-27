"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const auth_agent_controller_1 = __importDefault(require("../controller/auth.agent.controller"));
class AgentAuthRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new auth_agent_controller_1.default();
        this.authChecker = new authChecker_1.default();
        this.callRouter();
    }
    callRouter() {
        //new agent registration router
        this.router
            .route('/register')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENT_AVATARS), this.controller.register);
        //login router
        this.router.route('/login').post(this.controller.login);
        // profile
        this.router
            .route('/profile')
            .get(this.authChecker.agentAuthChecker, this.controller.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.AGENT_AVATARS), this.authChecker.agentAuthChecker, this.controller.updateProfile);
        // forget password
        this.router
            .route('/forget-password')
            .post(this.authChecker.agentAuthChecker, this.controller.forgetPassword);
        // change password
        this.router
            .route('/change-password')
            .post(this.authChecker.agentAuthChecker, this.controller.changePassword);
    }
}
exports.default = AgentAuthRouter;
