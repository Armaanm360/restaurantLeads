export interface ICreateUserAdminPayload {
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  role?: number;
  password: string;
}
export interface IInserAuditTrail {
  module_name: string;
  action_type?: string;
  organization_id: number;
  user_id?: number;
  description?: string;
}
export interface ICreateJamatPrayer {
  fajr_prayer?: any;
  fajr_start?: any;
  fajr_end?: any;

  dhuhr_prayer?: any;
  dhuhr_start?: any;
  dhuhr_end?: any;

  asr_prayer?: any;
  asr_start?: any;
  asr_end?: any;

  maghrib_prayer?: any;
  maghrib_start?: any;
  maghrib_end?: any;

  isha_prayer?: any;
  isha_start?: any;
  isha_end?: any;

  sunset?: any;
  sunrise?: any;
}

export interface ICreateOrganization {
  name: string;
  website?: string;
  email?: string;
  logo?: string;
  phone: string;
  leave_allowance?: string;
  country_id?: number;
  city_id?: number;
  address: string;
  postal_code: string;
  sale_date?: string;
  expiry_date?: string;
  sale_by?: number;
  sale_amount?: any;
  sale_type?: string;
}

export interface ICreateManagementEmployee {
  name: string;
  phone: string;
  email: string;
  designation: string;
}
export interface ICreateROle {
  name: string;
  organization_id: number;
}

export interface IUpdateAdminPayload {
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: number;
  password?: string;
  socket_id?: any;
}

export interface IInsertMeetingPayload {
  title: string;
  lead_id: number;
  description?: string;
  place: number;
  image?: string;
  file?: string;
  start_time: string;
  end_time: string;
  status: string;
  estimated_amount: any;
  organization_id: number;
}

export interface IInsertLeadTrackMeeting {
  organization_id: number;
  meeting_id?: number;
  lead_id: number;
  action_type: string;
  admin_id?: number;
  description?: string;
}
export interface IInsertMeetingPlaces {
  place_name: string;
  organization_id?: number;
}

export interface IInsertPerson {
  meeting_id: number;
  person_id: number;
}
