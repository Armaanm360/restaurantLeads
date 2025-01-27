"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_project_controller_1 = __importDefault(require("../controllers/admin.project.controller"));
class AdminProjectRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.AdminProjectController = new admin_project_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create project
        this.router
            .route('/')
            .get(this.AdminProjectController.getAllProjects)
            .post(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT), this.AdminProjectController.createProject);
        //get single project
        this.router
            .route('/:id')
            .get(this.AdminProjectController.getSingleProject)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT), this.AdminProjectController.updateSingleProject)
            .delete(this.AdminProjectController.deleteProject);
        //create project documentation
        this.router
            .route('/documents')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT_DOCUMENTS), this.AdminProjectController.createProjectDocumentation);
        //update project documentations
        this.router
            .route('/documents/:id')
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT_DOCUMENTS), this.AdminProjectController.updateProjectDocuments)
            .delete(this.AdminProjectController.deleteProjectDocuments);
        //add employee to team for project!
        this.router
            .route('/add-remove-employee')
            .post(this.AdminProjectController.addRemoveEmployee);
        //add employee to team for project!
        this.router.route('/track').post(this.AdminProjectController.addTrack);
    }
}
exports.default = AdminProjectRouter;
