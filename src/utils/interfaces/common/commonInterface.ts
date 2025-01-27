export interface IcommonCustomerInsert {
  first_name: string;
  last_name: string;
  email: string;
}
export interface OTPType {
  type:
    | "forget_upc_user"
    | "forget_admin"
    | "verify_employee"
    | "forget_employee"
    | "forget_service_center";
}
export interface IInsertOTPPayload extends OTPType {
  hashed_otp: string;
  email: string;
}

export interface IGetOTPPayload extends OTPType {
  email: string;
}

export interface IInsertAuditTrailPayload {
  adminId: number;
  details: string;
  status: boolean;
}

export interface IcommonInsertRes {
  command: string;
  rowCount: number;
  oid: number;
  rows: any[];
}
