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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class AdminAgentService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get single Property
    getSingleProperty(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: agent_id } = req.agent;
            const id = req.params.id;
            const model = this.Model.propertyModel();
            const data = yield model.getSingleProperty({ id: Number(id), agent_id });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data[0],
            };
        });
    }
    // get all my properties
    getMyProperties(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract query parameters from the request
            const { limit, skip, propertyType, minPrice, maxPrice, location, rooms, bathrooms, amenities, features, status, sortBy, sortOrder, } = req.query;
            // Type conversions and validations
            const queryParams = {
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
                propertyType: propertyType,
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
            const { id } = req.agent;
            // Validate the extracted query parameters
            this.validateQueryParams(queryParams);
            const model = this.Model.propertyModel(); // Get the property model
            const { data, total } = yield model.getClientProperties(Object.assign(Object.assign({}, queryParams), { agent_id: id }));
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
    // get all agents
    getAllAgents(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentModel();
            const { data, total } = yield model.getAllAgents(Object.assign({}, req.query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get all agents
    getSingleAgent(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentModel();
            const id = Number(req.params.agent_id);
            const { docs, data } = yield model.getSingleAgent({ id });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: data[0],
                docs: docs[0],
            };
        });
    }
    //update single agent verification
    updateSingleAgentVerification(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.agent_id;
                const model = this.Model.agentModel(trx);
                const checkAgent = yield model.getSingleProfileAgent(Number(id));
                if (!checkAgent.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'The Agent Has Not Submitted Any Document Yet',
                    };
                }
                // Extract the first key and value from req.body
                const [verification_field] = Object.keys(req.body);
                const [verification_status] = Object.values(req.body);
                yield model.addVerificationTrack({
                    admin_id: req.admin.id,
                    agent_id: Number(id),
                    verification_field: verification_field,
                    verification_status: verification_status, // First value from req.body
                });
                yield model.updateSingleAgentVerification(Number(id), req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
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
    ///create new property
    createTourPackage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.agent;
                const _a = req.body, { amenities, features, image, property_images, file } = _a, rest = __rest(_a, ["amenities", "features", "image", "property_images", "file"]);
                const model = this.Model.propertyModel(trx);
                // Handle file uploads
                const files = req.files || [];
                console.log('Uploaded files:', files); // Debug log
                // Create the tour package
                const property = yield model.createProperty(Object.assign(Object.assign({}, rest), { agent_id: id }));
                //get property id from here
                const propertyId = property[0].id;
                // const itineraryPhotos: string[] = [];
                // const packagePhotos: string[] = [];
                // console.log('Itinerary photos:', itineraryPhotos); // Debug log
                // console.log('Package photos:', packagePhotos); // Debug log
                //property amenities
                const parsedAmenities = JSON.parse(amenities); // Assuming 'amenities' is a JSON string like '[1,2,3]'
                // Iterate over each amenity ID in the parsedAmenities array
                for (const amenityId of parsedAmenities) {
                    // Use await to insert each amenityId along with the propertyId into the database
                    yield this.Model.propertyModel(trx).addAmenities({
                        amenity_id: amenityId,
                        property_id: propertyId, // Assuming propertyId is already available
                    });
                }
                //property features
                const parsedFeatures = JSON.parse(features);
                for (const featureId of parsedFeatures) {
                    // Use await to insert each amenityId along with the propertyId into the database
                    yield this.Model.propertyModel(trx).addFeatures({
                        feature_id: featureId,
                        property_id: propertyId, // Assuming propertyId is already available
                    });
                }
                // Find all image files in the form-data (based on their fieldname like 'image_1', 'image_2', etc.)
                const imageFiles = files.filter((file) => file.fieldname.startsWith('image_'));
                // Get the highest number from the fieldnames
                const numberOfImages = imageFiles.reduce((max, file) => {
                    const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
                    return fieldNumber > max ? fieldNumber : max;
                }, 0);
                // Loop through based on the dynamically determined number of images
                for (let i = 0; i < numberOfImages; i++) {
                    const photoFile = files.find((file) => file.fieldname === `image_${i + 1}`);
                    if (photoFile) {
                        // Process the image (e.g., save to the database)
                        yield this.Model.propertyModel(trx).addImages({
                            property_id: propertyId,
                            image: photoFile.filename,
                        });
                    }
                    else {
                        console.log(`Warning: No file found for image_${i + 1}`);
                    }
                }
                // Get the highest number from the fieldnames
                const numberOfFiles = imageFiles.reduce((max, file) => {
                    const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
                    return fieldNumber > max ? fieldNumber : max;
                }, 0);
                // Loop through based on the dynamically determined number of images
                for (let i = 0; i < numberOfFiles; i++) {
                    const photoFile = files.find((file) => file.fieldname === `file_${i + 1}`);
                    if (photoFile) {
                        // Process the image (e.g., save to the database)
                        yield this.Model.propertyModel(trx).addDocuments({
                            property_id: propertyId,
                            file: photoFile.filename,
                        });
                    }
                    else {
                        console.log(`Warning: No file found for image_${i + 1}`);
                    }
                }
                // //property documents
                // const parsedPropertyDocuments = Array.isArray(file)
                //   ? file
                //   : JSON.parse(file);
                // for (let i = 0; i < parsedPropertyDocuments.length; i++) {
                //   const item = parsedPropertyImages[i];
                //   const photoFile = files.find(
                //     (file) => file.fieldname === `file_${i + 1}`
                //   );
                //   if (photoFile) {
                //     await this.Model.propertyModel(trx).addImages({
                //       ...item,
                //       property_id: propertyId,
                //       photo: photoFile.filename, // Assuming Multer saves the file and provides the filename
                //     });
                //   } else {
                //     console.log(`Warning: No file found for image_${i + 1}`);
                //   }
                // }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // update properties
    updateProperties(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.agent;
                const { id: propertyId } = req.params;
                const _a = req.body, { amenities, features, delete_images, delete_documents } = _a, rest = __rest(_a, ["amenities", "features", "delete_images", "delete_documents"]);
                const model = this.Model.propertyModel(trx);
                const files = req.files || [];
                const imageFilesToDelete = [];
                const documentFilesToDelete = [];
                console.log({ body: req.body });
                console.log('22222', JSON.stringify(rest, null, 2));
                // Partial update for property details
                if (Object.keys(rest).length > 0) {
                    yield model.updateProperty(Number(propertyId), Object.assign(Object.assign({}, rest), { agent_id: id }));
                }
                // Handle partial updates for amenities
                if (amenities) {
                    const parsedAmenities = JSON.parse(amenities); // Array of amenity IDs
                    const currentAmenities = yield model.getEminities(Number(propertyId)); // Array of amenity objects
                    // Extract IDs from current amenities
                    const currentAmenityIds = currentAmenities.map((a) => a.id);
                    // Identify amenities to add (those in parsedAmenities but not in currentAmenityIds)
                    const amenitiesToAdd = parsedAmenities.filter((amenityId) => !currentAmenityIds.includes(amenityId));
                    // Identify amenities to remove (those in currentAmenityIds but not in parsedAmenities)
                    const amenitiesToRemove = currentAmenityIds.filter((amenityId) => !parsedAmenities.includes(amenityId));
                    // Batch insert new amenities (if any)
                    if (amenitiesToAdd.length) {
                        const amenitiesData = amenitiesToAdd.map((amenityId) => ({
                            amenity_id: amenityId,
                            property_id: propertyId,
                        }));
                        yield model.addAmenities(amenitiesData); // Adjust your addAmenities method to handle batch inserts
                    }
                    // Batch delete old amenities (if any)
                    if (amenitiesToRemove.length) {
                        yield model.deleteAmenities({
                            ids: amenitiesToRemove,
                            property_id: Number(propertyId),
                        });
                    }
                }
                // Handle partial updates for features
                if (features) {
                    const parsedFeatures = JSON.parse(features); // Parsed array of new features
                    const currentFeatures = yield model.getFeatures(Number(propertyId)); // Array of current feature objects
                    // Extract IDs from current features
                    const currentFeatureIds = currentFeatures.map((f) => f.id);
                    // Features to add (those in parsedFeatures but not in currentFeatureIds)
                    const featuresToAdd = parsedFeatures.filter((f) => !currentFeatureIds.includes(f.id));
                    // Features to remove (those in currentFeatureIds but not in parsedFeatures)
                    const featuresToRemove = currentFeatures
                        .filter((f) => !parsedFeatures.some((pf) => pf.id === f.id))
                        .map((f) => f.id); // Extract the ids of features to remove
                    // Batch insert new features
                    if (featuresToAdd.length) {
                        const featuresData = featuresToAdd.map((f) => ({
                            feature_id: f.id,
                            property_id: propertyId,
                        }));
                        yield model.addFeatures(featuresData); // Batch insert features
                    }
                    // Batch delete unused features
                    if (featuresToRemove.length) {
                        yield model.deleteFeatures({
                            ids: featuresToRemove,
                            property_id: Number(propertyId),
                        });
                    }
                }
                // Delete images if specified
                if (delete_images && Array.isArray(delete_images)) {
                    const currentImages = yield model.getImages(Number(propertyId));
                    imageFilesToDelete.push(...currentImages
                        .filter((img) => delete_images.includes(img.id))
                        .map((img) => img.image));
                    yield model.deleteImages({
                        ids: delete_images,
                        property_id: Number(propertyId),
                    });
                }
                // Delete documents if specified
                if (delete_documents && Array.isArray(delete_documents)) {
                    const currentDocuments = yield model.getDocuments(Number(propertyId));
                    documentFilesToDelete.push(...currentDocuments
                        .filter((doc) => delete_documents.includes(doc.id))
                        .map((doc) => doc.file));
                    yield model.deleteDocuments({
                        ids: delete_documents,
                        property_id: Number(propertyId),
                    });
                }
                const imageFiles = files.filter((file) => file.fieldname.startsWith('image_'));
                // Get the highest number from the fieldnames
                const numberOfImages = imageFiles.reduce((max, file) => {
                    const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
                    return fieldNumber > max ? fieldNumber : max;
                }, 0);
                // Loop through based on the dynamically determined number of images
                for (let i = 0; i < numberOfImages; i++) {
                    const photoFile = files.find((file) => file.fieldname === `image_${i + 1}`);
                    if (photoFile) {
                        // Process the image (e.g., save to the database)
                        yield this.Model.propertyModel(trx).addImages({
                            property_id: propertyId,
                            image: photoFile.filename,
                        });
                    }
                    else {
                        console.log(`Warning: No file found for image_${i + 1}`);
                    }
                }
                // Get the highest number from the fieldnames
                const numberOfFiles = imageFiles.reduce((max, file) => {
                    const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
                    return fieldNumber > max ? fieldNumber : max;
                }, 0);
                // Loop through based on the dynamically determined number of images
                for (let i = 0; i < numberOfFiles; i++) {
                    const photoFile = files.find((file) => file.fieldname === `file_${i + 1}`);
                    if (photoFile) {
                        // Process the image (e.g., save to the database)
                        yield this.Model.propertyModel(trx).addDocuments({
                            property_id: propertyId,
                            file: photoFile.filename,
                        });
                    }
                    else {
                        console.log(`Warning: No file found for image_${i + 1}`);
                    }
                }
                this.manageFile.deleteFromCloud([
                    ...imageFilesToDelete,
                    ...documentFilesToDelete,
                ]);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // get all property types
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
    // get all property status
    getAllPropertyStatus(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel();
            const { data, total } = yield model.getAllPropertyStatus(Object.assign({}, req.query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get get All Amenity
    getAllAmenity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel();
            const { data, total } = yield model.getAllAmenity(Object.assign({}, req.query));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get all features
    getAllFeatures(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.propertyModel();
            const { data, total } = yield model.getAllFeature(Object.assign({}, req.query));
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
exports.default = AdminAgentService;
