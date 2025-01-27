import {} from '';
import {
  IAdmin,
  IAgent,
  IEmployee,
  IManagement,
  IMember,
  IServiceCenter,
  IUpc,
} from './src/common/types/commonTypes';

declare global {
  namespace Express {
    interface Request {
      admin: IAdmin;
      employee: IAgent;
      agent: IEmployee;
      upc_user: IUpc;
      service_center: IServiceCenter;
      management: IManagement;
      upFiles: string[];
    }
  }
}
