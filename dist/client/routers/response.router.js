"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const response_controller_1 = __importDefault(require("../controllers/response.controller"));
class MemberResponseRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.MemberResponseController = new response_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create employee
        this.router.route('/').post(
        // this.validator.changePassword(),
        this.MemberResponseController.createResponse);
    }
}
exports.default = MemberResponseRouter;
