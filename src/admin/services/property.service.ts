import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { json } from 'stream/consumers';
import { body } from 'express-validator';
class AdminPropertyService extends AbstractServices {
  constructor() {
    super();
  }

  // get single Property
  public async getSingleProperty(req: Request) {
    // const { id: agent_id } = req.agent;
    const id = req.params.id;

    const model = this.Model.propertyModel();
    const data = await model.getSingleProperty({ id: Number(id) });

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
  }

  // get all my properties
  public async getMyProperties(req: Request) {
    // Extract query parameters from the request
    const {
      limit,
      skip,
      propertyType,
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
    const { data, total } = await model.getClientProperties({
      ...queryParams,
    });

    // Return response object containing success status, HTTP code, message, total count, and data
    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      total,
      data,
    };
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

  ///create new property
  public async createTourPackage(req: Request) {
    return this.db.transaction(async (trx) => {
      const { id } = req.agent;
      const { amenities, features, image, property_images, file, ...rest } =
        req.body;

      const model = this.Model.propertyModel(trx);
      // Handle file uploads
      const files = (req.files as Express.Multer.File[]) || [];

      console.log('Uploaded files:', files); // Debug log

      // Create the tour package
      const property = await model.createProperty({
        ...rest,
        agent_id: id,
      });

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
        await this.Model.propertyModel(trx).addAmenities({
          amenity_id: amenityId, // Insert amenityId from the array
          property_id: propertyId, // Assuming propertyId is already available
        });
      }

      //property features
      const parsedFeatures = JSON.parse(features);
      for (const featureId of parsedFeatures) {
        // Use await to insert each amenityId along with the propertyId into the database
        await this.Model.propertyModel(trx).addFeatures({
          feature_id: featureId, // Insert amenityId from the array
          property_id: propertyId, // Assuming propertyId is already available
        });
      }
      // Find all image files in the form-data (based on their fieldname like 'image_1', 'image_2', etc.)
      const imageFiles = files.filter((file) =>
        file.fieldname.startsWith('image_')
      );

      // Get the highest number from the fieldnames
      const numberOfImages = imageFiles.reduce((max, file) => {
        const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
        return fieldNumber > max ? fieldNumber : max;
      }, 0);

      // Loop through based on the dynamically determined number of images
      for (let i = 0; i < numberOfImages; i++) {
        const photoFile = files.find(
          (file) => file.fieldname === `image_${i + 1}`
        );

        if (photoFile) {
          // Process the image (e.g., save to the database)
          await this.Model.propertyModel(trx).addImages({
            property_id: propertyId,
            image: photoFile.filename,
          });
        } else {
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
        const photoFile = files.find(
          (file) => file.fieldname === `file_${i + 1}`
        );

        if (photoFile) {
          // Process the image (e.g., save to the database)
          await this.Model.propertyModel(trx).addDocuments({
            property_id: propertyId,
            file: photoFile.filename,
          });
        } else {
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
    });
  }

  // update properties
  public async updateProperties(req: Request) {
    return this.db.transaction(async (trx) => {
      const { id } = req.agent;
      const { id: propertyId } = req.params;
      const { amenities, features, delete_images, delete_documents, ...rest } =
        req.body;

      const model = this.Model.propertyModel(trx);
      const files = (req.files as Express.Multer.File[]) || [];
      const imageFilesToDelete: string[] = [];
      const documentFilesToDelete: string[] = [];

      console.log({ body: req.body });

      console.log('22222', JSON.stringify(rest, null, 2));

      // Partial update for property details
      if (Object.keys(rest).length > 0) {
        await model.updateProperty(Number(propertyId), {
          ...rest,
          agent_id: id,
        });
      }

      // Handle partial updates for amenities
      if (amenities) {
        const parsedAmenities = JSON.parse(amenities); // Array of amenity IDs
        const currentAmenities = await model.getEminities(Number(propertyId)); // Array of amenity objects

        // Extract IDs from current amenities
        const currentAmenityIds = currentAmenities.map((a: any) => a.id);

        // Identify amenities to add (those in parsedAmenities but not in currentAmenityIds)
        const amenitiesToAdd = parsedAmenities.filter(
          (amenityId: number) => !currentAmenityIds.includes(amenityId)
        );

        // Identify amenities to remove (those in currentAmenityIds but not in parsedAmenities)
        const amenitiesToRemove = currentAmenityIds.filter(
          (amenityId: number) => !parsedAmenities.includes(amenityId)
        );

        // Batch insert new amenities (if any)
        if (amenitiesToAdd.length) {
          const amenitiesData = amenitiesToAdd.map((amenityId: number) => ({
            amenity_id: amenityId,
            property_id: propertyId,
          }));
          await model.addAmenities(amenitiesData); // Adjust your addAmenities method to handle batch inserts
        }

        // Batch delete old amenities (if any)
        if (amenitiesToRemove.length) {
          await model.deleteAmenities({
            ids: amenitiesToRemove, // Pass array of IDs to delete
            property_id: Number(propertyId),
          });
        }
      }

      // Handle partial updates for features
      if (features) {
        const parsedFeatures = JSON.parse(features); // Parsed array of new features
        const currentFeatures = await model.getFeatures(Number(propertyId)); // Array of current feature objects

        // Extract IDs from current features
        const currentFeatureIds = currentFeatures.map((f: any) => f.id);

        // Features to add (those in parsedFeatures but not in currentFeatureIds)
        const featuresToAdd = parsedFeatures.filter(
          (f: any) => !currentFeatureIds.includes(f.id)
        );

        // Features to remove (those in currentFeatureIds but not in parsedFeatures)
        const featuresToRemove = currentFeatures
          .filter((f) => !parsedFeatures.some((pf: any) => pf.id === f.id))
          .map((f) => f.id); // Extract the ids of features to remove

        // Batch insert new features
        if (featuresToAdd.length) {
          const featuresData = featuresToAdd.map((f: any) => ({
            feature_id: f.id,
            property_id: propertyId,
          }));

          await model.addFeatures(featuresData); // Batch insert features
        }

        // Batch delete unused features
        if (featuresToRemove.length) {
          await model.deleteFeatures({
            ids: featuresToRemove, // Pass array of feature ids to delete
            property_id: Number(propertyId),
          });
        }
      }

      // Delete images if specified
      if (delete_images && Array.isArray(delete_images)) {
        const currentImages = await model.getImages(Number(propertyId));
        imageFilesToDelete.push(
          ...currentImages
            .filter((img) => delete_images.includes(img.id))
            .map((img) => img.image)
        );

        await model.deleteImages({
          ids: delete_images,
          property_id: Number(propertyId),
        });
      }

      // Delete documents if specified
      if (delete_documents && Array.isArray(delete_documents)) {
        const currentDocuments = await model.getDocuments(Number(propertyId));
        documentFilesToDelete.push(
          ...currentDocuments
            .filter((doc) => delete_documents.includes(doc.id))
            .map((doc) => doc.file)
        );

        await model.deleteDocuments({
          ids: delete_documents,
          property_id: Number(propertyId),
        });
      }

      const imageFiles = files.filter((file) =>
        file.fieldname.startsWith('image_')
      );

      // Get the highest number from the fieldnames
      const numberOfImages = imageFiles.reduce((max, file) => {
        const fieldNumber = parseInt(file.fieldname.split('_')[1], 10);
        return fieldNumber > max ? fieldNumber : max;
      }, 0);

      // Loop through based on the dynamically determined number of images
      for (let i = 0; i < numberOfImages; i++) {
        const photoFile = files.find(
          (file) => file.fieldname === `image_${i + 1}`
        );

        if (photoFile) {
          // Process the image (e.g., save to the database)
          await this.Model.propertyModel(trx).addImages({
            property_id: propertyId,
            image: photoFile.filename,
          });
        } else {
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
        const photoFile = files.find(
          (file) => file.fieldname === `file_${i + 1}`
        );

        if (photoFile) {
          // Process the image (e.g., save to the database)
          await this.Model.propertyModel(trx).addDocuments({
            property_id: propertyId,
            file: photoFile.filename,
          });
        } else {
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
    });
  }

  //verify property
  public async verifyProperty(req: Request) {
    return this.db.transaction(async (trx) => {
      const propertyId = req.params.id;
      const { verification, rejection_reason } = req.body;

      // Set the admin ID of the verifier
      req.body['verified_by'] = req.admin.id;

      // Validate verification and rejection_reason logic
      if (verification === true) {
        // If verified, reset rejection_reason to null and set verified_at to current time
        req.body['rejection_reason'] = null;
        req.body['verified_at'] = new Date(); // Set verified_at to current timestamp
      } else if (verification === false) {
        // If not verified, ensure rejection_reason is provided
        if (!rejection_reason) {
          throw new Error(
            'Rejection reason must be provided if verification is false.'
          );
        }
      } else {
        throw new Error(
          'Invalid verification status. It must be either true or false.'
        );
      }

      // Call the model to update the property verification details
      const model = this.Model.propertyModel();
      await model.verifyProperty(Number(propertyId), req.body);

      // Return success response
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    });
  }

  // get all property types
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

  // get all property status
  public async getAllPropertyStatus(req: Request) {
    const model = this.Model.propertyModel();
    const { data, total } = await model.getAllPropertyStatus({ ...req.query });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }

  // get get All Amenity
  public async getAllAmenity(req: Request) {
    const model = this.Model.propertyModel();
    const { data, total } = await model.getAllAmenity({ ...req.query });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }

  // get all features
  public async getAllFeatures(req: Request) {
    const model = this.Model.propertyModel();
    const { data, total } = await model.getAllFeature({ ...req.query });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }
  // get all property listing
  public async getAllPropertyListing(req: Request) {
    const model = this.Model.propertyModel();
    const { data, total } = await model.getAllPropertyListing({ ...req.query });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: this.ResMsg.HTTP_OK,
      data,
      total,
    };
  }
}

export default AdminPropertyService;
