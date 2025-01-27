"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
class MemberProfileRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.profileController = new profile_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/')
            .get(
        // this.validator.changePassword(),
        this.profileController.getProfile)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.PERFORMANCE_EMPLOYEE), this.profileController.updateProfile);
        this.router.route('/change-password').post(
        // this.validator.changePassword(),
        this.profileController.changePassword);
    }
}
exports.default = MemberProfileRouter;
