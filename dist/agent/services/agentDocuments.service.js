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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class AgentDocumentService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create agent document
    createAgentDocuments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: agent_id } = req.agent;
            const model = this.Model.agentModel();
            req.body['agent_id'] = agent_id;
            const body = req.body;
            const files = req.files || [];
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
            const check_document = yield model.singleAgentDocuments({ agent_id });
            if (!check_document.length) {
                yield model.createAgentDocuments(req.body);
            }
            else {
                const fieldMapping = {
                    nid_card_file: 'nid_card_file',
                    professional_license: 'professional_license',
                    bank_statement_url: 'bank_statement_url',
                    company_profile_url: 'company_profile_url',
                    proof_of_address_url: 'proof_of_address_url',
                    reference_letters_url: 'reference_letters_url',
                    agreement_with_property_owners_url: 'agreement_with_property_owners_url',
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
                yield model.updateAgentDocuments(body, { agent_id });
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get agent documents
    getAgentDocument(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: agent_id } = req.agent;
            const model = this.Model.agentModel();
            const check_document = yield model.singleAgentDocuments({ agent_id });
            if (!check_document.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: check_document[0],
            };
        });
    }
}
exports.default = AgentDocumentService;
