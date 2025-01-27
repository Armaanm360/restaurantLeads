import { NextFunction, Request, Response } from 'express';
import config from '../../../config/config';
import Lib from '../../../utils/lib/lib';
import ResMsg from '../../../utils/miscellaneous/responseMessage';
import StatusCode from '../../../utils/miscellaneous/statusCode';
import { IAdmin, IAgent } from '../../types/commonTypes';
class AuthChecker {
  // admin auth checker
  // public adminAuthChecker = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { authorization } = req.headers;

  //   if (!authorization) {
  //     return res
  //       .status(StatusCode.HTTP_UNAUTHORIZED)
  //       .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
  //   }

  //   const authSplit = authorization.split(' ');

  //   if (authSplit.length !== 2) {
  //     return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
  //       success: false,
  //       message: ResMsg.HTTP_UNAUTHORIZED,
  //     });
  //   }

  //   const verify = Lib.verifyToken(
  //     authSplit[1],
  //     config.JWT_SECRET_ADMIN
  //   ) as IAdmin;

  //   if (!verify) {
  //     return res
  //       .status(StatusCode.HTTP_UNAUTHORIZED)
  //       .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
  //   } else {
  //     if (verify.type !== 'admin' || verify.status === 0) {
  //       return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
  //         success: false,
  //         message: ResMsg.HTTP_UNAUTHORIZED,
  //       });
  //     } else {
  //       req.admin = verify as IAdmin;
  //       next();
  //     }
  //   }
  // };
  // client auth checker
  public clientAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(' ');
    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_EMPLOYEE
    ) as IAgent;

    // if (verify.status === 'blacklisted' || verify.status === 'disabled') {
    //   return res
    //     .status(StatusCode.HTTP_UNAUTHORIZED)
    //     .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    // }

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      req.employee = verify;
      next();
    }
  };
  // agent auth checker
  public agentAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(' ');
    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_AGENT
    ) as IAgent;

    // if (verify.status === 'blacklisted' || verify.status === 'disabled') {
    //   return res
    //     .status(StatusCode.HTTP_UNAUTHORIZED)
    //     .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    // }

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      req.agent = verify;
      next();
    }
  };
  // admin auth checker
  public adminAuthChecker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { authorization } = req.headers;

    if (!authorization) {
      console.log('unauthorized properly');
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    }

    const authSplit = authorization.split(' ');
    if (authSplit.length !== 2) {
      return res.status(StatusCode.HTTP_UNAUTHORIZED).json({
        success: false,
        message: ResMsg.HTTP_UNAUTHORIZED,
      });
    }
    // console.log('Hello auth', authSplit[1]);

    // console.log('JWT', config.JWT_SECRET_ADMIN);

    const verify = Lib.verifyToken(
      authSplit[1],
      config.JWT_SECRET_ADMIN
    ) as IAdmin;

    // if (verify.status === 'blacklisted' || verify.status === 'disabled') {
    //   return res
    //     .status(StatusCode.HTTP_UNAUTHORIZED)
    //     .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    // }

    if (!verify) {
      return res
        .status(StatusCode.HTTP_UNAUTHORIZED)
        .json({ success: false, message: ResMsg.HTTP_UNAUTHORIZED });
    } else {
      req.admin = verify;
      next();
    }
  };
}

export default AuthChecker;
