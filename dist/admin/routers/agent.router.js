"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const authChecker_1 = __importDefault(require("../../common/middleware/authChecker/authChecker"));
const agent_controller_1 = __importDefault(require("../controllers/agent.controller"));
/**
 * AgentPropertyRouter class that extends the AbstractRouter
 * and configures routes for managing agent properties.
 */
class AdminAgentRouter extends abstract_router_1.default {
    /**
     * Constructor that calls the parent constructor and sets up the router.
     */
    constructor() {
        super(); // Call the parent constructor from AbstractRouter
        this.controller = new agent_controller_1.default(); // Instance of the property controller for handling property-related logic
        this.authChecker = new authChecker_1.default();
        this.callRouter(); // Initialize the routes
    }
    /**
     * Configures the routes for managing agent properties, including
     * routes for retrieving and creating properties.
     */
    callRouter() {
        // Route for getting all properties and creating a new property
        this.router
            .route('/')
            .get(this.authChecker.adminAuthChecker, this.controller.getAllAgents);
        //agent verification
        this.router
            .route('/verification/:agent_id')
            .get(this.authChecker.adminAuthChecker, this.controller.getSingleAgent)
            .patch(this.authChecker.adminAuthChecker, this.controller.updateSingleAgentVerification);
        // .post(
        //   this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES), // Middleware for uploading property images
        //   this.controller.createProperty // POST request to create a new property
        // );
    }
}
exports.default = AdminAgentRouter;
