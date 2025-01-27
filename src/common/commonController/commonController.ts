import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import commonService from '../commonService/common.service';
import CommonValidator from './../validators/commonValidator';

class commonController extends AbstractController {
  private commonService = new commonService();
  constructor() {
    super();
  }

  // send email otp
  public sendEmailOtpController = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { email, type } = req.body;
      let table = '';
      let field = '';
      let otpFor = '';

      switch (type) {
        case 'forget_admin':
          table = 'admin_user';
          field = 'au_email';
          otpFor = 'Admin Reset Password';
          break;
        case 'forget_agent':
          table = 'users';
          field = 'email';
          otpFor = 'agent Reset Password';

        default:
          break;
      }

      const obj = { email, type, otpFor };
      console.log({ obj });

      let data = {
        success: false,
        message: 'Something is wrong',
      };

      if (type.startsWith('forget')) {
        const checkUser = await this.commonService.checkUserByUniqueKey({
          table,
          field,
          value: email,
        });
        console.log(checkUser);
        if (checkUser) {
          console.log('error start from.............................');
          data = await this.commonService.sendOtpToEmailService(obj);

          console.log({ data });
        } else {
          data = {
            success: false,
            message: 'No user found with this email.',
          };
        }
      } else if (type.startsWith('register')) {
        const checkUser = await this.commonService.checkUserByUniqueKey({
          table,
          field,
          value: email,
        });
        if (!checkUser) {
          data = await this.commonService.sendOtpToEmailService(obj);
        } else {
          data = {
            success: false,
            message: 'User already exist with this email.',
          };
        }
      } else {
        data = await this.commonService.sendOtpToEmailService(obj);
      }

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error(data.message || 'Something went wrong', 400);
      }
    }
  );

  // match email otp
  public matchEmailOtpController = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { email, otp, type } = req.body;
      const data = await this.commonService.matchEmailOtpService({
        email,
        otp,
        type,
      });

      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(400).json(data);
      }
    }
  );
  public restaurantLeads = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.restaurantLeads(req);
      res.status(code).json(data);
    }
  );
}

export default commonController;
