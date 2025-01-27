import { Request, Response } from "express";
import AbstractController from "../../abstract/abstract.controller";
import CommonService from "../../common/commonService/common.service";
import { ILogin } from "../../common/types/commonTypes";
import ClientAuthService from "../services/auth.client.service";
import ClientValidator from "../utils/validator/client.users.validator";
import { ChecksumAlgorithm } from "@aws-sdk/client-s3";

class ClientAuthController extends AbstractController {
  private service = new ClientAuthService();
  private commonService = new CommonService();
  private clientValidator = new ClientValidator();
  constructor() {
    super();
  }

  // login
  public login = this.asyncWrapper.wrap(
    { bodySchema: this.clientValidator.clientLoginValidator },
    async (req: Request, res: Response) => {
      const { email, password } = req.body as ILogin;

      const { code, ...data } = await this.service.loginService({
        email,
        password,
        device_token: req.headers.devicetoken as string,
      });
      res.status(code).json(data);
    }
  );
  // register
  public register = this.asyncWrapper.wrap(
    { bodySchema: this.clientValidator.clientLoginValidator },
    async (req: Request, res: Response) => {
      const { email, password } = req.body as ILogin;

      const { code, ...data } = await this.service.loginService({
        email,
        password,
        device_token: req.headers.devicetoken as string,
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
    { bodySchema: this.clientValidator.clientProfileUpdateValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.newupdateProfile(req);
      if (data.success) {
        res.status(code).json(data);
      } else {
        this.error(data.message, code);
      }
    }
  );

  // forget password
  public forgetPassword = this.asyncWrapper.wrap(
    { bodySchema: this.clientValidator.clientForgetPasswordValidator },
    async (req: Request, res: Response) => {
      const { token, email, password } = req.body;
      const { code, ...data } = await this.service.forgetService({
        token,
        email,
        password,
      });
      res.status(code).json(data);
    }
  );

  // change password
  public changeClientPassword = this.asyncWrapper.wrap(
    { bodySchema: this.commonValidator.changePasswordValidator },
    async (req: Request, res: Response) => {
      const { old_password, new_password } = req.body;
      const { id } = req.employee;
      const table = "users";
      const passField = "password";
      const userIdField = "id";
      const schema = "crm";

      const { code, ...data } = await this.commonService.userPasswordVerify({
        table,
        oldPassword: old_password,
        passField,
        userId: id,
        userIdField,
        schema,
      });
      if (data.success) {
        const { code, ...data } = await this.commonService.changePassword(req);
        res.status(code).json(data);
      } else {
        res.status(code).json(data);
      }
    }
  );
}

export default ClientAuthController;
