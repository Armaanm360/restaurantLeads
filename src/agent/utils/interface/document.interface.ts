export interface IAgentDocuments {
  agent_id: number;
  business_name: string;
  nid_number: string;
  nid_card_file: string;
  tin_number: string;
  professional_license?: string;
  bank_statement_url?: string;
  proof_of_address_url?: string;
  company_profile_url?: string;
  reference_letters_url?: string;
  agreement_with_property_owners_url: string;
  training_certificates_url?: string;
  profile_picture_url: string;
}
