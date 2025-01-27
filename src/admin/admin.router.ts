import { Router } from 'express';
import AdminPropertyRouter from './routers/property.router';
import AdminAgentRouter from './routers/agent.router';

/**
 * AdminRouter class that initializes and configures the router for
 * handling Admin-specific routes, particularly for managing properties.
 */
class AdminRouter {
  public router = Router(); // Express Router for handling Admin routes

  /**
   * Constructor that sets up the router by calling the router configuration method.
   */
  constructor() {
    this.callRouter();
  }

  /**
   * Configures the Admin router by defining specific routes and
   * associating them with the corresponding router instances.
   */
  private callRouter() {
    // Route for managing Admin properties
    this.router.use('/properties', new AdminPropertyRouter().router);

    // Route for managing Admin Agents
    this.router.use('/agent', new AdminAgentRouter().router);
  }
}

export default AdminRouter;
