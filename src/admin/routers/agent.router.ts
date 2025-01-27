import AbstractRouter from '../../abstract/abstract.router';
import AuthChecker from '../../common/middleware/authChecker/authChecker';
import AdminAgentController from '../controllers/agent.controller';

/**
 * AgentPropertyRouter class that extends the AbstractRouter
 * and configures routes for managing agent properties.
 */
class AdminAgentRouter extends AbstractRouter {
  private controller = new AdminAgentController(); // Instance of the property controller for handling property-related logic
  private authChecker = new AuthChecker();

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
      .get(this.authChecker.adminAuthChecker, this.controller.getAllAgents);

    //agent verification
    this.router
      .route('/verification/:agent_id')
      .get(this.authChecker.adminAuthChecker, this.controller.getSingleAgent)
      .patch(
        this.authChecker.adminAuthChecker,
        this.controller.updateSingleAgentVerification
      );
    // .post(
    //   this.uploader.cloudUploadRaw(this.fileFolders.PROPERTY_FILES), // Middleware for uploading property images
    //   this.controller.createProperty // POST request to create a new property
    // );
  }
}

export default AdminAgentRouter;
