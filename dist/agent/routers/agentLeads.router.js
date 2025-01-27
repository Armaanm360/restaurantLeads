"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const agentLead_controller_1 = __importDefault(require("../controllers/agentLead.controller"));
class AgentLeadRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new agentLead_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //add lead track
        this.router.route('/track').post(this.controller.addTrack);
        // create and get agent document
        this.router.route('/').get(this.controller.getMyLeads);
        //update lead_tracking
        this.router.route('/:id').patch(this.controller.updateLead);
    }
}
exports.default = AgentLeadRouter;
