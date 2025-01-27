import { Router } from "express";
import ClientAuthRouter from "./router/auth.client.router";
import AgentAuthRouter from "./router/auth.agent.router";
import AdminAuthRouter from "./router/auth.admin.router";

class AuthRouter {
  public AuthRouter = Router();

  constructor() {
    this.callRouter();
  }
  private callRouter() {
    //client auth router
    this.AuthRouter.use("/client", new ClientAuthRouter().router);

    //agent auth router
    this.AuthRouter.use("/agent", new AgentAuthRouter().router);

    //admin auth router
    this.AuthRouter.use("/admin", new AdminAuthRouter().router);
  }
}
export default AuthRouter;
