export interface IInsertCompanyPayload {
  applicationId: number;
  userMemberId: number;
  memberId?: string;
  membershipExpiryDate?: string;
}

export interface IUpdateCompanyDetailsPayload {
  membershipType?: 'General' | 'Associate';
  companyName?: string;
  logo?: string;
  compressedLogo?: string;
  address?: string;
  areaId?: number;
  postCode?: string;
  companyType?: 'Proprietorship' | 'Partnership' | 'Limited Company';
  deedFile?: string;
  RJSCertificate?: string;
  RJScheduletinpage?: string;
  BoardMeetingReservation?: string;
  maleStaff?: number;
  femaleStaff?: number;
  about?: string;
}

export interface ICreateCompanyDetailsPayload
  extends IUpdateCompanyDetailsPayload {
  companyId: number;
}

export interface IUpdateCompanyLicensePayload {
  tradeLicenseFile?: string;
  tinCertificateFile?: string;
  companyTinCertificateFile?: string;
}

export interface ICreateCompanyLicensePayload
  extends IUpdateCompanyLicensePayload {
  companyId: number;
}

export interface IUpdateCompanyApplicantDetailsPayload {
  name?: string;
  photo?: string;
  designation?: string;
  dateOfBirth?: string;
  dateOfMarriageAnniversary?: string;
  bloodGroup?: string;
  representativeName?: string;
  representativePhoto?: string;
  representativeDateOfMarriageAnniversary?: string;
  representativeDesignation?: string;
  representativeDateOfBirth?: string;
  representativeBloodGroup?: string;
}

export interface ICreateCompanyApplicantDetailsPayload
  extends IUpdateCompanyApplicantDetailsPayload {
  companyId: number;
}

export interface IUpdateCompanyContactDetailsPayload {
  landPhone?: string | null;
  faxNumber?: string | null;
  mobileNumber?: string;
  email?: string;
  additionalEmail?: string | null;
  additionalMobileNumber?: string | null;
  additionalMobileNumber2?: string | null;
  website?: string | null;
}

export interface ICreateCompanyContactDetailsPayload
  extends IUpdateCompanyContactDetailsPayload {
  companyId: number;
}

export interface ICreateCompanyContactSocialMedia {
  companyContactId: number;
  name: string;
  link: string;
}

export interface ICreateCompanyBusinessOperations {
  companyId: any;
  type: number;
  name: string;
}

export interface ICreateCompanyOperationalExperience {
  companyId: number;
  year: string;
  domestic: number;
  inbound: number;
  outbound: number;
  totalGroups: number;
}

export interface ICreateCompanyPropertyPayload {
  companyId: number;
  name: string;
}

export interface ICreateCompanyPromotionalMaterials {
  companyId: number;
  file: string;
}

export interface ICreateCompanyAssociationAffiliations {
  companyId: number;
  associationName: string;
  file: string;
}

export interface IUpdateCompanyRecommendedByPayload {
  recommendCompanyId?: number;
  status?: string;
}

export interface ICreateCompanyRecommendedByPayload
  extends IUpdateCompanyRecommendedByPayload {
  companyId: any;
}
