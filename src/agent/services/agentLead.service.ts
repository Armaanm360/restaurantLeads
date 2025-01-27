import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import CustomError from '../../utils/lib/customEror';

class AgentLeadService extends AbstractServices {
  constructor() {
    super();
  }

  // create agent document
  public async createAgentDocuments(req: Request) {
    const { id: agent_id } = req.agent;
    const model = this.Model.agentModel();

    req.body['agent_id'] = agent_id;

    const body = req.body;

    const files = (req.files as Express.Multer.File[]) || [];

    if (files.length) {
      for (const file of files) {
        switch (file.fieldname) {
          case 'nid_card_file':
            body.nid_card_file = file.filename;
            break;
          case 'professional_license':
            body.professional_license = file.filename;
            break;
          case 'bank_statement_url':
            body.bank_statement_url = file.filename;
            break;
          case 'company_profile_url':
            body.company_profile_url = file.filename;
            break;
          case 'reference_letters_url':
            body.reference_letters_url = file.filename;
            break;
          case 'proof_of_address_url':
            body.proof_of_address_url = file.filename;
            break;
          case 'agreement_with_property_owners_url':
            body.agreement_with_property_owners_url = file.filename;
            break;
          case 'training_certificates_url':
            body.training_certificates_url = file.filename;
            break;
          case 'profile_picture_url':
            body.profile_picture_url = file.filename;
            break;
          default:
        }
      }
    }

    console.log({ body });

    const check_document = await model.singleAgentDocuments({ agent_id });

    if (!check_document.length) {
      await model.createAgentDocuments(req.body);
    } else {
      const fieldMapping: Record<string, keyof (typeof check_document)[0]> = {
        nid_card_file: 'nid_card_file',
        professional_license: 'professional_license',
        bank_statement_url: 'bank_statement_url',
        company_profile_url: 'company_profile_url',
        proof_of_address_url: 'proof_of_address_url',
        reference_letters_url: 'reference_letters_url',
        agreement_with_property_owners_url:
          'agreement_with_property_owners_url',
        training_certificates_url: 'training_certificates_url',
        profile_picture_url: 'profile_picture_url',
      };

      const existingFiles = files
        .filter((file) => {
          const mappedField = fieldMapping[file.fieldname];
          return mappedField && check_document[0][mappedField] !== null;
        })
        .map((file) => file.filename);

      console.log('Array of existing filenames:', existingFiles);

      // delete existing files from cloud
      // this.manageFile.deleteFromCloud(existingFiles);

      await model.updateAgentDocuments(body, { agent_id });
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
    };
  }

  // get agent documents
  public async getMyLeads(req: Request) {
    const { id: agent_id } = req.agent;
    const model = this.Model.propertyModel();

    const { data, total } = await model.getLeads(agent_id, req.query);

    return {
      success: true,
      code: this.StatusCode.HTTP_SUCCESSFUL,
      message: this.ResMsg.HTTP_SUCCESSFUL,
      data,
      total,
    };
  }

  //add tracking to my lead!
  public async addTrack(req: Request) {
    return this.db.transaction(async (trx) => {
      const customTrack = {
        inquiry_id: req.body['inquiry_id'],
        status: req.body['status'],
        notes: req.body['notes'],
        client_feedback: req.body['client_feedback'],
        follow_up_date: req.body['follow_up_date'],
      };
      const model = this.Model.propertyModel();

      //add tracking to the lead manually
      await model.addTrackingToLead(customTrack);
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    });
  }

  //lead status update
  public async updateLead(req: Request) {
    return this.db.transaction(async (trx) => {
      const leadId = Number(req.params.id);

      const model = this.Model.propertyModel(trx);

      //add tracking to the lead manually
      await model.updateLead(leadId, req.body);

      //auto track
      const customTrack = {
        inquiry_id: leadId,
        status: req.body['status'],
        notes: req.body['notes'],
        follow_up_date: req.body['follow_up_date'],
      };
      //add tracking to the lead manually
      await model.addTrackingToLead(customTrack);
      return {
        success: true,
        code: this.StatusCode.HTTP_SUCCESSFUL,
        message: this.ResMsg.HTTP_SUCCESSFUL,
      };
    });
  }
}

export default AgentLeadService;
