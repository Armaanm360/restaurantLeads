"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const project_controller_1 = __importDefault(require("../controllers/project.controller"));
class EmployeeProjectRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.EmployeeProjectController = new project_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //get my projects
        this.router
            .route('/')
            .get(this.EmployeeProjectController.getMyAssignedProjects);
        //get single project
        this.router
            .route('/:id')
            .get(this.EmployeeProjectController.getSingleProject);
        //create ,swap and delete card
        this.router
            .route('/card')
            .post(this.EmployeeProjectController.addCard)
            .patch(this.EmployeeProjectController.updateCardPosition)
            .delete(this.EmployeeProjectController.deleteCard);
        //create ,swap and delete card
        this.router
            .route('/delete-task')
            .delete(this.EmployeeProjectController.deleteTask);
        //create reaction comments
        this.router
            .route('/task-part/tasks/comments/reaction')
            .post(this.EmployeeProjectController.reactionComment);
        //create task comments
        this.router
            .route('/task-part/tasks/comments')
            .post(this.EmployeeProjectController.createComment);
        //update task comments
        this.router
            .route('/task-part/tasks/comments/:id')
            .patch(this.EmployeeProjectController.updateComment)
            .delete(this.EmployeeProjectController.deleteComment);
        //create tasks
        this.router
            .route('/task-part/tasks')
            .post(this.EmployeeProjectController.createNewTask);
        this.router
            .route('/task-part/tasks/:id')
            .get(this.EmployeeProjectController.getPartWiseTasks);
        //update single task and get single task
        this.router
            .route('/task-part/tasks/update/:task')
            .get(this.EmployeeProjectController.getSingleTask)
            .patch(this.EmployeeProjectController.updateTask);
        //get all task part project wise
        this.router
            .route('/task-part/:id')
            .get(this.EmployeeProjectController.getTaskWiseParts);
        //create a new task part
        this.router
            .route('/task-part')
            .post(this.EmployeeProjectController.createNewTaskPart);
        //create project documentation
        this.router
            .route('/documents')
            .post(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT_DOCUMENTS), this.EmployeeProjectController.createProjectDocumentation);
        //update project documentations
        this.router
            .route('/documents/:id')
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.PROJECT_DOCUMENTS), this.EmployeeProjectController.updateProjectDocuments)
            .delete(this.EmployeeProjectController.deleteProjectDocuments);
        //add employee to team for project!
        this.router
            .route('/add-remove-employee')
            .post(this.EmployeeProjectController.addRemoveEmployee);
        //add employee to team for project!
        this.router.route('/track').post(this.EmployeeProjectController.addTrack);
    }
}
exports.default = EmployeeProjectRouter;
