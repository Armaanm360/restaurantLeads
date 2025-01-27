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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const notification_service_1 = __importDefault(require("../../common/commonService/notification.service"));
class AdminProjectService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // Service method to create a new project within a transaction with notification
    createProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const notifyService = new notification_service_1.default();
                // Extract admin and organization details from the request
                const { id, organization_id } = req.admin;
                // Destructure the incoming request body, separating teams from the rest of the data
                const _a = req.body, { teams } = _a, rest = __rest(_a, ["teams"]);
                const files = req.files || [];
                if (files.length) {
                    rest['logo'] = files[0].filename;
                }
                // Set default values for the new project
                rest.code = this.generateProjectCode(rest.name, organization_id); // TODO: Replace with dynamic code generation if required
                rest.created_by = organization_id; // Assign project creator as the organization
                rest.status = 'active'; // Default status for a new project
                rest.organization_id = organization_id; // Default status for a new project
                // Insert the new project into the database
                const project = yield this.Model.projectModel().createProject(rest);
                const jsonParse = JSON.parse(teams);
                //
                // Loop through each team member and add them to the newly created project
                for (const teamMember of jsonParse) {
                    const teamPayload = {
                        employee_id: teamMember.employee_id,
                        project_role: teamMember.role,
                        project_id: project[0].id,
                        created_by: id, // Record who added the team member
                    };
                    //check already exists employee to project
                    const checkExistedEmployee = yield this.Model.projectModel().checkEmployeeAlreadyExists(project[0].id, teamMember.employee_id);
                    const employee_info = yield this.Model.employeeModel().getSingleEmployee({
                        id: Number(teamMember.employee_id),
                    });
                    if (checkExistedEmployee.length) {
                        //delete previous project
                        yield this.Model.projectModel().deleteProject(project[0].id);
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: `${employee_info[0].name} Has Been Already Added`,
                        };
                    }
                    //tracking info
                    // Insert a tracking entry for the project creation event
                    const trackingPayload = {
                        project_id: Number(project[0].id),
                        from_user: 'ADMIN',
                        type: 'AUTO',
                        details: `${employee_info[0].name} as been assigned to Project With Role Of ${teamMember.role}`,
                    };
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        type: 'project-management',
                        ref_id: project[0].id,
                        user_id: teamMember.employee_id,
                        message: `Project - ${req.body.name}. You Have Been Assigned As ${teamMember.role}`,
                        organization_id: organization_id,
                        title: `${req.body.name}`,
                        description: `${req.body.name}`,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    // if (teamMember.role === 'LEAD') {
                    //   await this.Model.projectModel().reverseTeamLead(
                    //     Number(req.body['project_id']),
                    //     Number(req.body['employee_id'])
                    //   );
                    // }
                    yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                    //end of tracking info
                    yield this.Model.projectModel().addTeamMembersToProject(teamPayload);
                }
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: project[0].id,
                    from_user: 'ADMIN',
                    type: 'AUTO',
                    details: `A project named '${rest.name}' has been created.`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                //create project initial things
                const createCardPayload = [
                    {
                        project_id: project[0].id,
                        column_name: 'TODO',
                        index_number: 0,
                    },
                    {
                        project_id: project[0].id,
                        column_name: 'IN-PROGRESS',
                        index_number: 1,
                    },
                    {
                        project_id: project[0].id,
                        column_name: 'TEST',
                        index_number: 2,
                    },
                    {
                        project_id: project[0].id,
                        column_name: 'DONE',
                        index_number: 3,
                    },
                ];
                for (const simple of createCardPayload) {
                    yield this.Model.projectModel().addCard(simple);
                }
                // Return a success response upon successful transaction completion
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Card Swapped Successfully',
                };
            }));
        });
    }
    //generate project code
    generateProjectCode(projectName, organizationId) {
        // Step 1: Create an abbreviation from the project name (first two letters of each word, up to 4 letters)
        const nameAbbreviation = projectName
            .split(/\s+/) // Split by spaces
            .map((word) => word.slice(0, 2).toUpperCase()) // Take the first 2 letters of each word
            .join('') // Join them together
            .slice(0, 4); // Limit to 4 characters
        // Step 2: Get a unique numeric component (e.g., last 4 digits of organization ID + a counter or random number)
        const uniqueNumber = (organizationId % 1000).toString() +
            Math.floor(1000 + Math.random() * 9000).toString();
        // Combine to form the final code (name abbreviation + unique number)
        return `${nameAbbreviation}${uniqueNumber}`;
    }
    // Service method to create a new project documents
    createProjectDocuments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const notifyService = new notification_service_1.default();
                // Extract admin and organization details from the request
                const { id, organization_id } = req.admin;
                const admin = yield this.Model.UserAdminModel().getSingleAdminInfo(id);
                const project_id = Number(req.body.project_id);
                console.log(project_id, req.body);
                // return;
                req.body['project_id'] = project_id;
                req.body['uploaded_by'] = admin[0].name;
                req.body['uploaded_by_type'] = 'ADMIN';
                // Destructure the incoming request body, separating teams from the rest of the data
                const files = req.files || [];
                if (files.length) {
                    req.body['filename'] = files[0].filename;
                }
                //insert into project documents
                yield this.Model.projectModel().insertProjectDocuments(req.body);
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: project_id,
                    from_user: 'ADMIN',
                    type: 'AUTO',
                    details: `Admin Has Uploaded A New Document To The Project`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                //team wise member
                const getProjectInfo = yield this.Model.projectModel().getSingleProject(req.body['project_id']);
                const teamInfo = yield this.Model.projectModel().getProjectWiseMembers(project_id);
                const teamMembers = teamInfo.map((item) => item.employee_id);
                for (const tm of teamMembers) {
                    const notificationPayload = {
                        type: 'project-management',
                        user_id: tm,
                        ref_id: project_id,
                        message: `Project - ${getProjectInfo[0].project_name}. A New Document Has Been added`,
                        organization_id: organization_id,
                        title: `${req.body.name}`,
                        description: `${req.body.name}`,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                }
                // Return a success response upon successful transaction completion
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Project Document Uploaded Successfully',
                };
            }));
        });
    }
    // Update Project Documents
    updateProjectDocuments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Extract admin and organization details from the request
                const { id, organization_id } = req.admin;
                const admin = yield this.Model.UserAdminModel().getSingleAdminInfo(id);
                const document_id = Number(req.params.id);
                console.log(document_id, req.body);
                // Destructure the incoming request body, separating teams from the rest of the data
                const files = req.files || [];
                if (files.length) {
                    req.body['filename'] = files[0].filename;
                }
                //insert into project documents
                yield this.Model.projectModel().updateProjectDocuments(document_id, req.body);
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: req.body.project_id,
                    from_user: 'ADMIN',
                    type: 'AUTO',
                    details: `Admin Has Uploaded A New Document To The Project`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                // Return a success response upon successful transaction completion
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Project Document Updated Successfully',
                };
            }));
        });
    }
    // delete Project Documents
    deleteProjectDocuments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Extract admin and organization details from the request
                const { id, organization_id } = req.admin;
                const document_id = Number(req.params.id);
                console.log(document_id, req.body);
                //insert into project documents
                yield this.Model.projectModel().deleteProjectDocuments(document_id);
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: req.body.project_id,
                    from_user: 'ADMIN',
                    type: 'AUTO',
                    details: `Admin Has Deleted A Project Document`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                // Return a success response upon successful transaction completion
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Project Document Updated Successfully',
                };
            }));
        });
    }
    // Service method add employee
    addRemoveEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id, organization_id } = req.admin;
                const notifyService = new notification_service_1.default();
                const employee_info = yield this.Model.employeeModel().getSingleEmployee({
                    id: Number(req.body['employee_id']),
                });
                const getProjectInfo = yield this.Model.projectModel().getSingleProject(req.body['project_id']);
                if (req.body['type'] === 'add') {
                    //check already exists employee to project
                    const teamPayload = {
                        employee_id: Number(req.body['employee_id']),
                        project_role: req.body['project_role'],
                        project_id: Number(req.body['project_id']),
                        created_by: organization_id, // Record who added the team member
                    };
                    //check already exists employee to project
                    const checkExistedEmployee = yield this.Model.projectModel().checkEmployeeAlreadyExists(Number(req.body['project_id']), Number(req.body['employee_id']));
                    if (checkExistedEmployee.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Employee Has Been Already Added',
                        };
                    }
                    yield this.Model.projectModel().addTeamMembersToProject(teamPayload);
                    //tracking info
                    // Insert a tracking entry for the project creation event
                    const trackingPayload = {
                        project_id: Number(req.body['project_id']),
                        from_user: 'ADMIN',
                        type: 'AUTO',
                        details: `${employee_info[0].name} as been assigned to Project With Role Of ${req.body['project_role']}`,
                    };
                    yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                    //end of tracking info
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        type: 'project-management',
                        user_id: req.body['employee_id'],
                        ref_id: Number(req.body['project_id']),
                        message: `Project - ${getProjectInfo.project_name}. You Have Been Assigned As ${req.body['project_role']}`,
                        organization_id: organization_id,
                        title: `${getProjectInfo.project_name}`,
                        description: `${getProjectInfo.project_name}`,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Employee Has been Added To Project!',
                    };
                }
                if (req.body['type'] === 'remove') {
                    yield this.Model.projectModel().removeTeamMemberProject(Number(req.body['project_id']), Number(req.body['employee_id']));
                    //tracking info
                    // Insert a tracking entry for the project creation event
                    const trackingPayload = {
                        project_id: Number(req.body['project_id']),
                        from_user: 'ADMIN',
                        type: 'AUTO',
                        details: `${employee_info[0].name} as been removed from the project`,
                    };
                    yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        type: 'project-management',
                        user_id: req.body['employee_id'],
                        ref_id: Number(req.body['project_id']),
                        message: `Project - ${getProjectInfo.project_name}. You Have Been Removed From The Project`,
                        organization_id: organization_id,
                        title: `${getProjectInfo.project_name}`,
                        description: `${getProjectInfo.project_name}`,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    //end of tracking info
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Employee Has been Removed From Project!',
                    };
                }
                if (req.body['type'] === 'lead') {
                    try {
                        const result = yield this.Model.projectModel().reverseTeamLead(Number(req.body['project_id']), Number(req.body['employee_id']));
                        if (result === 'already assigned') {
                            return {
                                success: true,
                                code: this.StatusCode.HTTP_SUCCESSFUL,
                                message: 'Employee is already the team lead.',
                            };
                        }
                        //tracking info
                        // Insert a tracking entry for the project creation event
                        const trackingPayload = {
                            project_id: Number(req.body['project_id']),
                            from_user: 'ADMIN',
                            type: 'AUTO',
                            details: `${employee_info[0].name} as been assigned As Team Lead To The Project`,
                        };
                        yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                        //end of tracking info
                        //==============================================
                        //                Notification Section
                        //==============================================
                        const notificationPayload = {
                            type: 'project-management',
                            user_id: req.body['employee_id'],
                            ref_id: Number(req.body['project_id']),
                            message: `Project - ${getProjectInfo.project_name}. You Have Been Assigned As Team Leader`,
                            organization_id: organization_id,
                            title: `${getProjectInfo.project_name}`,
                            description: `${getProjectInfo.project_name}`,
                        };
                        yield notifyService.adminToSingleEmployee(notificationPayload);
                        //==============================================
                        //            End of Notification Section
                        //==============================================
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_SUCCESSFUL,
                            message: 'Team Lead Assigned Successfully!',
                        };
                    }
                    catch (error) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_BAD_REQUEST,
                            message: 'Failed to assign team lead.',
                        };
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_FULFILLED,
                    message: 'Employee Has been Removed From Project!',
                };
            }));
        });
    }
    //get single project
    getSingleProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectId = Number(req.params.id);
            const data = yield this.Model.projectModel().getSingleProject(projectId);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    //delete project
    deleteProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const projectId = Number(req.params.id);
                const data = yield this.Model.projectModel().deleteProject(projectId);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Project Has Been Deleted',
                };
            }));
        });
    }
    //get all projects
    getAllProjects(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const { limit, skip, project_name } = req.query;
            const model = this.Model.projectModel();
            const { total, data } = yield model.getAllProjects(organization_id, {
                project_name: project_name,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //add tracking to project
    addTrack(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: Number(req.body.project_id),
                    from_user: 'ADMIN',
                    type: 'RAW',
                    details: req.body.details,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Track Added Successfully',
                };
            }));
        });
    }
    //update a single project
    updateSingleProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const project_id = Number(req.params.id);
                const files = req.files || [];
                if (files.length) {
                    req.body['logo'] = files[0].filename;
                }
                yield this.Model.projectModel().updateProject(project_id, req.body);
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: Number(project_id),
                    from_user: 'ADMIN',
                    type: 'AUTO',
                    details: `Project Has Been Updated!`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Project Updated Successfully',
                };
            }));
        });
    }
}
exports.default = AdminProjectService;
