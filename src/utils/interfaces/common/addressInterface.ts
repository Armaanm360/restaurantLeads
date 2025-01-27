export interface ICreateDivisionPayload {
  name: string;
}
export interface ICreateDistrictPayload {
  divisionId: number;
  name: string;
}
export interface ICreateThanaPayload {
  districtId: number;
  name: string;
}
export interface ICreateAreaPayload {
  thanaId: number;
  name: string;
}

export interface ICreateLeave {
  employee_id: number;
  leave_type: number;
  status: string;
  start_date: any;
  end_date: any;
  number_of_working_days: any;
  comments: string;
  half_day: any;
}
export interface IUpdateLeave {
  employee_id: number;
  leave_type: number;
  status: string;
  start_date: any;
  end_date: any;
  number_of_working_days: any;
  comments: string;
  half_day: any;
  revoked: any;
  revoke_reason: any;
}
export interface IUpdateLeave {
  leave_status: string;
  leave_rejected_reason: string;
}

export interface IGetDistrictParams {
  divisionId?: number;
}
export interface IGetThanaParams extends IGetDistrictParams {
  districtId?: number;
}
export interface IGetAreaParams extends IGetThanaParams {
  thanaId?: number;
}
