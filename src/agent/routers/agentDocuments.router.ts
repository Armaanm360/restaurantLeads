import AbstractRouter from '../../abstract/abstract.router';
import AGentDocumentsController from '../controllers/agentDocuments.controller';

class AgentDocumentRouter extends AbstractRouter {
  private controller = new AGentDocumentsController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // create and get agent document
    this.router
      .route('/')
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENT_DOCUMENT_FILES),
        this.controller.createAGentDocuments
      )
      .get(this.controller.getAGentDocument);
  }
}

export default AgentDocumentRouter;
