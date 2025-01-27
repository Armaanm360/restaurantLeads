import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';

import Lib from '../../utils/lib/lib';
import config from '../../config/config';
import {
  IChangePassProps,
  IForgetPassProps,
  IVerifyPassProps,
} from '../types/commonTypes';
import CustomError from '../../utils/lib/customEror';

class CommonService extends AbstractServices {
  constructor() {
    super();
  }
  // send otp to email
  public async sendOtpToEmailService(obj: {
    email: string;
    type: string;
    otpFor: string;
  }) {
    console.log({ o2222222222222bj: obj });
    return await this.db.transaction(async (trx) => {
      // Check if an OTP can be sent
      const checkOtp = await trx('email_otp')
        .withSchema(this.schema.DBO)
        .select('id', 'hashed_otp', 'tried')
        .where('email', obj.email)
        .andWhere('type', obj.type)
        .andWhere('matched', 0)
        .andWhere('tried', '<', 3)
        .andWhere('create_date', '>', trx.raw("NOW() - INTERVAL '3 minutes'"));

      console.log({ checkOtp });

      if (checkOtp.length > 0) {
        return {
          success: false,
          message: 'Cannot send another OTP within 3 minutes',
        };
      }

      const otp = Lib.otpGenNumber(6);
      const hashed_otp = await Lib.hashPass(otp);

      const otpCreds = {
        hashed_otp: hashed_otp,
        email: obj.email,
        type: obj.type,
      };

      // Send the email
      const sended = await Lib.sendEmail(
        obj.email,
        `Your One Time OTP for Shanta Property ${obj.otpFor}`,
        Lib.generateHtmlOtpPage(otp, obj.otpFor)
      );

      console.log({ sended });

      // Insert the OTP credentials
      await trx('email_otp').withSchema(this.schema.DBO).insert(otpCreds);

      // Return the result based on email sending success
      if (sended) {
        return {
          success: true,
          message: 'OTP sent successfully',
          data: {
            email: obj.email,
          },
        };
      } else {
        return { success: false, message: 'Cannot send OTP' };
      }
    });
  }

  // match email otp
  public async matchEmailOtpService(obj: {
    email: string;
    otp: string;
    type: string;
  }) {
    const table = 'email_otp';
    const checkOtp = await this.db(table)
      .withSchema(this.schema.DBO)
      .select('id', 'hashed_otp', 'tried')
      .where('email', obj.email)
      .where('type', obj.type)
      .where('matched', 0)
      .andWhere(
        'create_date',
        '>',
        this.db.raw("NOW() - INTERVAL '3 minutes'")
      );

    if (!checkOtp.length) {
      return {
        success: false,
        message: 'OTP expired',
      };
    }

    const { id, hashed_otp, tried } = checkOtp[0];

    if (tried > 3) {
      return {
        success: false,
        message: 'You tried more then 3 time for this otp verification!',
      };
    }

    console.log({ obj, hashed_otp });

    const otpValidation = await Lib.compare(obj.otp, hashed_otp);

    if (otpValidation) {
      await this.db(table)
        .withSchema(this.schema.DBO)
        .update({
          tried: tried + 1,
          matched: 1,
        })
        .where('id', id);

      let secret = config.JWT_SECRET_ADMIN;
      switch (obj.type) {
        case 'forget_admin':
          secret = config.JWT_SECRET_ADMIN;
          break;
        case 'forget_agent':
          secret = config.JWT_SECRET_AGENT;
          break;
        default:
          break;
      }
      const token = Lib.createToken(
        {
          email: obj.email,
          type: obj.type,
        },
        secret,
        '5m'
      );

      return {
        success: true,
        message: 'OTP matched successfully!',
        token,
      };
    } else {
      await this.db(table)
        .withSchema(this.schema.DBO)
        .update({
          tried: tried + 1,
        })
        .where('id', id);

      return {
        success: false,
        message: 'Invalid OTP',
      };
    }
  }

  // common change password
  public async changePassword(req: Request) {
    const { old_password, new_password } = req.body;
    const { email, id } = req.agent;

    const checkUser = await this.db('users')
      .withSchema(this.schema.USER_SCHEMA)
      .where({ email })
      .first();
    if (!checkUser) {
      return {
        success: false,
        code: 404,
        message: 'User not found',
      };
    }

    const password = checkUser.password;
    const verify = await Lib.compare(old_password, password);

    if (!verify) {
      return {
        success: false,
        code: 400,
        message: "Previous password doesn't match",
      };
    }

    const hashedPass = await Lib.hashPass(new_password);
    const updatePass = await this.db('users')
      .withSchema(this.schema.USER_SCHEMA)
      .where({ id })
      .update({ password: hashedPass });

    if (!updatePass) {
      return {
        success: false,
        code: 500,
      };
    }

    return {
      success: true,
      data: updatePass,
      code: 200,
      message: 'password has been changed',
    };
  }

  public async forgetPassword({
    table,
    passField,
    password,
    userEmailField,
    userEmail,
  }: IForgetPassProps) {
    const hashedPass = await Lib.hashPass(password);
    const updatePass = await this.db(table)
      .withSchema(this.schema.USER_SCHEMA)
      .update(passField, hashedPass)
      .where(userEmailField, userEmail);

    if (updatePass) {
      return {
        success: true,
        message: 'Password changed successfully!',
      };
    } else {
      return {
        success: true,
        message: 'Cannot change password now!',
      };
    }
  }

  // user password verify
  public async userPasswordVerify({
    table,
    passField,
    oldPassword,
    userIdField,
    userId,
    schema,
  }: IVerifyPassProps) {
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: 'Password is verified!',
    };

    // const commonModel = this.Model.commonModel();
    // const user = await commonModel.getUserPassword({
    //   table,
    //   schema,
    //   passField,
    //   userIdField,
    //   userId,
    // });

    // if (!user.length) {
    //   return {
    //     success: false,
    //     code: this.StatusCode.HTTP_NOT_FOUND,
    //     message: 'No user found with this id',
    //   };
    // }
    // const checkOldPass = await Lib.compare(oldPassword, user[0][passField]);
    // if (!checkOldPass) {
    //   return {
    //     success: false,
    //     code: this.StatusCode.HTTP_UNAUTHORIZED,
    //     message: 'Old password is not correct!',
    //   };
    // } else {
    //   return {
    //     success: true,
    //     code: this.StatusCode.HTTP_OK,
    //     message: 'Password is verified!',
    //   };
    // }
  }

  // check user
  public async checkUserByUniqueKey(obj: {
    table: string;
    field: string;
    value: string;
  }) {
    const check = await this.db(obj.table)
      .withSchema(this.schema.USER_SCHEMA)
      .select('*')
      .where(obj.field, obj.value);

    if (check.length) {
      return true;
    } else {
      return false;
    }
  }

  public async restaurantLeads(req: Request) {
    const model = this.Model.propertyModel();

    const { data, total } = await model.getAllRestaurants(req.query);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data,
      total,
    };
  }
}
export default CommonService;
