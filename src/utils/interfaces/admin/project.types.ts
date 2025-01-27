export interface ICreateProject {
  name: string;
  details?: string;
  start_date: string;
  initial_complete_date?: string;
  discussion?: number;
}
export interface IAddCard {
  project_id: number;
  column_name?: string;
  index_number: number;
}
export interface ICreateNewTaskPart {
  project_id: number;
  part_name?: string;
  assigned_by: number;
  task_group?: string;
  details?: string;
}
export interface IUpdateTask {
  status?: string;
  assign_to?: number;
  title?: string;
  details?: string;
}
export interface ICreateNewTask {
  serial_number?: number;
  part_id?: number;
  assign_to?: number;
  status?: string;
  test_time?: string;
  start_time?: string;
  done_time?: string;
  due_time?: string;
  created_at?: string;
  title?: string;
}
export interface ICreateNewComment {
  comment?: string;
}
export interface ICreateNewReaction {
  comment_id?: number;
  user_id?: number;
  reaction?: string;
}
export interface IAddTeamMemberToProject {
  employee_id: number;
  project_role?: string;
  project_id?: number;
}

export interface IInsertProjectTracking {
  project_id: number;
  details?: string;
}

export interface IInsertProjectDocuments {
  name: string;
  filename?: string;
}
