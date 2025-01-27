import AbstractRouter from '../../abstract/abstract.router';
import AGentDocumentsController from '../controllers/agentDocuments.controller';
import AgentLeadController from '../controllers/agentLead.controller';

class AgentLeadRouter extends AbstractRouter {
  private controller = new AgentLeadController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //add lead track
    this.router.route('/track').post(this.controller.addTrack);
    // create and get agent document
    this.router.route('/').get(this.controller.getMyLeads);
    //update lead_tracking
    this.router.route('/:id').patch(this.controller.updateLead);
  }
}

export default AgentLeadRouter;
