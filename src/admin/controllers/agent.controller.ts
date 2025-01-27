import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import AdminAgentService from '../services/agent.service';

class AdminAgentController extends AbstractController {
  private service = new AdminAgentService();
  // private validator = new activityValidator();
  constructor() {
    super();
  }
  ///get all property list public
  public getAllAgents = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAllAgents(req);
      res.status(code).json(data);
    }
  );
  ///get single agent
  public getSingleAgent = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleAgent(req);
      res.status(code).json(data);
    }
  );

  ///get single agent
  public updateSingleAgentVerification = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } =
        await this.service.updateSingleAgentVerification(req);
      res.status(code).json(data);
    }
  );

  //verify single agent

  //get single property
  public getSingleProperty = this.asyncWrapper.wrap(
    { paramSchema: this.commonValidator.singleParamValidator('id') },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getSingleProperty(req);
      res.status(code).json(data);
    }
  );

  ///get all property list public
  public createProperty = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createTourPackage(req);
      res.status(code).json(data);
    }
  );

  // update property
  public updateProperties = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateProperties(req);
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

export default AdminAgentController;
