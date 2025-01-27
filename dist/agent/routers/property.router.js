"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const property_controller_1 = __importDefault(require("../controllers/property.controller"));
/**
 * AgentPropertyRouter class that extends the AbstractRouter
 * and configures routes for managing agent properties.
 */
class AgentPropertyRouter extends abstract_router_1.default {
    /**
     * Constructor that calls the parent constructor and sets up the router.
     */
    constructor() {
        super(); // Call the parent constructor from AbstractRouter
        this.controller = new property_controller_1.default(); // Instance of the property controller for handling property-related logic
        this.callRouter(); // Initialize the routes
    }
    /**
     * Configures the routes for managing agent properties, including
     * routes for retrieving and creating properties.
     */
    callRouter() {
        // Route for getting all properties and creating a new property
        this.router
            .route("/")
            .get(this.controller.getMyProperties) // GET request to retrieve all properties
            .post(this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES), // Middleware for uploading property images
        this.controller.createProperty // POST request to create a new property
        );
        // get all aminity
        this.router.route("/amenities").get(this.controller.getAllAmenity);
        // get all status
        this.router
            .route("/status-history")
            .get(this.controller.getAllPropertyStatus);
        // get all features
        this.router.route("/feature").get(this.controller.getAllFeatures);
        // get all property types
        this.router
            .route("/property-types")
            .get(this.controller.getAllPropertyTypes);
        // Route for retrieving a single property by ID
        this.router
            .route("/:id")
            .get(this.controller.getSingleProperty)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES), this.controller.updateProperties)
            .delete(this.controller.deleteSingleProperty);
    }
}
exports.default = AgentPropertyRouter;
