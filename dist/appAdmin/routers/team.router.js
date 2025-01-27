"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const team_controller_1 = __importDefault(require("../controllers/team.controller"));
class AdminTeamRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.TeamController = new team_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create team
        this.router
            .route('/')
            .post(this.TeamController.createTeam)
            .get(this.TeamController.getTeam);
        // get employee by team
        this.router
            .route('/employee/:team_id')
            .get(this.TeamController.getEmployeeTeamWise);
        // add verifier teams
        this.router.route('/verifier').post(this.TeamController.createVerifier);
        //assign employee to team
        this.router
            .route('/assign-employee')
            .post(this.TeamController.assignEmployeeToTeam);
        //Evaluate employee
        this.router
            .route('/evaluate-permission')
            // .post(this.TeamController.createEvaluateEmployePermission)
            .post(this.TeamController.updateEvaluateEmployePermission);
        //Evaluate permission for employee by team
        this.router
            .route('/evaluate-permission/:team_id')
            .get(this.TeamController.getEvaluateEmployePermissionByTeam);
        //apoint as team leader
        this.router
            .route('/teamleader')
            .post(this.TeamController.assignEmployeeToTeamLeader);
        // remove employee
        this.router
            .route('/remove-employee/by/team_id/:team_id/emp_id/:employee_id')
            .delete(this.TeamController.removeEmployee);
        this.router
            .route('/evaluation-report/evaluation/team_id/:evaluation_id/:team_id')
            .get(this.TeamController.teamWiseEvaluationReport);
        //team wise evaluation report
        // update team
        this.router.route('/:id').patch(this.TeamController.updateTeam);
    }
}
exports.default = AdminTeamRouter;
