"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const config_1 = __importDefault(require("../../config/config"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
class ClientAuthService extends abstract_service_1.default {
    //login service
    loginService({ email, password, device_token }) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    // get profile
    getProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { id, organization_id } = req.employee;
            // const data = await this.Model.employeeModel().getSingleEmployee({
            //   id,
            // });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.LOGIN_SUCCESSFUL,
            };
        });
    }
    newupdateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    // forget
    forgetService({ token, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenVerify = lib_1.default.verifyToken(token, config_1.default.JWT_SECRET_EMPLOYEE);
            if (!tokenVerify) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_UNAUTHORIZED,
                    message: this.ResMsg.HTTP_UNAUTHORIZED,
                };
            }
            const { email: verifyEmail, type } = tokenVerify;
            if (email === verifyEmail && type === constants_1.OTP_TYPE_FORGET_EMPLOYEE) {
                // const hashPass = await Lib.hashPass(password);
                // const model = this.Model.employeeModel();
                // await model.updateSingleEmployee({ password: hashPass }, { email });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_FULFILLED,
                };
            }
            else {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: this.ResMsg.HTTP_BAD_REQUEST,
                };
            }
        });
    }
}
exports.default = ClientAuthService;
