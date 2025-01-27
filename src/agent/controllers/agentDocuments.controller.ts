import { Request, Response } from "express";
import AbstractController from "../../abstract/abstract.controller";
import AgentDocumentService from "../services/agentDocuments.service";
import AgentAuthController from "../../auth/controller/auth.agent.controller";
import AgentDocumentValidator from "../utils/validators/document.validator";

class AGentDocumentsController extends AbstractController {
  private service = new AgentDocumentService();
  private validator = new AgentDocumentValidator();
  constructor() {
    super();
  }
  // create agent document
  public createAGentDocuments = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createAGentDocuments },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.createAgentDocuments(req);
      res.status(code).json(data);
    }
  );

  // get agent document
  public getAGentDocument = this.asyncWrapper.wrap(
    { bodySchema: this.validator.createAGentDocuments },
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.service.getAgentDocument(req);
      res.status(code).json(data);
    }
  );
}

export default AGentDocumentsController;
