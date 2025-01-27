import { Request } from "express";
import AbstractServices from "../../abstract/abstract.service";
import { ILogin } from "../../common/types/commonTypes";
import config from "../../config/config";
import Lib from "../../utils/lib/lib";
import { OTP_TYPE_FORGET_EMPLOYEE } from "../../utils/miscellaneous/constants";

class ClientAuthService extends AbstractServices {
  //login service
  public async loginService({ email, password, device_token }: ILogin) {
    // const employeeModel = this.Model.employeeModel();
    // const checkUser = await employeeModel.getSingleEmployee({ email });
    // /* check if the organization is activated or no */

    // const checkOrganizationStatus =
    //   await this.Model.UserAdminModel().getOrganizationInfoEmployeeWise(email);

    // console.log(checkOrganizationStatus[0].organization_id);

    // const organizationStatus = await this.Model.employeeModel().getOrganization(
    //   checkOrganizationStatus[0].organization_id
    // );
    // /* end of organization check */
    // if (!checkUser.length) {
    //   return {
    //     success: false,
    //     code: this.StatusCode.HTTP_BAD_REQUEST,
    //     message: this.ResMsg.WRONG_CREDENTIALS,
    //   };
    // }

    // /* you are inactivated */
    // if (checkUser[0].status == 'inactive') {
    //   return {
    //     success: false,
    //     code: this.StatusCode.HTTP_BAD_REQUEST,
    //     message: 'This User Has Been Inactivated',
    //   };
    // }

    // if (organizationStatus.is_activate === false) {
    //   return {
    //     success: false,
    //     code: this.StatusCode.HTTP_BAD_REQUEST,
    //     message:
    //       'Sorry The Organization Is Inactivated,Please Contact With The Support',
    //   };
    // }
    // console.log(checkUser[0].status);

    // const {
    //   password: hashPass,
    //   device_token: e_device_token,
    //   ...rest
    // } = checkUser[0];

    // const token = Lib.createToken(
    //   { device_token, ...rest, type: 'employee' },
    //   config.JWT_SECRET_EMPLOYEE,
    //   '24h'
    // );

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      // token,
      // data: { ...rest, device_token },
    };
  }
  // get profile
  public async getProfile(req: Request) {
    // const { id, organization_id } = req.employee;

    // const data = await this.Model.employeeModel().getSingleEmployee({
    //   id,
    // });
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
    };
  }
  public async newupdateProfile(req: Request) {
    // const { id } = req.employee;

    // const model = this.Model.employeeModel();

    // const checkEmployee = await model.getSingleEmployee({
    //   id,
    // });

    // if (!checkEmployee.length) {
    //   return {
    //     success: true,
    //     code: this.StatusCode.HTTP_NOT_FOUND,
    //     message: this.ResMsg.HTTP_NOT_FOUND,
    //   };
    // }

    // const files = (req.files as Express.Multer.File[]) || [];

    // if (files.length) {
    //   req.body[files[0].fieldname] = files[0].filename;
    // }

    // await model.updateNewSingleEmployee(id, req.body);

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: "Profile updated successfully",
    };
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

export default ClientAuthService;
