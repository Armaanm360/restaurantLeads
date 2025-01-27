import { Router } from 'express';
import AuthRouter from '../auth/auth.router';
import commonRouter from '../common/commonRouter/common.router';
import AuthChecker from './../common/middleware/authChecker/authChecker';
import ClientRouter from '../client/client.router';
import AgentRouter from '../agent/agent.router';
import AdminRouter from '../admin/admin.router';

/**
 * RootRouter class that initializes and configures the version 1 (v1) router
 * for handling various routes related to authentication, common functionalities,
 * client operations, and agent operations.
 */
class RootRouter {
  public v1Router = Router(); // Express Router for version 1 of the API
  private authRouter = new AuthRouter(); // Instance of AuthRouter for authentication routes
  private commonRouter = new commonRouter(); // Instance of commonRouter for shared routes
  private authChecker = new AuthChecker(); // Middleware for authentication checks

  /**
   * Constructor that initializes the v1Router by calling the setup method.
   */
  constructor() {
    this.callV1Router();
  }

  /**
   * Sets up the v1Router by defining the routes and associating them
   * with the appropriate router instances and middleware.
   */
  private callV1Router() {
    // Authentication routes for members
    this.v1Router.use('/auth', this.authRouter.AuthRouter);

    // Common routes accessible to all users
    this.v1Router.use('/common', this.commonRouter.router);

    // Client-specific routes, currently without authentication middleware
    this.v1Router.use(
      '/client',
      // this.authChecker.clientAuthChecker, // Uncomment to enable client authentication
      new ClientRouter().router
    );

    // Agent-specific routes with authentication checks
    this.v1Router.use(
      '/agent',
      this.authChecker.agentAuthChecker, // Middleware to ensure agent authentication
      new AgentRouter().router
    );

    // Admin-specific routes with authentication checks
    this.v1Router.use(
      '/admin',
      this.authChecker.adminAuthChecker, // Middleware to ensure admin authentication
      new AdminRouter().router
    );
  }
}

export default RootRouter;
