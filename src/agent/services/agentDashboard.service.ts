import { Request } from "express";
import AbstractServices from "../../abstract/abstract.service";

class AgentDashboardService extends AbstractServices {
  constructor() {
    super();
  }

  // get single Property
  public async AgentDashboard(req: Request) {
    const { id: agent_id } = req.agent;
    const id = req.params.id;

    const model = this.Model.agentDashboardModel();
    const data = await model.AgentDashboardData({ agent_id });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
    };
  }
}

export default AgentDashboardService;
