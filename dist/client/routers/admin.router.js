"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_controller_1 = __importDefault(require("../controllers/admin.controller"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
class AdminRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.AdminController = new admin_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/')
            .post(this.AdminController.createAdmin)
            .get(this.AdminController.getAdmin);
        this.router
            .route('/permissions')
            .post(this.AdminController.createPermissions);
        this.router
            .route('/permissions/:userid')
            .get(this.AdminController.getPermissions);
        this.router
            .route('/audit-trails')
            .post(this.AdminController.createAdmin)
            .get(this.AdminController.getAdmin);
    }
}
exports.default = AdminRouter;
