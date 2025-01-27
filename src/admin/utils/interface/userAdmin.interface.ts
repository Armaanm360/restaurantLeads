export interface ICreateUserAdminPayload {
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  role: number;
  password: string;
}

export interface IUpdateAdminUserPayload {
  name?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: number;
  password?: string;
}

export interface IcreateRolePermission {
  role_id: Number;
  h_permission_id: Number;
  permission_type: String;
  created_by?: Number;
}

export interface IUpdateAgentVerification {
  nid_verified?: boolean;
  tin_verified?: boolean;
  professional_license_verified?: boolean;
  proof_of_address_verified?: boolean;
  company_profile_verified?: boolean;
  reference_letters_verified?: boolean;
  agreement_verified?: boolean;
  training_certificates_verified?: boolean;
  profile_picture_verified?: boolean;
  nid_card_file_verified?: boolean;
}
export interface IAddVerificationTrack {
  admin_id: Number;
  agent_id: Number;
  verification_field: string;
  verification_status?: any;
}
export interface VerifyProperty {
  verification: boolean; // true if verified, false if rejected
  verified_by: number; // ID of the admin verifying the property
  rejection_reason?: string | null; // Reason for rejection, required if verification is false
}
