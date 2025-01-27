import { Request, Response } from "express";
import AbstractController from "../../abstract/abstract.controller";
import AgentDashboardService from "../services/agentDashboard.service";

class AgentDashboardController extends AbstractController {
  private service = new AgentDashboardService();
  constructor() {
    super();
  }
  // get agent dashboard data
  public getAgentDashboard = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.AgentDashboard(req);
      res.status(code).json(data);
    }
  );
}

export default AgentDashboardController;
