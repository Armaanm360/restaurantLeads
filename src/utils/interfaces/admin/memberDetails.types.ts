export interface ICreateBusinessOperations {
  companyId: number;
  type: number;
  name: string;
}

export interface ICreatePropertyPayload {
  companyId: number;
  name: string;
}

export interface ICreateCompanyPropertyPayload {
  companyId: any;
  name: string;
}
export interface ICreateCompanyPromotionalMaterials {
  companyId: any;
  file: string;
}

export interface ICreateAssociationAffiliations {
  companyId: any;
  associationName: string;
  file: string;
}

export interface IUpdateRecommendedByPayload {
  recommendCompanyId?: number;
  status?: string;
}

export interface ICreateRecommendedByPayload
  extends IUpdateRecommendedByPayload {
  companyId: any;
}
