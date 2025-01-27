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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class adminProjectModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //create project
    createProject(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects')
                .withSchema(this.PM_SCHEMA)
                .insert(payload)
                .returning('*');
            return project;
        });
    }
    //update card position
    updatePosition(project_id, column_name, index_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_columns')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ column_name })
                .update({ index_number });
            return project;
        });
    }
    //add card
    addCard(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_columns')
                .withSchema(this.PM_SCHEMA)
                .insert(payload);
            return project;
        });
    }
    //check if card exists or not
    checkCard(project_id, column_name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the column already exists for the given project
            const project = yield this.db('project_columns')
                .withSchema(this.PM_SCHEMA)
                .where({
                project_id,
                column_name, // Filter by column_name
            })
                .select('id'); // Select the column 'id' (or any other fields if needed)
            return project; // Return the result
        });
    }
    //create new task part
    createNewTaskPart(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('task_part')
                .withSchema(this.PM_SCHEMA)
                .insert(payload)
                .returning('*');
            return project;
        });
    }
    updateTask(task, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_task')
                .withSchema(this.PM_SCHEMA)
                .where('id', task)
                .update(payload);
            return project;
        });
    }
    //create new task
    createNewTask(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_task')
                .withSchema(this.PM_SCHEMA)
                .insert(payload)
                .returning('*');
            return project;
        });
    }
    //create new comment
    createComment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('task_comments')
                .withSchema(this.PM_SCHEMA)
                .insert(payload)
                .returning('*');
            return comment;
        });
    }
    //update comment
    updateComment(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('task_comments')
                .withSchema(this.PM_SCHEMA)
                .where('id', id)
                .update(payload);
            return comment;
        });
    }
    //delete comment
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('task_comments')
                .withSchema(this.PM_SCHEMA)
                .where('id', id)
                .delete();
            return comment;
        });
    }
    //reactionComment
    reactionComment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment_reactions')
                .withSchema(this.PM_SCHEMA)
                .insert(payload);
            return comment;
        });
    }
    //reactionComment
    reactionCommentUpdate(reaction_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment_reactions')
                .withSchema(this.PM_SCHEMA)
                .where({ id: reaction_id })
                .update(payload);
            return comment;
        });
    }
    //reaction length
    reactionExist(comment_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment_reactions')
                .withSchema(this.PM_SCHEMA)
                .where({ comment_id })
                .andWhere({ user_id })
                .select('*');
            return comment;
        });
    }
    insertNewTaskTrack(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('task_tracking')
                .withSchema(this.PM_SCHEMA)
                .insert(payload)
                .returning('*');
            return project;
        });
    }
    //add employee to the project
    addTeamMembersToProject(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .insert(payload);
            return project;
        });
    }
    //get existing project info
    getEmployeesByProjectId(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .select('*');
        });
    }
    //get all my existing projects
    getSingleTask(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_task as pt')
                .withSchema(this.PM_SCHEMA)
                .where('pt.id', task_id)
                .select('*');
        });
    }
    getAllComments(user_id, task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('comments_view as tc')
                .withSchema(this.PM_SCHEMA)
                .select('tc.comment_id as id', 'tc.comment', 'tc.created_at', 'tc.reaction_counts', 'tc.user_name as name', 'tc.photo', this.db.raw(`CASE WHEN tc.user_id = ? THEN true ELSE false END as editable`, [user_id]))
                .where('tc.task_id', task_id)
                .orderBy('tc.comment_id', 'DESC');
        });
    }
    getSingleTaskHistory(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('task_tracking as tt')
                .withSchema(this.PM_SCHEMA)
                .where('tt.task_id', task_id)
                .select('*');
        });
    }
    //get single task
    getMyAssignedProjects(organization_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_team as pt')
                .withSchema(this.PM_SCHEMA)
                .where('pt.employee_id', employee_id)
                .andWhere('p.organization_id', organization_id)
                .leftJoin('projectview as p', 'p.project_id', '=', 'pt.project_id')
                .select('*');
        });
    }
    //get all my existing project wise task parts
    getTaskWiseParts(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('task_part as tp')
                .withSchema(this.PM_SCHEMA)
                .where('tp.project_id', project_id)
                .select('*');
        });
    }
    getLastTaskStatus(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_task')
                .withSchema(this.PM_SCHEMA)
                .where('id', task_id)
                .select('*');
        });
    }
    // public async getPartWiseTasks(part_id: number) {
    //   return await this.db('project_task as tp')
    //     .withSchema(this.PM_SCHEMA)
    //     .where('tp.part_id', part_id)
    //     .select('*');
    // }
    getPartWiseTasks(part_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('projects as p')
                .withSchema(this.PM_SCHEMA)
                .leftJoin('task_part as tp', 'tp.project_id', '=', 'p.id')
                .leftJoin('project_task as pt', 'pt.part_id', '=', 'tp.id')
                .joinRaw('JOIN crm.employee AS employee ON pt.assign_to = employee.id')
                .where('p.id', part_id)
                .select('pt.id', 'pt.serial_number', 'tp.part_name', 'pt.part_id', 'pt.assign_to', 'pt.assigned_by', 'pt.status', 'pt.priority_flag', 'pt.start_time', 'pt.test_time', 'pt.done_time', 'pt.due_time', 'pt.created_at', 'pt.details', 'pt.title', 'employee.name as employee_name', 'employee.photo as employee_photo');
        });
    }
    //get project id
    getProjectInfo(part_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('task_part as p')
                .withSchema(this.PM_SCHEMA)
                .select('*')
                .where({ id: part_id });
        });
    }
    //customizaed columns
    getCustomizedColumns(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_columns')
                .withSchema(this.PM_SCHEMA)
                .select('*')
                .where({ project_id: project_id });
        });
    }
    //get project info task/partwise
    // Get project info task/partwise based on task_id or project_id
    getTaskOrProjectInfo(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the query
            return yield this.db('project_task_part_view')
                .withSchema(this.PM_SCHEMA)
                .select('*')
                .where({ task_id });
        });
    }
    getProjectWisTasks(project_id, task_status) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start building the query
            let query = this.db('project_task_part_view')
                .withSchema(this.PM_SCHEMA)
                .select('*')
                .where({ project_id })
                .andWhere({ task_status });
            return yield query;
        });
    }
    //batch array delete tasks
    deleteTasks(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the query
            return yield this.db('project_task')
                .withSchema(this.PM_SCHEMA)
                .whereIn('id', task_id)
                .delete();
        });
    }
    //delete Single Task
    deleteSingleTask(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the query
            return yield this.db('project_task')
                .withSchema(this.PM_SCHEMA)
                .where('id', task_id)
                .delete();
        });
    }
    //batch array delete tasks
    deleteColumn(project_id, column_name) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the query
            return yield this.db('project_columns')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ column_name: column_name })
                .delete();
        });
    }
    //add employee to the project
    removeTeamMemberProject(project_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ employee_id })
                .delete();
            return project;
        });
    }
    leadTeamMemberProject(project_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ employee_id })
                .update({ is_lead: true });
            return project;
        });
    }
    reverseTeamLead(project_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentLead = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id, is_lead: true })
                .first();
            if (currentLead) {
                if (currentLead.employee_id === employee_id) {
                    return 'already assigned';
                }
                // Remove lead status from current lead
                yield this.db('project_team')
                    .withSchema(this.PM_SCHEMA)
                    .where({ project_id, employee_id: currentLead.employee_id })
                    .update({ is_lead: false });
            }
            // Assign new lead
            const updatedRows = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id, employee_id })
                .update({ is_lead: true });
            if (updatedRows === 0) {
                throw new Error('Employee not found in the project team');
            }
            return updatedRows;
        });
    }
    //insert project tracking
    insertProjectTracking(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('project_tracking')
                .withSchema(this.PM_SCHEMA)
                .insert(payload);
            return project;
        });
    }
    //update updateProject
    updateProject(project_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects')
                .withSchema(this.PM_SCHEMA)
                .where({ id: project_id })
                .update(payload);
            return project;
        });
    }
    //insert project documents
    insertProjectDocuments(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects_documents')
                .withSchema(this.PM_SCHEMA)
                .insert(payload);
            return project;
        });
    }
    //update project documents
    updateProjectDocuments(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects_documents')
                .withSchema(this.PM_SCHEMA)
                .where({ id: id })
                .update(payload);
            return project;
        });
    }
    //delete project documents
    deleteProjectDocuments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects_documents')
                .withSchema(this.PM_SCHEMA)
                .where({ id: id })
                .delete();
            return project;
        });
    }
    //check employee already exists
    checkEmployeeAlreadyExists(project_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ employee_id })
                .select('*');
            return employee;
        });
    }
    //check employee already exists
    deleteProject(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('projects')
                .withSchema(this.PM_SCHEMA)
                .where({ id: project_id })
                .update({ is_deleted: true });
            return employee;
        });
    }
    //get single project
    getSingleProject(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projectview')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .select('*');
            return project[0];
        });
    }
    //delete single project
    deleteSingleProject(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield this.db('projects')
                .withSchema(this.PM_SCHEMA)
                .where({ id: project_id })
                .update('is_deleted', true);
            return project;
        });
    }
    //get all projects
    // retrieve sources from db
    getAllProjects(organization_id, { limit, skip, project_name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('projectview');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.PM_SCHEMA)
                .select('project_id', 'project_code', 'project_name', 'project_details', 'start_date', 'initial_complete_date', 'closed_date', 'created_by', 'created_by_name', 'organization_id', 'logo', 'status', 'created_at')
                .orderBy('project_id', 'desc')
                .where({ organization_id })
                .andWhere(function (queryBuilder) {
                if (project_name) {
                    queryBuilder.andWhere('project_name', 'ILIKE', `%${project_name}%`);
                }
            });
            const total = yield this.db('projectview')
                .count('project_id as total')
                .withSchema(this.PM_SCHEMA)
                .where({ organization_id })
                .andWhere(function (queryBuilder) {
                if (project_name) {
                    queryBuilder.andWhere('project_name', 'ILIKE', `%${project_name}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    //check project lead
    checkLead(project_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .andWhere({ employee_id })
                .select('is_lead');
        });
    }
    //get project wise members
    getProjectWiseMembers(project_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('project_team')
                .withSchema(this.PM_SCHEMA)
                .where({ project_id })
                .select('employee_id');
        });
    }
}
exports.default = adminProjectModel;
