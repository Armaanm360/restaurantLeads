import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import ClientPropertyService from '../services/property.service';

class ClientPropertyController extends AbstractController {
  private service = new ClientPropertyService();
  // private validator = new activityValidator();
  constructor() {
    super();
  }
  ///get all property list public
  public getProperty = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getProperties(req);
      res.status(code).json(data);
    }
  );
  ///add inquiry
  public addInquiry = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.addInquiry(req);
      res.status(code).json(data);
    }
  );
  ///listing property
  public listingProperty = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.listingProperty(req);
      res.status(code).json(data);
    }
  );

  //get single property
  public getSingleProperty = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleProperty(req);
      res.status(code).json(data);
    }
  );

  //get single property
  public getPropertyTypes = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllPropertyTypes(req);
      res.status(code).json(data);
    }
  );
}

export default ClientPropertyController;
