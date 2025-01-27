"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const regardMessage_1 = require("../../utils/templates/regardMessage");
const constants_1 = require("../../utils/miscellaneous/constants");
const propertyListingMessage_1 = require("../../utils/templates/propertyListingMessage");
/**
 * Service class to handle client property operations.
 */
class ClientPropertyService extends abstract_service_1.default {
    constructor() {
        super(); // Call the parent constructor to initialize base class properties and methods
    }
    /**
     * Retrieves a list of properties based on the specified query parameters.
     *
     * @param {Request} req - The Express request object containing query parameters.
     * @returns {Promise<Object>} - An object containing the response data, including success status, HTTP code, message, total properties count, and the properties data.
     */
    getProperties(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract query parameters from the request
            const { limit, skip, propertyType, propertyArea, minPrice, maxPrice, location, rooms, bathrooms, amenities, features, status, sortBy, sortOrder, } = req.query;
            // Type conversions and validations
            const queryParams = {
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
                propertyType: propertyType,
                propertyArea: propertyArea,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                location: location,
                rooms: this.parseArrayParam(rooms),
                bathrooms: this.parseArrayParam(bathrooms),
                amenities: this.parseArrayParam(amenities, false),
                features: this.parseArrayParam(features, false),
                status: status,
                sortBy: sortBy,
                sortOrder: sortOrder || 'asc', // Sort order, defaulting to 'asc'
            };
            // Validate the extracted query parameters
            this.validateQueryParams(queryParams);
            const model = this.Model.propertyModel(); // Get the property model
            const { data, total } = yield model.getClientProperties(queryParams); // Fetch client properties
            // Return response object containing success status, HTTP code, message, total count, and data
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //add inquiry
    addInquiry(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel(); // Get the property model
            // Destructure the required fields from req.body
            const { name, email, phone, message, property_id } = req.body;
            //send reply message from agent
            const id = Number(req.body.property_id);
            const propertyAgentInfo = yield model.getSingleProperty({ id });
            const property = propertyAgentInfo[0];
            console.log('info', property);
            yield lib_1.default.sendEmail(email, constants_1.REGARD_MESSAGE, (0, regardMessage_1.regardMessage)(name, propertyAgentInfo[0].property_title, propertyAgentInfo[0].agent_name));
            yield model.addInquiry(req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'Your Inquiry Has Been Submitted Successfully',
            };
        });
    }
    //listing property
    listingProperty(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.propertyModel(); // Get the property model
                // Destructure the required fields from req.body
                const { name, contact_number, email, purpose, property_type_id, location, } = req.body;
                yield model.listingProperty(req.body);
                yield lib_1.default.sendEmail(email, constants_1.LISTING_MESSAGE, (0, propertyListingMessage_1.welcomeMessage)(name, req.body.location));
                // await model.addInquiry(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Your Property Listing  Has Been Submitted Successfully',
                };
            }));
        });
    }
    /**
     * Parses a comma-separated string or an array into an array of numbers or strings.
     *
     * @param {any} param - The parameter to parse (can be a string or array).
     * @param {boolean} [isNumber=true] - Flag indicating whether to parse as numbers (default is true).
     * @returns {any[] | undefined} - An array of parsed values or undefined if the input is falsy.
     */
    parseArrayParam(param, isNumber = true) {
        if (!param)
            return undefined; // Return undefined if the parameter is not provided
        // Split the parameter into an array if it's not already one
        const values = Array.isArray(param) ? param : param.split(',');
        if (isNumber) {
            // Parse each value to an integer and filter out non-numeric or negative values
            return values
                .map((val) => parseInt(val.trim(), 10))
                .filter((num) => !isNaN(num) && num >= 0);
        }
        // Return an array of trimmed string values
        return values
            .map((val) => val.trim())
            .filter((val) => val.length > 0);
    }
    /**
     * Validates the query parameters for property retrieval.
     *
     * @param {any} params - The query parameters to validate.
     * @throws {Error} - Throws an error if any parameter is invalid.
     */
    validateQueryParams(params) {
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
        if (params.minPrice &&
            params.maxPrice &&
            params.minPrice > params.maxPrice) {
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
    getSingleProperty(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id; // Get the property ID from the request parameters
            const model = this.Model.propertyModel(); // Get the property model
            const data = yield model.getSingleProperty({ id: Number(id) }); // Fetch the property data by ID
            // Get the IP address of the user
            const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            console.log(ipAddress);
            // Log or save the view count with IP address
            yield model.propertyViewCount(Number(id), ipAddress);
            // Return response object containing success status, HTTP code, message, and the property data
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data[0], // Return the first item from the fetched data
            };
        });
    }
    //get property types
    getAllPropertyTypes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel();
            const { data, total } = yield model.getAllPropertyTypes(Object.assign({}, req.query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
}
exports.default = ClientPropertyService; // Export the ClientPropertyService for use in other modules
