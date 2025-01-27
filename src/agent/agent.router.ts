import { Router } from 'express';
import AgentPropertyRouter from './routers/property.router';
import AgentDashboardRouter from './routers/agentDashboard.router';
import AgentDocumentRouter from './routers/agentDocuments.router';
import AgentLeadRouter from './routers/agentLeads.router';

/**
 * AgentRouter class that initializes and configures the router for
 * handling agent-specific routes, particularly for managing properties.
 */
class AgentRouter {
  public router = Router(); // Express Router for handling agent routes

  /**
   * Constructor that sets up the router by calling the router configuration method.
   */
  constructor() {
    this.callRouter();
  }

  /**
   * Configures the agent router by defining specific routes and
   * associating them with the corresponding router instances.
   */
  private callRouter() {
    // Route for managing agent properties
    this.router.use('/properties', new AgentPropertyRouter().router);

    // dashboard routes
    this.router.use('/dashboard', new AgentDashboardRouter().router);

    // agent documents routes
    this.router.use('/submit-documents', new AgentDocumentRouter().router);

    // agent documents routes
    this.router.use('/my-leads', new AgentLeadRouter().router);
  }
}

export default AgentRouter;
