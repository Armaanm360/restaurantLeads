import { Request, Response } from "express";
import AbstractController from "../../abstract/abstract.controller";
import CommonService from "../../common/commonService/common.service";
import { ILogin, IRegistration } from "../../common/types/commonTypes";
import AgentValidator from "../utils/validator/agent.users.validator";
import config from "../../config/config";
import Lib from "../../utils/lib/lib";
import AgentAuthService from "./../services/auth.agent.service";

class AgentAuthController extends AbstractController {
  private service = new AgentAuthService();
  private commonService = new CommonService();
  private validator = new AgentValidator();
  constructor() {
    super();
  }

  // new agent registration
  public register = this.asyncWrapper.wrap(
    { bodySchema: this.validator.agentRegistrationValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.registrationService(req);

      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.validator.agentLoginValidator },
    async (req: Request, res: Response) => {
      const { email, password } = req.body as ILogin;

      const { code, ...data } = await this.service.loginService({
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // get profile
  public getProfile = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getProfile(req);
      res.status(code).json(data);
    }
  );

  // update profile
  public updateProfile = this.asyncWrapper.wrap(
    { bodySchema: this.validator.agentProfileUpdateValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateAgentProfile(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // forget password
  public forgetPassword = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { token, email, password } = req.body;

      const tokenVerify: any = Lib.verifyToken(token, config.JWT_SECRET_AGENT);

      console.log({ tokenVerify });

      if (tokenVerify) {
        const { email: verifyEmail, type } = tokenVerify;
        if (email === verifyEmail && type === "forget_agent") {
          const data = await this.service.forgetPassword({
            password,
            passField: "password",
            table: "users",
            userEmailField: "email",
            userEmail: email,
          });
          if (data.success) {
            res.status(200).json(data);
          } else {
            res.status(400).json(data);
          }
        } else {
          res.status(400).json({
            success: false,
            message:
              "Unauthorized token, It doesn't match with your email or type",
          });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid token or token expired" });
      }
    }
  );

  // change password
  public changePassword = this.asyncWrapper.wrap(
    { bodySchema: this.validator.changePassword },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.changePassword(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );
}

export default AgentAuthController;
