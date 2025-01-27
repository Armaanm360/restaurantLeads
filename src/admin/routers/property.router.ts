import AbstractRouter from '../../abstract/abstract.router';
import ClientPropertyController from '../controllers/property.controller';

/**
 * AgentPropertyRouter class that extends the AbstractRouter
 * and configures routes for managing agent properties.
 */
class AdminPropertyRouter extends AbstractRouter {
  private controller = new ClientPropertyController(); // Instance of the property controller for handling property-related logic

  /**
   * Constructor that calls the parent constructor and sets up the router.
   */
  constructor() {
    super(); // Call the parent constructor from AbstractRouter
    this.callRouter(); // Initialize the routes
  }

  /**
   * Configures the routes for managing agent properties, including
   * routes for retrieving and creating properties.
   */
  private callRouter() {
    // Route for getting all properties and creating a new property
    this.router
      .route('/')
      .get(this.controller.getMyProperties) // GET request to retrieve all properties
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES), // Middleware for uploading property images
        this.controller.createProperty // POST request to create a new property
      );

    // get all aminity
    this.router.route('/amenities').get(this.controller.getAllAmenity);

    // get all status
    this.router
      .route('/status-history')
      .get(this.controller.getAllPropertyStatus);

    // verify property
    this.router
      .route('/verify-property/:id')
      .patch(this.controller.verifyProperty);

    // get all features
    this.router.route('/feature').get(this.controller.getAllFeatures);

    // get all features
    this.router
      .route('/property-listing')
      .get(this.controller.getAllPropertyListing);

    // Route for retrieving a single property by ID
    this.router
      .route('/:id')
      .get(this.controller.getSingleProperty)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES),
        this.controller.updateProperties
      );
  }
}

export default AdminPropertyRouter;
