import Joi from "joi";

export default class AgentDocumentValidator {
  // create agent document
  public createAGentDocuments = Joi.object({
    business_name: Joi.string().optional(),
    nid_number: Joi.string().optional(),
    nid_card_file: Joi.any().optional(),
    tin_number: Joi.string().optional(),
    professional_license: Joi.string().optional(),
    bank_statement_url: Joi.any().optional(),
    proof_of_address_url: Joi.any().optional(),
    company_profile_url: Joi.any().optional(),
    reference_letters_url: Joi.any().optional(),
    agreement_with_property_owners_url: Joi.any().optional(),
    training_certificates_url: Joi.any().optional(),
    profile_picture_url: Joi.any().optional(),
  });
}
