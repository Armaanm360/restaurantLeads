import { Knex } from 'knex';

// Db or Transaction connection types
export type TDB = Knex | Knex.Transaction;

// Db or Transaction connection types
export type TDB2 = Knex | Knex.Transaction;

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
export const numRound = (num: any) => {
  const round = Math.round(Number(num || 0));

  return Number(round || 0);
};
export interface ITicket {
  airTicketId?: number;
  airticket_id?: number;
  isDeleted?: number;
  airticket_is_deleted?: number;

  airticket_ticket_no: string;
  airticket_route_or_sector: string[];
  airticket_gross_fare: number;
  airticket_base_fare: number;
  airticket_comvendor: string;
  vendor_name: string;
  airticket_airline_id: number;
  airticket_remarks?: string;
  airticket_commission_percent: number;
  airticket_discount_total: number;
  airticket_extra_fee: number;
  airticket_vat: number;
  airticket_pnr: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_gds: gdsType;
  airticket_segment: number;
  airticket_bd_charge: number;
  airticket_es_charge: number;
  airticket_ut_charge: number;
  airticket_xt_charge: number;
  airticket_e5_charge: number;
  airticket_g4_charge: number;
  airticket_ow_charge: number;
  airticket_p7_charge: number;
  airticket_p8_charge: number;
  airticket_pz_charge: number;
  airticket_qa_charge: number;
  airticket_r9_charge: number;
  airticket_ticket_type: TicketType;
  airticket_classes: ticketClassType;
  total_taxes_commission: number | null;
  passport_id: number;
  passport_no: string;
  passport_name: string;
  passport_person_type: personType;
  passport_email: string;
  passport_mobile_no: string;
  passport_date_of_birth: string; // Assuming ISO8601 date format as string
  passport_date_of_expire: string; // Assuming ISO8601 date format as string
  taxes_commission: ITaxesCommission[];
  flight_details: IFlightDetail[];
}

export interface ITaxesCommission {
  isDelete?: number;
  commissionId?: number;

  airline_commission: number;
  airline_taxes: number;
  airline_tax_type: string;
}

export interface IAddReissueBody {
  invoice_combclient_id: string;
  client_name: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_agent_commission: number;
  invoice_agent_id: number;
  invoice_due_date: string;
  invoice_no: string;
  invoice_note: string;
  tickets: Ticket[];
}

export interface Ticket {
  airTicketId?: number;
  isDeleted?: number;
  existing_airticket_id: number;
  existing_invoiceid: number;
  airticket_ticket_no: string;
  airticket_penalties: number;
  airticket_fare_difference: number;
  airticket_tax_difference: number;
  airticket_classes: string;
  airticket_pnr: string;
  airticket_commission_percent: number;
  airticket_route_or_sector: string[];
  airticket_ait: number;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_extra_fee: number;
  airticket_comvendor: string;
  vendor_name: string;
  passport_name: any;
  airline_name: string;
  airticket_airline_id: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_profit: number;
}
export interface IReissueTicketItem {
  airticket_id?: number;
  airticket_is_deleted?: number;
  airticket_existing_invoice: number;
  airticket_existing_airticket_id: number;
  airticket_client_id: number | null;
  airticket_combined_id: number | null;
  airticket_vendor_id: number | null;
  airticket_vendor_combine_id: number | null;
  airticket_airline_id: number;
  previous_ticket_no: any;
  airticket_ticket_no: string;
  previous_airticket_no?: any;
  airticket_pnr: string;
  airticket_classes: string;
  airticket_penalties: number;
  airticket_fare_difference: number;
  airticket_ait: number;
  airticket_tax_difference: number;
  airticket_commission_percent: number;
  airticket_commission_amount: number;
  airticket_extra_fee: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_profit: number;
  airticket_pax_name: string;
  airticket_sales_date: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_route_or_sector: string;
}

export interface IFlightDetail {
  isDelete?: number;
  flightId?: number;

  fltdetails_from_airport_id: number;
  fltdetails_to_airport_id: number;
  fltdetails_airline_id: number;
  fltdetails_flight_no: string;
  fltdetails_fly_date: string; // Assuming ISO8601 date format as string
  fltdetails_departure_time: string; // Assuming "HH:MM:SS" format
  fltdetails_arrival_time: string; // Assuming "HH:MM:SS" format
}

export type TicketType =
  | 'NEW TKT'
  | 'COD'
  | 'SEAT UPGRADE'
  | 'SEAT ASSIGN'
  | 'EXCESS BAGGAGE'
  | 'IUR TKT'
  | 'Economy'
  | 'EMDA'
  | 'MRI TKT';
export type ticketClassType =
  | 'Economy'
  | 'First'
  | 'Premium Economy'
  | 'Business';
export type personType = 'Adult' | 'Child' | 'Infant';
export type gdsType = 'Amadeus' | 'Galileo' | 'Sabre';

export interface IAirTicketBody extends IInvoiceInfo {
  tickets: ITicket[];
}

export interface IInvoiceInfo {
  invoice_combclient_id: string;
  client_name: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_agent_commission: number;
  invoice_customer_name: string;
  invoice_agent_id: number;
  invoice_due_date: string;
  invoice_show_passport_details: 0 | 1;
  invoice_show_prev_due: 0 | 1;
  invoice_show_unit: 0 | 1;
  invoice_show_discount: 0 | 1;
  invoice_note: string;
  invoice_no: string;
}

export interface IAirTicketBody extends IInvoiceInfo {
  tickets: ITicket[];
}

export interface IInvoiceInfo {
  invoice_combclient_id: string;
  client_name: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_agent_commission: number;
  invoice_customer_name: string;
  invoice_agent_id: number;
  invoice_due_date: string;
  invoice_show_passport_details: 0 | 1;
  invoice_show_prev_due: 0 | 1;
  invoice_show_unit: 0 | 1;
  invoice_show_discount: 0 | 1;
  invoice_note: string;
  invoice_no: string;
}

export const CTimestamp = new Date()
  .toISOString()
  .slice(0, 19)
  .replace('T', ' ');

export const transactionTypes = {
  'INVOICE-AIR TICKET': 1,
  'INVOICE-AIR TICKET NON COM': 2,
  'INVOICE-AIR TICKET REISSUE': 3,
  'INVOICE-OTHERS': 4,
  'INVOICE-VISA': 5,
  'INVOICE-HAJJ': 6,
  'INVOICE-HAJJ PRE REG': 7,
  'INVOICE-UMMRAH': 8,
  'TOUR PACKAGE FARE': 9,
  'VOID CHARGE': 32,
  'REFUND CHARGE': 33,
  'REFUND PENALTIES': 34,
  'INVOICE-HOTELS': 10,
  'INVOICE-ADM/ACM': 11,
  'REFUND-AIR TICKET': 12,
  'REFUND-OTHERS': 13,
  'REFUND-TOUR PACKAGE': 14,
  'EMD-EXTRA SERVICES': 15,
  'VOID-AIR TICKET': 16,
  'MONEY RECEIPT': 17,
  'CLIENT ADVANCE RETURN': 18,
  'BILL ADJUSTMENT': 19,
  'BALANCE TRANSFER': 20,
  'NON INVOICE INCOME': 21,
  INVESTMENT: 22,
  'INCENTIVE INCOME': 23,
  PAYROLL: 24,
  EXPENSE: 25,
  LOAN: 26,
  'OPENING BALANCE': 27,
  'VENDOR PAYMENT': 28,
  'VENDOR ADVANCE RETURN': 29,
  'AGENT COMMISSION': 30,
  'AGENT PAYMENT': 31,
};

export const invCategory = {
  'Air Ticket': 1,
  'Air Ticket-Non Commission': 2,
  'Air Ticket-Reissue': 3,
  Visa: 4,
  'Tour Package': 5,
  Others: 6,
  Umrah: 7,
  'Hajj Pre Registration': 8,
  Hajj: 9,
  Hotels: 10,
};

export const accountHead = {
  Assets: 1,
  'Current Assets(Assets)': 2,
  'Cash(Current Assets)': 3,
  'Petty Cash (Current Assets)': 4,
  'Bank Account(Current Assets)': 5,
  'Mobile Banking(Current Assets)': 6,
  'Accounts Receivables': 7,
  'Advance, Deposit and Prepayment(Current Assets)': 8,
  'Security Deposits(Current Assets)': 9,
  'Non Current Assets(Assets)': 10,
  '(-) Accumulated Depreciation(Non Current Assets)': 11,
  Liabilities: 12,
  'Current Liabilities(Liabilities)': 13,
  'Accounts Payable': 14,
  'Unearned Revenues(Current Liabilities)': 15,
  'Credit Card(Current Liabilities)': 16,
  'Office Rent Payable(Current Liabilities)': 17,
  'Service Charge Payable(Current Liabilities)': 18,
  'Utilities Payable(Current Liabilities)': 19,
  'Salary & Allowance Payable(Current Liabilities)': 20,
  'Festival Bonus Payable(Current Liabilities)': 21,
  'Incentive Payable (Current Liabilities)': 22,
  'AIT  Payable on Salary(Current Liabilities)': 23,
  'Sales Tax Payable(Current Liabilities)': 24,
  'TDS Payable(Current Liabilities)': 25,
  'VAT Payable on Sales(Current Liabilities)': 26,
  'Loans(Current Liabilities)': 27,
  'Short Term Business Loans(Current Liabilities)': 28,
  'Interest Payable(Current Liabilities)': 29,
  'Accrued Liabilities(Current Liabilities)': 30,
  'Sundry Creditors(Current Liabilities)': 31,
  'Deferred Tax (Current Liabilities)': 32,
  'Provisions(Current Liabilities)': 33,
  'Non Current Liabilities(Liabilities)': 34,
  'Notes Payable(Non Current Liabilities)': 35,
  'Mortgage Payable(Non Current Liabilities)': 36,
  'Deferred Tax Payable(Non Current Liabilities)': 37,
  'Bond Payable(Non Current Liabilities)': 38,
  'Short Term Business Loans(Non Current Liabilities)': 39,
  'Long Term Business Loans(Non Current Liabilities)': 40,
  'Owner’s Equity': 41,
  'Contributed Capital(Owner’s Equity)': 42,
  'Retained Earnings(Owner’s Equity)': 43,
  'Preferred Share(Owner’s Equity)': 44,
  'Treasury Share(Owner’s Equity)': 45,
  'Drawings(Owner’s Equity)': 46,
  Income: 47,
  'Sales(Income)': 48,
  '(-) Sales Return(Income)': 49,
  '(-) Sales Discount(Income)': 50,
  'Void Charge': 805,
  'Refund Charge': 807,
  'Emd Sales': 810,
  'Emd Charge': 812,
  Debit: 47,
  'ss(Income)': 48,
  '(-) s Return(Income)': 49,
  '(-) Sales ssss(Income)': 50,
  Expenses: 51,
  'Purchase(Expenses)': 52,
  'Purchases Return(Expenses)': 53,
  'Salary & Allowance(Expenses)': 54,
  'Rent & Utility Expense(Expenses)': 55,
  'Advertisement Expense(Expenses)': 56,
  'Transportation Cost(Expenses)': 57,
  'Depreciation Expense(Expenses)': 58,
  'Entertainment Expense(Expenses)': 59,
  'Mobile &Telephone Bill(Expenses)': 60,
  'Stationery(Expenses)': 61,
  'Stamp(Expenses)': 62,
  'Repair & Maintenance Expense(Expenses)': 63,
  'Lunch Subsidy(Expenses)': 64,
  'Server Bill(Expenses)': 65,
  'Internet Bill(Expenses)': 66,
  'Business Development(Expenses)': 67,
  'Training(Expenses)': 68,
  'Donation(Expenses)': 69,
  'Consultancy(Expenses)': 70,
  'License & Renewal(Expenses)': 71,
  'Legal Expense(Expenses)': 72,
  'Medical Expense(Expenses)': 73,
  'Security Service (Office)(Expenses)': 74,
  'Hosting and Domain(Expenses)': 75,
  'Subscription and Fees(Expenses)': 76,
  'Membership & Publication(Expenses)': 77,
  'Delivery Charge(Expenses)': 78,
  'Courier Service Charge(Expenses)': 79,
  'Postal Expense(Expenses)': 80,
  'Laundry & Cleaning(Expenses)': 81,
  'Liveries and Uniforms(Expenses)': 82,
  'Photocopy (Expenses)': 83,
  'Vehicle Expense(Expenses)': 84,
  'Vehicle Fuel(Expenses)': 85,
  'Repair Vehicle & Maintenance(Expenses)': 86,
  'Tax fees(Expenses)': 87,
  'Insurance   (Expenses)': 88,
  'Bad Debt Expense(Expenses)': 89,
  'Rates and Taxes(Expenses)': 90,
  'Registration Charges(Expenses)': 91,
  'Bank Charges(Expenses)': 92,
  'Bkash Charges(Expenses)': 93,
  'Nagad Charges(Expenses)': 94,
  'Audit Fee(Expenses)': 95,
  'Income Tax Expense(Expenses)': 96,
  'Miscellaneous(Expenses)': 97,
  'Basic Salary(Salary & Allowance)': 98,
  'House Rent Allowance(Salary & Allowance)': 99,
  'Medical Allowance  (Salary & Allowance)': 100,
  'Transport Allowance(Salary & Allowance)': 101,
  'Dearness Allowance(Salary & Allowance)': 102,
  'Over Time Allowance  (Salary & Allowance)': 103,
  'Festival Bonus(Salary & Allowance)': 104,
  'Incentive (Salary & Allowance)': 105,
  'Office Rent(Rent & Utility Expense)': 106,
  'Service Charge(Rent & Utility Expense)': 107,
  'Electricity Bill(Rent & Utility Expense)': 108,
  'Gas Bill(Rent & Utility Expense)': 109,
  'Water Bill(Rent & Utility Expense)': 110,
  'Marketing- Promotion(Advertisement Expense)': 111,
  'Marketing- Boosting(Advertisement Expense)': 112,
  'SMS Charge(Advertisement Expense)': 113,
  'Conveyance (Transportation Cost)': 114,
  'TA/DA Bill(Transportation Cost)': 115,
  'Tours & Travels(Transportation Cost)': 116,
  'Computer & IT Equipment(Depreciation Expense)': 117,
  'Furniture & Fixture(Depreciation Expense)': 118,
  'Office Equipment(Depreciation Expense)': 119,
  'Land & Building(Depreciation Expense)': 120,
  'Interior Decoration(Depreciation Expense)': 121,
  'Books(Depreciation Expense)': 122,
  'Vehicles(Depreciation Expense)': 123,
  'Software Aquired (Trabill)(Depreciation Expense)': 124,
  'Parties & Dinner(Entertainment Expense)': 125,
  'Office Contingency(Entertainment Expense)': 126,
  'Refreshment(Entertainment Expense)': 127,
  'Telephone (BTCL)(Mobile &Telephone Bill)': 128,
  'Telephone(Brilliant/Inter cloud)(Mobile &Telephone Bill)': 129,
  'Mobile Recharge(Mobile &Telephone Bill)': 130,
  'Printing Stationery(Stationery)': 131,
  'Office Stationery(Stationery)': 132,
  'Adhesive Stamp(Stamp)': 133,
  'Non – Judicial Stamp(Stamp)': 134,
  'Revenue Stamp(Stamp)': 135,
  'Repair-Computer & IT Equipment(Repair & Maintenance Expense)': 136,
  'Repair-Furniture& Fixture(Repair & Maintenance Expense)': 137,
  'Repair-Office Equipment(Repair & Maintenance Expense)': 138,
  'Air Ticket(Accounts Payable)': 139,
  'Air Ticket(Accounts Receivables)': 140,
  'Air Ticket(Sales)': 141,
  'Air Ticket((-) Sales Return)': 142,
  'Air Ticket((-) Sales Discount)': 143,

  'Air Ticket(Purchase)': 144,
  'Air Ticket(Purchases Return)': 145,
  'Air Ticket-Non Commission(Accounts Payable)': 146,
  'Air Ticket-Non Commission(Accounts Receivables)': 147,
  'Air Ticket-Non Commission(Sales)': 148,
  'Air Ticket-Non Commission((-) Sales Return)': 149,
  'Air Ticket-Non Commission((-) Sales Discount)': 150,
  'Air Ticket-Non Commission(Purchase)': 151,
  'Air Ticket-Non Commission(Purchases Return)': 152,
  'Air Ticket-Reissue(Accounts Payable)': 153,
  'Air Ticket-Reissue(Accounts Receivables)': 154,
  'Air Ticket-Reissue(Sales)': 155,
  'Air Ticket-Reissue((-) Sales Return)': 156,
  'Air Ticket-Reissue((-) Sales Discount)': 157,
  'Air Ticket-Reissue(Purchase)': 158,
  'Air Ticket-Reissue(Purchases Return)': 159,
  'Visa(Accounts Payable)': 160,
  'Visa(Accounts Receivables)': 161,
  'Visa(Sales)': 162,
  'Visa((-) Sales Return)': 163,
  'Visa((-) Sales Discount)': 164,
  'Visa(Purchase)': 165,
  'Visa(Purchases Return)': 166,
  'Tour Package(Accounts Payable)': 167,
  'Tour Package(Accounts Receivables)': 168,
  'Tour Package(Sales)': 169,
  'Tour Package((-) Sales Return)': 170,
  'Tour Package((-) Sales Discount)': 171,
  'Tour Package(Purchase)': 172,
  'Tour Package(Purchases Return)': 173,
  'Umrah(Accounts Payable)': 174,
  'Umrah(Accounts Receivables)': 175,
  'Umrah(Sales)': 176,
  'Umrah((-) Sales Return)': 177,
  'Umrah((-) Sales Discount)': 178,
  'Umrah(Purchase)': 179,
  'Umrah(Purchases Return)': 180,
  'Hajj Pre Registration(Accounts Payable)': 181,
  'Hajj Pre Registration(Accounts Receivables)': 182,
  'Hajj Pre Registration(Sales)': 183,
  'Hajj Pre Registration((-) Sales Return)': 184,
  'Hajj Pre Registration((-) Sales Discount)': 185,
  'Hajj Pre Registration(Purchase)': 186,
  'Hajj Pre Registration(Purchases Return)': 187,
  'Hajj(Accounts Payable)': 188,
  'Hajj(Accounts Receivables)': 189,
  'Hajj(Sales)': 190,
  'Hajj((-) Sales Return)': 191,
  'Hajj((-) Sales Discount)': 192,
  'Hajj(Purchase)': 193,
  'Hajj(Purchases Return)': 194,
  'Hotels(Accounts Payable)': 195,
  'Hotels(Accounts Receivables)': 196,
  'Hotels(Sales)': 197,
  'Hotels((-) Sales Return)': 198,
  'Hotels((-) Sales Discount)': 199,
  'Hotels(Purchase)': 200,
  'Hotels(Purchases Return)': 201,
  'Transport/Car(Accounts Payable)': 202,
  'Transport/Car(Accounts Receivables)': 203,
  'Transport/Car(Sales)': 204,
  'Transport/Car((-) Sales Return)': 205,
  'Transport/Car((-) Sales Discount)': 206,
  'Transport/Car(Purchase)': 207,
  'Transport/Car(Purchases Return)': 208,
  'Food(Accounts Payable)': 209,
  'Food(Accounts Receivables)': 210,
  'Food(Sales)': 211,
  'Food((-) Sales Return)': 212,
  'Food((-) Sales Discount)': 213,
  'Food(Purchase)': 214,
  'Food(Purchases Return)': 215,
  'Others(Accounts Payable)': 216,
  'Others(Accounts Receivables)': 217,
  'Others(Sales)': 218,
  'Others((-) Sales Return)': 219,
  'Others((-) Sales Discount)': 220,
  'Others(Purchase)': 221,
  'Others(Purchases Return)': 222,
  'Refund Penalties': 806,
  'Emd Purchase': 811,
};
