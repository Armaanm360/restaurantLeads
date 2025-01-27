import { Request, Response } from "express";
import AbstractController from "../../abstract/abstract.controller";
import ClientPropertyService from "../services/property.service";
import AgentPropertyValidator from "../utils/validators/agentProperty.validator";

class ClientPropertyController extends AbstractController {
  private service = new ClientPropertyService();
  private validator = new AgentPropertyValidator();
  constructor() {
    super();
  }
  ///get all property list public
  public getMyProperties = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getMyProperties(req);
      res.status(code).json(data);
    }
  );

  //get single property
  public getSingleProperty = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator("id") },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleProperty(req);
      res.status(code).json(data);
    }
  );

  ///get all property list public
  public createProperty = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createPropertyValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createProperty(req);
      res.status(code).json(data);
    }
  );

  // update property
  public updateProperties = this.asyncWrapper.wrap(
    { bodySchema: this.validator.updatePropertyValidator },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateProperties(req);
      res.status(code).json(data);
    }
  );

  // delete properties
  public deleteSingleProperty = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator("id") },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.deleteProperty(req);
      res.status(code).json(data);
    }
  );

  // get all property status
  public getAllPropertyStatus = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllPropertyStatus(req);
      res.status(code).json(data);
    }
  );
  // get all property types
  public getAllPropertyTypes = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllPropertyTypes(req);
      res.status(code).json(data);
    }
  );

  // get all eminities
  public getAllAmenity = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllAmenity(req);
      res.status(code).json(data);
    }
  );

  // get all features
  public getAllFeatures = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllFeatures(req);
      res.status(code).json(data);
    }
  );
}

export default ClientPropertyController;
