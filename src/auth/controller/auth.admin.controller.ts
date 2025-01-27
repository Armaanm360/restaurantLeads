import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import CommonService from '../../common/commonService/common.service';
import { ILogin, IRegistration } from '../../common/types/commonTypes';
import AgentValidator from '../utils/validator/agent.users.validator';
import AgentAuthService from '../services/auth.agent.service';
import AdminAuthService from '../services/auth.admin.service';

class AdminAuthController extends AbstractController {
  private service = new AdminAuthService();
  private commonService = new CommonService();
  private validator = new AgentValidator();
  constructor() {
    super();
  }

  // login
  public login = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.agentLoginValidator },
    {},
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
    // { bodySchema: this.validator.agentProfileUpdateValidator },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateProfile(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );
}

export default AdminAuthController;
