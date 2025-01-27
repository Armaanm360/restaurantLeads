import AbstractRouter from "../../abstract/abstract.router";
import AgentDashboardController from "../controllers/agentDashboard.controller";

class AgentDashboardRouter extends AbstractRouter {
  private controller = new AgentDashboardController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // agent dashboard routes
    this.router.route("/").get(this.controller.getAgentDashboard);
  }
}

export default AgentDashboardRouter;
