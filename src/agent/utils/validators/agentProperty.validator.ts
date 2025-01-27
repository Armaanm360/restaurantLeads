import Joi from "joi";

class AgentPropertyValidator {
  // create property validator
  public createPropertyValidator = Joi.object({
    name: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    address: Joi.string().required(),
    property_type: Joi.number().integer().required(),
    property_area: Joi.number().positive().required(),
    num_rooms: Joi.number().integer().positive().optional(),
    num_bathrooms: Joi.number().integer().positive().optional(),
    floor_number: Joi.number().integer().optional(),
    latitude: Joi.number().precision(8).required(),
    longitude: Joi.number().precision(8).required(),
    price: Joi.number().positive().required(),
    property_status: Joi.number().integer().required(),
    amenities: Joi.any(),
    features: Joi.any(),
  });

  // update property validator
  public updatePropertyValidator = Joi.object({
    name: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    address: Joi.string().optional(),
    property_type: Joi.number().integer().optional(),
    property_area: Joi.number().positive().optional(),
    num_rooms: Joi.number().integer().positive().optional(),
    num_bathrooms: Joi.number().integer().positive().optional(),
    floor_number: Joi.number().integer().optional(),
    latitude: Joi.number().precision(8).optional(),
    longitude: Joi.number().precision(8).optional(),
    price: Joi.number().positive().optional(),
    property_status: Joi.number().integer().optional(),
    amenities: Joi.any().optional(),
    features: Joi.any().optional(),
    delete_images: Joi.any().optional(),
    delete_documents: Joi.any().optional(),
  });
}

export default AgentPropertyValidator;
