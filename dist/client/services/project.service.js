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
class employeeProjectService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //get my assigned projects
    getMyAssignedProjects(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.employee;
            const data = yield this.Model.projectModel().getMyAssignedProjects(organization_id, id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    //get single task
    getSingleTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            const task = Number(req.params.task);
            const data = yield this.Model.projectModel().getSingleTask(task);
            const comments = yield this.Model.projectModel().getAllComments(id, task);
            const history = yield this.Model.projectModel().getSingleTaskHistory(task);
            const project = yield this.Model.projectModel().getTaskOrProjectInfo(task);
            const customizedColumns = yield this.Model.projectModel().getCustomizedColumns(project[0].project_id);
            // Check if project array has elements
            // if (project.length > 0) {
            //   // Call getCustomizedColumns and handle result
            //   const customizedColumns =
            //     await this.Model.projectModel().getCustomizedColumns(
            //       project[0].project_id
            //     );
            //   // Conditionally add status based on the result of getCustomizedColumns
            //   if (customizedColumns) {
            //     status.push(...customizedColumns); // Assuming the result is an array, push it into status
            //   }
            // }
            // Build response with conditional status array
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: Object.assign(Object.assign({}, data[0]), { // Assuming data exists and is an array
                    history,
                    customizedColumns,
                    comments }),
            };
        });
    }
    //get single project
    getSingleProject(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const project_id = Number(req.params.id);
            const data = yield this.Model.projectModel().getSingleProject(project_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    //get task wise parts
    getTaskWiseParts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.employee;
            const project_id = Number(req.params.id);
            const data = yield this.Model.projectModel().getTaskWiseParts(project_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data,
            };
        });
    }
    //get part wise tasks
    // Get tasks grouped by customized columns (part-wise)
    getPartWiseTasks(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const project_id = Number(req.params.id);
            // Fetch part-wise tasks and project info
            const tasks = yield this.Model.projectModel().getPartWiseTasks(project_id);
            // Fetch customized columns for the project
            const getMyCustomizedColumns = yield this.Model.projectModel().getCustomizedColumns(project_id);
            console.log(getMyCustomizedColumns);
            // const customizedColumns = getMyCustomizedColumns.map((column) => ({
            //   column_name: column.column_name,
            //   index_number: column.index_number,
            // }));
            // Initialize an empty groupedTasks object
            const groupedTasks = {};
            // Dynamically populate groupedTasks based on the customized columns
            getMyCustomizedColumns.forEach((column) => {
                groupedTasks[column.column_name] = {
                    id: column.column_name,
                    title: column.display_name || column.column_name,
                    index_number: column.index_number,
                    tasks: [],
                };
            });
            // Format and group tasks by their status
            tasks.forEach((task) => {
                const formattedTask = {
                    id: task.id,
                    content: task.title,
                    assigned_to: task.employee_name,
                    assigned_to_image: task.employee_photo,
                    part_name: task.part_name,
                    priority_flag: task.priority_flag,
                    details: task.details, // Task details
                };
                // Add task to the respective status column dynamically
                if (groupedTasks[task.status]) {
                    groupedTasks[task.status].tasks.push(formattedTask);
                }
            });
            // Return the grouped task response
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                data: groupedTasks,
            };
        });
    }
    //create new task part
    createNewTaskPart(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                //
                req.body['created_by'] = id;
                req.body['assigned_by'] = id;
                const data = yield this.Model.projectModel().createNewTaskPart(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data,
                };
            }));
        });
    }
    //update another  task
    updateTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                const task = Number(req.params.task);
                // Retrieve user information
                const userInfo = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                const _a = req.body, { type } = _a, rest = __rest(_a, ["type"]);
                console.log(req.body);
                //current_status
                const getLastStatusBeforeUpdate = yield this.Model.projectModel().getLastTaskStatus(task);
                // Task history mapping
                const taskHistoryDetails = {
                    assignee: `${userInfo.name} assigned a new member`,
                    priority_flag: `${userInfo.name} has marked the task as ${req.body['priority_flag']}`,
                    title: `${userInfo.name} updated the task title`,
                    details: `${userInfo.name} updated the task details`,
                    status: `${userInfo.name} changed the task status from ${getLastStatusBeforeUpdate[0].status} to ${req.body['status']}`,
                };
                console.log(req.body);
                // Update task in the project model
                const data = yield this.Model.projectModel().updateTask(task, rest);
                const updateType = type;
                if (taskHistoryDetails[updateType]) {
                    const taskHistory = {
                        task_id: task,
                        details: `${taskHistoryDetails[updateType]}`,
                    };
                    yield this.Model.projectModel().insertNewTaskTrack(taskHistory);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    //create new task
    createNewTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.employee;
                req.body['assigned_by'] = id;
                // console.log(req.body);
                // return;
                const data = yield this.Model.projectModel().createNewTask(req.body);
                /* user info  */
                const getUserInfo = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                /* add task history */
                const taskHistory = {
                    task_id: data[0].id,
                    details: `${getUserInfo.name} created the task`,
                };
                yield this.Model.projectModel().insertNewTaskTrack(taskHistory);
                /*  */
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data,
                };
            }));
        });
    }
    //create new comment
    createComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.employee;
                req.body['user_id'] = id;
                const data = yield this.Model.projectModel().createComment(req.body);
                /* user info  */
                const getUserInfo = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                /* add task history */
                const taskHistory = {
                    task_id: data[0].id,
                    details: `${getUserInfo.name} commented ${req.body['comment']}`,
                };
                yield this.Model.projectModel().insertNewTaskTrack(taskHistory);
                /*  */
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                    data,
                };
            }));
        });
    }
    //update comment
    updateComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const comment_id = Number(req.params.id);
                const { id } = req.employee;
                const data = yield this.Model.projectModel().updateComment(comment_id, req.body);
                /* user info  */
                const getUserInfo = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                /* add task history */
                const taskHistory = {
                    task_id: id,
                    details: `${getUserInfo.name} updated comment ${req.body['comment']}`,
                };
                yield this.Model.projectModel().insertNewTaskTrack(taskHistory);
                /*  */
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'Comment Edited Successfully',
                };
            }));
        });
    }
    //delete comment
    deleteComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment_id = Number(req.params.id);
            const { id } = req.employee;
            const data = yield this.Model.projectModel().deleteComment(comment_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'Comment Deleted',
            };
        });
    }
    //add reaction to comment
    reactionComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            req.body['user_id'] = id;
            const comment_id = Number(req.body['comment_id']);
            //check if exists
            const lengthish = yield this.Model.projectModel().reactionExist(comment_id, id);
            if (lengthish.length) {
                //update
                yield this.Model.projectModel().reactionCommentUpdate(lengthish[0].id, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Reaction Updated',
                };
            }
            const data = yield this.Model.projectModel().reactionComment(req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'Comment Inserted',
            };
        });
    }
    //add card
    addCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardName = req.body.column_name;
            const checkCard = yield this.Model.projectModel().checkCard(Number(req.body.project_id), req.body.column_name);
            if (checkCard.length) {
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Card Already Exists',
                };
            }
            yield this.Model.projectModel().addCard(req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'New Card Added Successfully',
            };
        });
    }
    //update card position
    updateCardPosition(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch customized columns for the project
            const project_id = Number(req.body.project_id);
            const getMyCustomizedColumns = yield this.Model.projectModel().getCustomizedColumns(project_id);
            const customizedColumns = getMyCustomizedColumns.map((column) => ({
                column_name: column.column_name,
                index_number: column.index_number,
            }));
            // Initial array
            // Define the initial array
            function updateColumnPositions(columns, change) {
                // Create a copy of the original array to avoid modifying the input
                let updatedColumns = [...columns];
                // Find the column to move
                const columnToMove = updatedColumns.find((col) => col.column_name === change.column_name);
                // if (!columnToMove) {
                //   console.error(`Column ${change.column_name} not found`);
                //   return updatedColumns;
                // }
                // Remove the column from its current position
                updatedColumns = updatedColumns.filter((col) => col.column_name !== change.column_name);
                // Insert the column at its new position
                updatedColumns.splice(change.to_position, 0, columnToMove);
                // Update index_number for all columns
                updatedColumns = updatedColumns.map((col, index) => (Object.assign(Object.assign({}, col), { index_number: index })));
                return updatedColumns;
            }
            const change = {
                column_name: req.body.column_name,
                from_position: Number(req.body.from_position),
                to_position: Number(req.body.to_position),
            };
            const result = updateColumnPositions(customizedColumns, change);
            //update
            for (const change of result) {
                const { column_name, index_number } = change;
                // Call your model method to update the position
                yield this.Model.projectModel().updatePosition(project_id, column_name, index_number);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'Project Document Uploaded Successfully',
            };
        });
    }
    //delete card
    deleteCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //check you have the permission to delete the project document
                const status = req.body.status;
                const project_id = Number(req.body.project_id);
                const allTasks = yield this.Model.projectModel().getProjectWisTasks(project_id, status);
                console.log(allTasks);
                const deleteArray = allTasks.map((item) => item.task_id);
                yield this.Model.projectModel().deleteTasks(deleteArray);
                //delete columns
                yield this.Model.projectModel().deleteColumn(project_id, status);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Card Deleted Successfully',
                };
            }));
        });
    }
    deleteTask(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            //check you have the permission to delete the project document
            const task_id = Number(req.body.task_id);
            yield this.Model.projectModel().deleteSingleTask(Number(task_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: 'Task Deleted Successfully',
            };
        });
    }
    // Service method to create a new project documents
    createProjectDocuments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Extract admin and organization details from the request
                const { id, organization_id } = req.employee;
                const user = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                const project_id = Number(req.body.project_id);
                console.log(project_id, req.body);
                req.body['project_id'] = project_id;
                req.body['uploaded_by'] = user.name;
                req.body['uploaded_by_type'] = 'USER';
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
                    from_user: 'EMPLOYEE',
                    type: 'AUTO',
                    details: `${user.name} has uploaded a document`,
                };
                yield this.Model.projectModel().insertProjectTracking(trackingPayload);
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
                // Extract admin and organization details from the request
                const { id, organization_id } = req.employee;
                const user = yield this.Model.employeeModel().getSingleInfoEmployee(id);
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
                    from_user: 'EMPLOYEE',
                    type: 'AUTO',
                    details: `${user.name} Has Updated A Project File.`,
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
                //check you have the permission to delete the project document
                //first you need to check if you are a lead to the project!
                const { id, organization_id } = req.employee;
                //check lead
                const lead = yield this.Model.projectModel(trx).checkLead(req.body.project_id, id);
                if (lead[0].is_lead === false) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: 'You Don"t Have The Permission To Delete The File!',
                    };
                }
                //end of check lead
                // Extract admin and organization details from the request
                const user = yield this.Model.employeeModel().getSingleInfoEmployee(id);
                const document_id = Number(req.params.id);
                console.log(document_id, req.body);
                //insert into project documents
                yield this.Model.projectModel(trx).deleteProjectDocuments(document_id);
                // Insert a tracking entry for the project creation event
                const trackingPayload = {
                    project_id: req.body.project_id,
                    from_user: 'EMPLOYEE',
                    type: 'AUTO',
                    details: `${user.name} Has Updated A Project File.`,
                };
                yield this.Model.projectModel(trx).insertProjectTracking(trackingPayload);
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
                const { id, organization_id } = req.employee;
                //check lead
                const lead = yield this.Model.projectModel(trx).checkLead(req.body.project_id, id);
                if (lead[0].is_lead === false) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: 'You Don"t Have The Permission To Add Or Remove Any Member!',
                    };
                }
                //end of check lead
                const employee_info = yield this.Model.employeeModel().getSingleEmployee({
                    id: Number(req.body['employee_id']),
                });
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
                        from_user: 'EMPLOYEE',
                        type: 'AUTO',
                        details: `${employee_info[0].name} as been assigned to Project With Role Of ${req.body['project_role']}`,
                    };
                    yield this.Model.projectModel().insertProjectTracking(trackingPayload);
                    //end of tracking info
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Employee Has been Added To Project!',
                    };
                }
                if (req.body['type'] === 'remove') {
                    //end of tracking info
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: 'You Don"t Have Permission To Remove Any Employee',
                    };
                }
                if (req.body['type'] === 'lead') {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_FORBIDDEN,
                        message: 'You Don"t Have The Permission To Change Team Leader',
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_FULFILLED,
                    message: 'Employee Has been Removed From Project!',
                };
            }));
        });
    }
    //add tracking to project
    addTrack(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start a new transaction to ensure atomicity
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                // Insert a tracking entry for the project creation event
                //specialized using
                const trackingPayload = {
                    project_id: Number(req.body.project_id),
                    from_user: 'EMPLOYEE',
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
}
exports.default = employeeProjectService;
