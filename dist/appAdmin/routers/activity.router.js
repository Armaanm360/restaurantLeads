"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../../client/utils/validators/member.validator"));
const activity_controller_1 = __importDefault(require("../controllers/activity.controller"));
class AdminActivityRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.AdminActivityController = new activity_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/all-activities')
            .get(this.AdminActivityController.getAllActivities);
        // all other activities
        this.router
            .route('/all-other-activities')
            .get(this.AdminActivityController.getAllOtherActivities);
        //prayer times
        this.router
            .route('/prayer-times')
            .post(this.AdminActivityController.createPrayerTimes)
            .get(this.AdminActivityController.getPrayerTimes);
        this.router
            .route('/dashboard-activity-data')
            .get(this.AdminActivityController.getActivityDashboard);
        this.router
            .route('/:id')
            .get(this.AdminActivityController.getActivityTeamWise);
    }
}
exports.default = AdminActivityRouter;
