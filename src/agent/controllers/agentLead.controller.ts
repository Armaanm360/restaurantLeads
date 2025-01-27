import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import AgentDocumentValidator from '../utils/validators/document.validator';
import AgentLeadService from '../services/agentLead.service';

class AgentLeadController extends AbstractController {
  private service = new AgentLeadService();
  private validator = new AgentDocumentValidator();
  constructor() {
    super();
  }

  // get agent document
  public getMyLeads = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.createAGentDocuments },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getMyLeads(req);
      res.status(code).json(data);
    }
  );

  // add tracking to my lead
  public addTrack = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.createAGentDocuments },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.addTrack(req);
      res.status(code).json(data);
    }
  );

  // update lead
  public updateLead = this.asyncWrapper.wrap(
    // { bodySchema: this.validator.createAGentDocuments },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.updateLead(req);
      res.status(code).json(data);
    }
  );
}

export default AgentLeadController;
