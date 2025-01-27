"use strict";
// import AbstractRouter from "../../abstract/abstract.router";
// import MemberValidator from "../utils/validators/member.validator";
// class UserRouter extends AbstractRouter {
//   private validator = new MemberValidator();
//   private UserController = new UserController();
//   constructor() {
//     super();
//     this.callRouter();
//   }
//   private callRouter() {
//     //create employee
//     this.router.route("/users/status/:id").get(
//       // this.validator.changePassword(),
//       this.UserController.updateMemeber
//     );
//     // .get(this.UserController.getTeam);
//     this.router
//       .route("/users/getallusers/association")
//       .get(this.UserController.getAllSuperUsers);
//     //create employee
//     this.router.route("/users").post(this.UserController.createEmployee);
//     this.router
//       .route("/users/assign-employee")
//       .post(this.UserController.assignEmployeeToTeam);
//     this.router
//       .route("/users/switch-employee/:userid")
//       .post(this.UserController.switchEmployeeToOtherTeam);
//     this.router
//       .route("/users/assign-employee/teamleader/:teamid/:userid")
//       .get(this.UserController.assignEmployeeToTeamLeader);
//     this.router.route("/unappointed").get(
//       // this.validator.changePassword(),
//       this.UserController.getUnPointedUser
//     );
//     this.router
//       .route("/teams")
//       .post(
//         // this.validator.changePassword(),
//         this.UserController.createTeam
//       )
//       .get(this.UserController.getTeam);
//     //
//     this.router
//       .route("/current-teams/:teamid")
//       .get(this.UserController.getCurrentTeams);
//     this.router.route("/teams/position/:team_id/:level").get(
//       // this.validator.changePassword(),
//       this.UserController.getTeamPositionWiseUser
//     );
//     this.router
//       .route("/questions")
//       .post(
//         // this.validator.changePassword(),
//         this.UserController.createQuestions
//       )
//       .get(this.UserController.getQuestions);
//     this.router
//       .route("/questions/evaluation/:id")
//       .get(this.UserController.getEvaluationQuestions);
//     this.router
//       .route("/questions/evaluation/level/:evaluation_id/:level")
//       .get(this.UserController.getEvaluationQuestionsLevel);
//     this.router
//       .route("/evaluation/:id")
//       .get(this.UserController.getEvaluationWise)
//       .patch(this.UserController.updateEvaluation);
//     this.router
//       .route("/evaluation/evaluated/:id")
//       .get(this.UserController.getEvaluatedUsers);
//     this.router
//       .route("/evaluation")
//       .post(
//         // this.validator.changePassword(),
//         this.UserController.createEvaluation
//       )
//       .get(this.UserController.getEvaluation);
//     // .patch(this.UserController.updateEvaluation);
//     this.router.route("/responses").post(
//       // this.validator.changePassword(),
//       this.UserController.createResponses
//     );
//     this.router
//       .route("/responses/:id")
//       .get(this.UserController.getEvaluationReport);
//     this.router
//       .route("/responses/:id/:teamid")
//       .get(this.UserController.getEvaluationReportTeamWise);
//     this.router
//       .route("/activities")
//       .post(
//         // this.validator.changePassword(),
//         this.UserController.createActivity
//       )
//       .get(this.UserController.getActivities);
//     this.router
//       .route("/activities/:id")
//       .get(this.UserController.updateActivity);
//     this.router
//       .route("/activities/:id")
//       .patch(this.UserController.updateActivityRemark);
//     this.router
//       .route("/teams/users/:id")
//       .post(this.UserController.createMember)
//       .get(this.UserController.getMemberUserWise);
//     this.router.route("/shift/:id").post(this.UserController.upsertShift);
//     this.router.route("/dashboard").get(this.UserController.dashboardData);
//     this.router
//       .route("/team-wise-activity-log/today/:team_id/:user_id")
//       .get(this.UserController.teamWiseActivitySingleToday);
//     this.router
//       .route("/team-wise-activity-log/today/:team_id")
//       .get(this.UserController.teamWiseActivityToday);
//     this.router
//       .route("/team-wise-activity-log/:team_id")
//       .get(this.UserController.teamWiseActivity);
//     this.router
//       .route("/team-wise-activity-log/:team_id/:user_id")
//       .get(this.UserController.teamWiseActivitySingle);
//     this.router.route("/employees").get(this.UserController.getEmployees);
//   }
// }
// export default UserRouter;
