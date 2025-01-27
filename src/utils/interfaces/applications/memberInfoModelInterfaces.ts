export interface IUpdateApplicationCompanyDetailsPayload {
  membershipType?: "General" | "Associate";
  companyName?: string;
  logo?: string;
  address?: string;
  areaCode?: string;
  postCode?: string;
  companyType?: "Proprietorship" | "Partnership" | "Limited Company";
  deedFile?: string;
  RJSCertificate?: string;
  maleStuff?: number;
  femaleStuff?: number;
}

export interface ICreateApplicationCompanyDetailsPayload
  extends IUpdateApplicationCompanyDetailsPayload {
  applicationId: number;
}

export interface IUpdateApplicationApplicantDetailsPayload {
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
  representativeMobileNumber?: string;
  representativeBloodGroup?: string;
  sameAsApplicant?: boolean;
}

export interface ICreateApplicationApplicantDetailsPayload
  extends IUpdateApplicationApplicantDetailsPayload {
  applicationId: number;
}

export interface IUpdateContactDetailsPayload {
  landPhone?: string;
  faxNumber?: string;
  mobileNumber?: string;
  email?: string;
  additionalEmail?: string;
  additionalMobileNumber?: string;
  website?: string;
}

export interface ICreateContactDetailsPayload
  extends IUpdateContactDetailsPayload {
  applicationId: number;
}

export interface ICreateContactSocialMedia {
  appCompanyContactId: number;
  name: string;
  link: string;
}

export interface ICreateBusinessOperations {
  applicationId: number;
  type: number;
  name: string;
}

export interface IGetBusinessOperations {
  id: number;
  applicationId: number;
  name: string;
  typeName: string;
  typeId: number;
  createdAt: string;
}

export interface ICreateOperationalExperience {
  applicationId: number;
  year: string;
  domestic: number;
  inbound: number;
  outbound: number;
  totalGroups: number;
}

export interface IGetOperationalExperience
  extends ICreateOperationalExperience {
  id: number;
  createdAt: string;
}

export interface IUpdateOperationalExperiencePayload {
  year?: string;
  domestic?: number;
  inbound?: number;
  outbound?: number;
  totalGroups?: number;
}

export interface ICreatePropertyPayload {
  applicationId: number;
  name: string;
}

export interface IGetProperty extends ICreatePropertyPayload {
  id: number;
  createdAt: string;
}

export interface ICreatePromotionalMaterials {
  applicationId: number;
  file: string;
}

export interface IGetPromotionalMaterials extends ICreatePromotionalMaterials {
  id: number;
  createdAt: string;
}

export interface ICreateAssociationAffiliations {
  applicationId: number;
  associationName: string;
  file: string;
}

export interface IGetAssociationAffiliations
  extends ICreateAssociationAffiliations {
  id: number;
  createdAt: string;
}

export interface IUpdateLicensePayload {
  tradeLicenseFile?: string;
  tinCertificateFile?: string;
  companyTinCertificateFile?: string;
}

export interface ICreateLicensePayload extends IUpdateLicensePayload {
  applicationId: number;
}

export interface IGetLicense extends ICreateLicensePayload {
  id: number;
  createdAt: string;
}

export interface IUpdateRecommendedByPayload {
  recommendCompanyId?: number;
  status?: string;
}

export interface ICreateRecommendedByPayload
  extends IUpdateRecommendedByPayload {
  applicationId: number;
}

export interface IGetRecommendedBy extends ICreateRecommendedByPayload {
  id: number;
  createdAt: string;
  status: string;
}

export interface IUpdateOtherApplicationInfo {
  about?: string;
  ipAddress?: string;
  applyDate?: string;
}

export interface ICreateOtherApplicationInfo
  extends IUpdateOtherApplicationInfo {
  applicationId: number;
}

interface IRecommendedBy {
  companyId: number;
  companyName: string;
  status: string;
  createDate: string;
}

export interface IGetFullEnclosedPart {
  applicationId: number;
  tradeLicenseFile: string | null;
  tinCertificateFile: string | null;
  recommendedBy: IRecommendedBy[] | null;
  about: string | null;
  ipAddress: string | null;
  applyDate: string | null;
}

interface IProperty {
  id: number;
  name: string;
}

interface IPromotionalMaterials {
  id: number;
  file: string;
}

interface IAssociationAffiliation {
  id: number;
  associationName: string;
  certificateFile: string;
}

export interface IGetPropertyPromotionsAssociation {
  applicationId: number;
  property: IProperty[] | null;
  promotionalMaterials: IPromotionalMaterials[] | null;
  associationAffiliations: IAssociationAffiliation[] | null;
}
