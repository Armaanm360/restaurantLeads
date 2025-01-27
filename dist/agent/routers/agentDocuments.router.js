"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const agentDocuments_controller_1 = __importDefault(require("../controllers/agentDocuments.controller"));
class AgentDocumentRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new agentDocuments_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        // create and get agent document
        this.router
            .route('/')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.AGENT_DOCUMENT_FILES), this.controller.createAGentDocuments)
            .get(this.controller.getAGentDocument);
    }
}
exports.default = AgentDocumentRouter;
