import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { ILogin } from '../../common/types/commonTypes';
import config from '../../config/config';
import Lib from '../../utils/lib/lib';
import { OTP_TYPE_FORGET_EMPLOYEE } from '../../utils/miscellaneous/constants';

class AdminAuthService extends AbstractServices {
  //new agent registration validator

  //login service
  public async loginService({ email, password }: ILogin) {
    const model = this.Model.adminModel();

    // Fetch the user by email
    const checkUser = await model.getSingleAdmin({ email });

    // If no user is found
    if (!checkUser.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    // Destructure password and the rest of the user details
    const { password: hashPass, ...rest } = checkUser[0];

    // Compare the provided password with the hashed password
    const checkPass = await Lib.compare(password, hashPass);

    console.log('hello checkpass', checkPass, password, hashPass);

    // If the password matches, generate a token and return a success response
    if (checkPass) {
      const token = Lib.createToken(
        { ...rest, type: 'admin' }, // Include user details and user type
        config.JWT_SECRET_ADMIN, // Use the agent-specific secret
        '240h' // Token valid for 240 hours
      );

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.LOGIN_SUCCESSFUL,
        data: { token, ...rest },
      };
    }

    // If the password doesn't match
    return {
      success: false,
      code: this.StatusCode.HTTP_BAD_REQUEST,
      message: this.ResMsg.WRONG_CREDENTIALS,
    };
  }

  // get profile
  public async getProfile(req: Request) {
    const { id } = req.admin;

    const model = this.Model.adminModel();

    // Fetch the user by email
    const data = await model.getSingleAdmin({ id });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      data: data[0],
    };
  }
  public async updateProfile(req: Request) {
    const { id } = req.admin;

    const model = this.Model.adminModel();
    const body = req.body;

    // Fetch the user by email
    const data = await model.getSingleAdmin({ id });

    if (!data.length) {
      return {
        success: false,
        code: this.StatusCode.HTTP_NOT_FOUND,
        message: this.ResMsg.HTTP_NOT_FOUND,
      };
    }

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length) {
      body['avatar'] = files[0].filename;
    }

    console.log('the body portion', body);

    const res = await model.updateAdminProfile({ id }, body);

    if (files.length && data[0].avatar) {
      await this.manageFile.deleteFromCloud([data[0].avatar]);
    }

    if (res.length) {
      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: 'profile updated successfully',
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_CONFLICT,
        message: 'profile does not updated',
      };
    }
  }

  // forget
  public async forgetService({
    token,
    email,
    password,
  }: {
    token: string;
    email: string;
    password: string;
  }) {
    const tokenVerify: any = Lib.verifyToken(token, config.JWT_SECRET_EMPLOYEE);

    if (!tokenVerify) {
      return {
        success: false,
        code: this.StatusCode.HTTP_UNAUTHORIZED,
        message: this.ResMsg.HTTP_UNAUTHORIZED,
      };
    }

    const { email: verifyEmail, type } = tokenVerify;

    if (email === verifyEmail && type === OTP_TYPE_FORGET_EMPLOYEE) {
      // const hashPass = await Lib.hashPass(password);
      // const model = this.Model.employeeModel();
      // await model.updateSingleEmployee({ password: hashPass }, { email });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: this.ResMsg.HTTP_FULFILLED,
      };
    } else {
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.HTTP_BAD_REQUEST,
      };
    }
  }
}

export default AdminAuthService;
