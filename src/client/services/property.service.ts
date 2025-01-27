import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import Lib from '../../utils/lib/lib';
import { regardMessage } from '../../utils/templates/regardMessage';
import {
  LISTING_MESSAGE,
  OTP_EMAIL_SUBJECT,
  REGARD_MESSAGE,
} from '../../utils/miscellaneous/constants';
import { welcomeMessage } from '../../utils/templates/propertyListingMessage';

/**
 * Service class to handle client property operations.
 */
class ClientPropertyService extends AbstractServices {
  constructor() {
    super(); // Call the parent constructor to initialize base class properties and methods
  }

  /**
   * Retrieves a list of properties based on the specified query parameters.
   *
   * @param {Request} req - The Express request object containing query parameters.
   * @returns {Promise<Object>} - An object containing the response data, including success status, HTTP code, message, total properties count, and the properties data.
   */
  public async getProperties(req: Request) {
    // Extract query parameters from the request
    const {
      limit,
      skip,
      propertyType,
      propertyArea,
      minPrice,
      maxPrice,
      location,
      rooms,
      bathrooms,
      amenities,
      features,
      status,
      sortBy,
      sortOrder,
    } = req.query;

    // Type conversions and validations
    const queryParams = {
      limit: limit ? parseInt(limit as string, 10) : undefined, // Convert limit to integer
      skip: skip ? parseInt(skip as string, 10) : undefined, // Convert skip to integer
      propertyType: propertyType as string, // Property type as string
      propertyArea: propertyArea as string, // Property type as string
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined, // Convert minPrice to float
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined, // Convert maxPrice to float
      location: location as string, // Location as string
      rooms: this.parseArrayParam(rooms), // Parse rooms as an array of numbers
      bathrooms: this.parseArrayParam(bathrooms), // Parse bathrooms as an array of numbers
      amenities: this.parseArrayParam(amenities, false), // Parse amenities as an array of strings
      features: this.parseArrayParam(features, false), // Parse features as an array of strings
      status: status as string, // Status as string
      sortBy: sortBy as string, // Sort by field
      sortOrder: (sortOrder as 'asc' | 'desc') || 'asc', // Sort order, defaulting to 'asc'
    };

    // Validate the extracted query parameters
    this.validateQueryParams(queryParams);

    const model = this.Model.propertyModel(); // Get the property model
    const { data, total } = await model.getClientProperties(queryParams); // Fetch client properties

    // Return response object containing success status, HTTP code, message, total count, and data
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total,
      data,
    };
  }

  //add inquiry
  public async addInquiry(req: Request) {
    const model = this.Model.propertyModel(); // Get the property model

    // Destructure the required fields from req.body
    const { name, email, phone, message, property_id } = req.body;

    //send reply message from agent
    const id = Number(req.body.property_id);
    const propertyAgentInfo = await model.getSingleProperty({ id });

    const property = propertyAgentInfo[0];

    console.log('info', property);
    await Lib.sendEmail(
      email,
      REGARD_MESSAGE,
      regardMessage(
        name,
        propertyAgentInfo[0].property_title,
        propertyAgentInfo[0].agent_name
      )
    );

    await model.addInquiry(req.body);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: 'Your Inquiry Has Been Submitted Successfully',
    };
  }
  //listing property
  public async listingProperty(req: Request) {
    return this.db.transaction(async (trx) => {
      const model = this.Model.propertyModel(); // Get the property model

      // Destructure the required fields from req.body
      const {
        name,
        contact_number,
        email,
        purpose,
        property_type_id,
        location,
      } = req.body;

      await model.listingProperty(req.body);
      await Lib.sendEmail(
        email,
        LISTING_MESSAGE,
        welcomeMessage(name, req.body.location)
      );

      // await model.addInquiry(req.body);

      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: 'Your Property Listing  Has Been Submitted Successfully',
      };
    });
  }

  /**
   * Parses a comma-separated string or an array into an array of numbers or strings.
   *
   * @param {any} param - The parameter to parse (can be a string or array).
   * @param {boolean} [isNumber=true] - Flag indicating whether to parse as numbers (default is true).
   * @returns {any[] | undefined} - An array of parsed values or undefined if the input is falsy.
   */
  private parseArrayParam(
    param: any,
    isNumber: boolean = true
  ): any[] | undefined {
    if (!param) return undefined; // Return undefined if the parameter is not provided

    // Split the parameter into an array if it's not already one
    const values = Array.isArray(param) ? param : param.split(',');

    if (isNumber) {
      // Parse each value to an integer and filter out non-numeric or negative values
      return values
        .map((val: any) => parseInt(val.trim(), 10))
        .filter((num: any) => !isNaN(num) && num >= 0);
    }

    // Return an array of trimmed string values
    return values
      .map((val: any) => val.trim())
      .filter((val: any) => val.length > 0);
  }

  /**
   * Validates the query parameters for property retrieval.
   *
   * @param {any} params - The query parameters to validate.
   * @throws {Error} - Throws an error if any parameter is invalid.
   */
  private validateQueryParams(params: any) {
    // Validate limit and skip parameters
    if (params.limit && (isNaN(params.limit) || params.limit < 0)) {
      throw new Error('Invalid limit parameter');
    }
    if (params.skip && (isNaN(params.skip) || params.skip < 0)) {
      throw new Error('Invalid skip parameter');
    }

    // Validate price parameters
    if (params.minPrice && isNaN(params.minPrice)) {
      throw new Error('Invalid minPrice parameter');
    }
    if (params.maxPrice && isNaN(params.maxPrice)) {
      throw new Error('Invalid maxPrice parameter');
    }

    // Validate rooms and bathrooms parameters
    if (params.rooms && !Array.isArray(params.rooms)) {
      throw new Error('Invalid rooms parameter');
    }
    if (params.bathrooms && !Array.isArray(params.bathrooms)) {
      throw new Error('Invalid bathrooms parameter');
    }

    // Ensure minPrice is not greater than maxPrice
    if (
      params.minPrice &&
      params.maxPrice &&
      params.minPrice > params.maxPrice
    ) {
      throw new Error('minPrice cannot be greater than maxPrice');
    }

    // Validate sortOrder parameter
    if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
      throw new Error('Invalid sortOrder parameter');
    }
  }

  /**
   * Retrieves a single property based on the provided property ID.
   *
   * @param {Request} req - The Express request object containing the property ID as a parameter.
   * @returns {Promise<Object>} - An object containing the response data, including success status, HTTP code, message, and the property data.
   */
  public async getSingleProperty(req: Request) {
    const id = req.params.id; // Get the property ID from the request parameters
    const model = this.Model.propertyModel(); // Get the property model

    const data = await model.getSingleProperty({ id: Number(id) }); // Fetch the property data by ID

    // Get the IP address of the user
    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(ipAddress);

    // Log or save the view count with IP address
    await model.propertyViewCount(Number(id), ipAddress);

    // Return response object containing success status, HTTP code, message, and the property data
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data: data[0], // Return the first item from the fetched data
    };
  }

  //get property types

  public async getAllPropertyTypes(req: Request) {
    const model = this.Model.propertyModel();
    const { data, total } = await model.getAllPropertyTypes({ ...req.query });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }
}

export default ClientPropertyService; // Export the ClientPropertyService for use in other modules
