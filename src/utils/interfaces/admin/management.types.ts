export interface ICreateUserAdminPayload {
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  role?: number;
  password: string;
}

export interface ICreateOrganization {
  name: string;
  website?: string;
  phone: string;
  country_id?: number;
  city_id?: number;
  address: string;
  postal_code: string;
  logo: string;
  email: string;
  leave_allowance: number;
}
export interface ICreateRolePermission {
  role_id: number;
  permission_id: number;
  restaurant_id: number;
}
