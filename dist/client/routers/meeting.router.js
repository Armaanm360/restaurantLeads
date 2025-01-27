"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const meeting_controller_1 = __importDefault(require("../controllers/meeting.controller"));
class MemberMeetingRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.MeetingController = new meeting_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.MEETING), this.MeetingController.createMeeting)
            .get(this.MeetingController.getMeeting);
        this.router
            .route('/meeting-places')
            .get(this.MeetingController.getMeetingPlaces)
            .post(this.MeetingController.createMeetingPlace);
        this.router
            .route('/meeting-persons')
            .get(this.MeetingController.getMeetingPersons);
        this.router
            .route('/meeting-dashboard')
            .get(this.MeetingController.getMeetingDashboard);
        this.router
            .route('/:meeting_id')
            .post(this.MeetingController.addMeetingPerson)
            .get(this.MeetingController.singleMeeting)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.MEETING), this.MeetingController.updateMeeting);
        this.router
            .route('/:meeting_id/:person_id')
            .delete(this.MeetingController.removeMeetingPerson);
    }
}
exports.default = MemberMeetingRouter;
