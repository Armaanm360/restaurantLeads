import { Knex } from 'knex';

// Db or Transaction connection types
export type TDB = Knex | Knex.Transaction;

// user admin types

export interface ICreateRole {
  id: number;
  name: string;
}
export interface IAdmin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: 0 | 1;
  type: string;
  device_token?: string;
  role: number;
}

export interface IAdministration {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  status: 0 | 1;
  type: string;
  device_token?: string;
  role: number;
}

export interface ICreateOrgPermissionGroup {
  organization_id: Number;
  permission_group_id: Number;
}

// user member types
export interface IEmployee {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  level: number;
  association_id: number;
  organization_id: number;
  team_id: number;
  shift_id: number;
  shift_name: string;
  device_token: string;
  shift_start: string;
  shift_end: string;
}
export interface IAgent {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  designation: string;
  level: number;
  association_id: number;
  organization_id: number;
  team_id: number;
  shift_id: number;
  shift_name: string;
  device_token: string;
  shift_start: string;
  shift_end: string;
}

export interface ICreatePermissionGroup {
  name: string;
}
export interface ICreatePermission {
  permission_group_id: Number;
  name: string;
}
export interface IUpc {
  id: number;
  name: string;
  photo: string;
  email: string;
  phone: string;
  status: string;
  association_id: number;
}
export interface IServiceCenter {
  admin_id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  type: string;
  qr_code: string;
  service_center_id: number;
}

export interface IManagement {
  id: number;
  name: string;
  email: string;
}

// forget password props interface
export interface IForgetPassProps {
  password: string;
  table: string;
  passField: string;
  userEmailField: string;
  userEmail: string;
}

// user member registration types
export interface IRegistration {
  name: string;
  username: string;
  designation: string;
  level: number;
  email: string;
  password: string;
  phone: string;
  association_id: number;
}
// upser employee current location

export interface IUpdaSertEmployeeCurrentLocation {
  employee_id: number;
  latitude: number;
  longitude: number;
  timestamp?: Date;
  accuracy?: number;
  location_type?: string;
  device_id?: string;
  ip_address?: string;
}

export interface IUpdateWorkLog {
  team_leader_verification: boolean;
  remarks: string;
}
export interface IUpdateWorkLogEmployee {
  activity_description: string;
}

export interface ICreateTeams {
  team_name: string;
  association_id: number;
}
export interface ICreateVerifier {
  team_id: number;
  employee_id: number;
}
export interface IAssignTeamEmployee {
  team_id: number;
  emp_id: number;
}
export interface IAssignTeamEmployeeOtherTeam {
  user_id: number;
}

export interface ICreateActivity {
  employee_id: number;
  team_id: number;
  organization_id: number;
  log_datetime: string;
  activity_description: string;
}
export interface ICreateAdmin {
  user_id: number;
  team_id: number;
}
export interface ICreateLeaveType {
  name: string;
  deduct_from_allowance: any;
  is_enabled: any;
  tag_color: any;
  organization_id: number;
}
export interface ICreateDiscussion {
  posted_from: string;
  user_id: number;
  discussion: string;
  status: string;
}
export interface ICreateMeal {
  description: string;
  cost: any;
}
export interface ICreateMealPlan {
  meal_date: string;
  meal_id: number;
}

export interface MealInfo {
  meal_date: Date;
  ordered_meal: string | null;
  is_paid: boolean | null;
  cost: number | null;
}
export interface ISelectMyPlanItems {
  meal_trx_id: number;
  meal_id: any;
  quantity: number;
  cost: string;
}
export interface ISelectMyPlan {
  employee_id: number;
  meal_date: any;
  organization_id: number;
  meal_token: string;
}
export interface ICreateRequisitionItems {
  name: string;
  description: string;
  category?: string;
  price?: any;
  quantity?: Number;
}
export interface ICreateRequisitionTrack {
  requisition_id: Number;
  status: string;
  track_description?: string;
}

export interface ICreateRequisition {
  user_id: number;
  item_id: number;
  quantity: number;
  rejection_reason?: string;
  organization_id?: number;
  require_reason?: string;
  status?: string;
}
export interface IUpdateRequisition {
  item_id?: number;
  quantity?: number;
  rejection_reason?: string;
  organization_id?: number;
  require_reason?: string;
  status?: string;
  approved_by?: number;
  approved_at?: string;
  fulfilled_by?: string;
  fulfilled_at?: string;
}
export interface IInsertInventoryItems {
  item_id: number;
  transaction_type?: string;
  quantity?: string;
  subtotal?: string;
  transaction_date?: string;
  created_by?: number;
  remarks?: string;
}

export interface ICreatePoll {
  title: string;
  image?: string | null;
  poll_type: string;
  allow_multiple_answers?: boolean;
  close_poll_on_schedule?: boolean;
  schedule_close_time?: Date | null;
  organization_id?: number | null;
  is_deleted?: boolean;
  result_visibility?: 'always_public' | 'public_after_end_date' | 'private';
}
export interface ICastMyVote {
  poll_id: number;
  option_id: number;
  employee_id: number;
}
export interface IUpdateDiscussion {
  posted_from: string;
  user_id: number;
  discussion: string;
  status: string;
}
export interface ICreateComment {
  discussion_id: number;
  parent_comment_id: number;
  comment: string;
}
export interface ICreatePayment {
  from_date: string;
  to_date: string;
  employee_id: number;
}
export interface ICreateOption {
  poll_id: number;
  option_text: string;
}
export interface IGETREplies {
  comment_id: number;
  comment: string;
  parent_comment_id?: number | null;
  replies?: Comment[];
}
export interface ICreatePaymentType {
  voucher_id: string;
  total_paid: any;
  organization_id: number;
  payment_date: any;
  received_by: number;
  employee_id: number;
}
export interface ICreatePaymentItem {
  payment_id: number;
  meal_id: number;
  meal_date: any;
  meal_quantity: number;
  cost: any;
}
export interface ICreatePermissions {
  user_id: number;
  team_id: number;
}

export interface ICreatePermissions {
  item_invoice_id: number;
  item_food_id: number;
  item_quantity: number;
  item_price: number;
  item_total: number;
}

export interface ICreateShift {
  user_id: number;
  shift_name: string;
  start_time: any;
  end_time: any;
  days_of_week: string;
}

export interface ICreateShift {
  shift_name: string;
  start_time: any;
  end_time: any;
  days_of_week: string;
}

export interface ICreateEmployeeShift {
  id: number;
  organization_id: number;
  shift_name: string;
  shift_start: string;
  shift_end: string;
}
export interface IUpdateOrganization {
  name: string;
  website?: string;
  phone: string;
  country_id?: number;
  city_id?: number;
  address: string;
  postal_code: string;
  logo: string;
  email: string;
  leave_allowance: number;
}
export interface IUpdateEmployeeShift {
  shift_name: string;
  shift_start: string;
  shift_end: string;
}

export interface ICreateQuestions {
  question: string;
  provided_for: number;
  evaluation_id: number;
}

export interface ICreateEvaluation {
  evaluation_code: string;
  evaluation_description: string;
  evaluation_date_start: string;
  evaluation_date_end: string;
  association_id: number;
  team_id: number;
  evaluation_name: string;
  status: string;
}
export interface ICreateEvaluationTeam {
  evaluation_id: number;
  team_id: number;
}
export interface IUpdateTeamWiseEvaluation {
  evaluation_id: number;
  status: string;
}

export interface ICreateEvaluationTemplate {
  template_code: string;
  template_description: string;
  association_id: number;
  template_name: string;
  status: string;
}

export interface ICreateEvaluationResponse {
  evaluation_id: number;
  evaluate_by: number;
  evaluate_to: number;
  question_id: number;
  response: string;
  option_id: number;
  mark: number;
  evaluated: any;
}

export interface ICreateEvaluationResponsev2 {
  evaluation_id: number;
  evaluate_by: number;
  evaluate_to: number;
  question_id: number;
  response_id: string;
  response: string;
  mark: number;
  evaluated: any;
}

// login interface
export interface ILogin {
  email: string;
  password: string;
  device_token?: string;
}

export interface IPromiseRes<T> {
  success: boolean;
  message?: string;
  code: number;
  data?: T;
}

export interface IChangePassProps {
  password: string;
  passField: string;
  table: string;
  schema: string;
  userIdField: string;
  userId: number;
}
export interface IUpdateChangePassModelProps {
  hashedPass: string;
  passField: string;
  table: string;
  schema: string;
  userIdField: string;
  userId: number;
}

// verify password props interface
export interface IVerifyPassProps {
  oldPassword: string;
  userId: number;
  schema: string;
  table: string;
  passField: string;
  userIdField: string;
}

export interface IVerifyModelPassProps {
  schema: string;
  userId: number;
  table: string;
  passField: string;
  userIdField: string;
}

export interface ICreateQuestionV2 {
  question: string;
  provided_by: number;
  provided_for: number;
  evaluation_id: number;
}
export interface ICreateQuestionTemplate {
  question: string;
}

export interface ICreateOption {
  question_v2_id: number;
  options: string;
  option_mark: number;
}
export interface ICreateOptionTemplate {
  question_id: number;
  option_name: string;
  option_mark: number;
}
export interface ICreateNotification {
  message?: string;
  type?: string;
  ref_id?: number;
  deleted?: any;
  for_all?: any;
}
export interface ICreateNotificationSeen {
  notification_id: number;
  user_id: number;
}
export interface ICreateNotificationEmployee {
  notification_id: number;
  user_id: number;
}
interface Meeting {
  id: number;
  title: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time: string;
}

interface QueryParams {
  search?: string;
  limit?: string;
  skip?: string;
}

interface CustomRequest extends Request {
  employee: {
    id: number;
    organization_id: number;
  };
  query: QueryParams;
}

// forget password props interface
export interface IForgetPassProps {
  password: string;
  table: string;
  passField: string;
  userEmailField: string;
  userEmail: string;
}
