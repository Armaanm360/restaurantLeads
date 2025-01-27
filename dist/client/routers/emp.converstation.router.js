"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const emp_conversation_controller_1 = __importDefault(require("../controllers/emp.conversation.controller"));
class EmpConversationRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new emp_conversation_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // sendMessage
        this.router
            .route("/")
            .get(this.controller.getAllEmpConversation)
            .post(this.uploader.cloudUploadRaw(this.fileFolders.CONVERSATION_FILES), this.controller.sendMessage);
        // total unseen msg
        this.router
            .route("/total-unseen")
            .get(this.controller.getTotalUnseenConversation);
        // del emp conversation
        this.router
            .route("/by/sender_id/:id/receiver-id/:receiver_id")
            .delete(this.controller.delEmpConversation);
        // get single conversation
        this.router
            .route("/by-emp/:id")
            .get(this.controller.getSingleEmpConversation);
    }
}
exports.default = EmpConversationRouter;
