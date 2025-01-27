import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { IForgetPassProps, ILogin } from '../../common/types/commonTypes';
import config from '../../config/config';
import Lib from '../../utils/lib/lib';
import { OTP_TYPE_FORGET_EMPLOYEE } from '../../utils/miscellaneous/constants';

class AgentAuthService extends AbstractServices {
  //new agent registration validator

  public async registrationService(req: Request) {
    return this.db.transaction(async (trx) => {
      const { email, phone, name, password, commission_rate, ...rest } =
        req.body;
      const model = this.Model.agentModel(trx);

      // //check user
      // Check if the email already exists
      const { data } = await model.getSingleAgent({ email });

      if (data.length) {
        return {
          success: false,
          code: this.StatusCode.HTTP_BAD_REQUEST,
          message: 'Email already exists',
        };
      }

      // Handle file upload (avatar)
      const files = (req.files as Express.Multer.File[]) || [];
      if (files.length) {
        rest['avatar'] = files[0].filename;
      }

      rest['user_type'] = 'agent';

      // Hash the password
      const hashedPass = await Lib.hashPass(password);

      // Create the agent record
      const agentRes = await model.createAgent({
        password: hashedPass,
        email,
        phone,
        name,
        commission_rate,
        ...rest,
      });

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        message: 'Agent registered successfully', // Adjusted message
      };
    });
  }

  //login service
  public async loginService({ email, password }: ILogin) {
    const model = this.Model.agentModel();

    // Fetch the user by email
    const { data } = await model.getSingleAgent({ email });

    // If no user is found
    if (!data.length) {
      console.log('No User Found');
      return {
        success: false,
        code: this.StatusCode.HTTP_BAD_REQUEST,
        message: this.ResMsg.WRONG_CREDENTIALS,
      };
    }

    // Destructure password and the rest of the user details
    const { password: hashPass, ...rest } = data[0];

    // Compare the provided password with the hashed password
    const checkPass = await Lib.compare(password, hashPass);

    console.log('hello checkpass', checkPass, password, hashPass);

    // If the password matches, generate a token and return a success response
    if (checkPass) {
      const token = Lib.createToken(
        { ...rest, type: 'agent' }, // Include user details and user type
        config.JWT_SECRET_AGENT, // Use the agent-specific secret
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
    const { id } = req.agent;

    const model = this.Model.agentModel();

    // Fetch the user by email
    const { data } = await model.getSingleAgent({ id });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.LOGIN_SUCCESSFUL,
      data: data[0],
    };
  }

  // update agent profile
  public async updateAgentProfile(req: Request) {
    const { id } = req.agent;

    const model = this.Model.agentModel();
    const body = req.body;

    // Fetch the user by email
    const { data } = await model.getSingleAgent({ id });

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

    const res = await model.updateAgentProfile({ id }, body);

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
      message: 'Profile updated successfully',
    };
  }

  // forget password
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
}

export default AgentAuthService;
