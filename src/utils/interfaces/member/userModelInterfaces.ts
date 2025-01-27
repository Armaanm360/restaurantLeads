export interface ICreateUserMemberPayload {
  name: string;
  username: string;
  designation: string;
  level: number;
  email: string;
  password: string;
  phone: string;
  status: string;
  association_id: number;
}
export interface ICreateEmployeeSocket {
  socket_id: string;
}
export interface ICommonSource {
  id?: number;
  name?: string;
  limit?: string;
  skip?: string;
  key?: string;
}
export interface IUpdateUserMemberPayload {
  name?: string;
  email?: string;
  emailVerification?: boolean;
  password?: string;
  mobileNumber?: string;
  mobileNumberVerification?: boolean;
  status?: string;
}

export interface IUpdatePassword {
  old_password?: string;
  new_password?: string;
}

export interface IUpdateProfile {
  name?: string;
  phone?: string;
  profile_picture?: string;
  designation?: string;
}

export interface IGetUserMember extends ICreateUserMemberPayload {
  user_id: number;
  team_id: number;
}
