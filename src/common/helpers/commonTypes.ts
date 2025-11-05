import {
  gdsType,
  IInvoiceInfo,
  ITicket,
  personType,
  ticketClassType,
  TicketType,
} from '../types/commonTypes';

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
export interface ICtransInv {
  invoice_no: string;
  tr_type: number;
  dis_tr_type: number;
  ctrxn_pnr?: string;
  ctrxn_route?: string | null;
  ticket_no?: string;
  note?: string;
  ctrxn_pax?: string;
  ctrxn_journey_date: string | null;
  ctrxn_return_date: string | null;
}

export interface IComTrxn {
  comtrxn_airticket_no?: string;
  comtrxn_route?: string;
  comtrxn_pax?: string;
  comtrxn_pnr?: string;
  comtrxn_voucher_no?: string;
  comtrxn_ref_id?: number;
  comtrxn_journey_date?: string | null;
  comtrxn_return_date?: string | null;
  comtrxn_type: string;
  comtrxn_comb_id: number;
  comtrxn_particular_id: number;
  comtrxn_amount: number;
  comtrxn_note: string;
  comtrxn_created_at: string;
  comtrxn_pay_type?: string;
}

export interface IComTrxnDb extends IComTrxn {
  comtrxn_agency_id: number;
  comtrxn_user_id: number;
}

export interface IClTrxnBody {
  client_id: number | null;
  combined_id: number | null;
  ctrxn_voucher?: string;
  ctrxn_ref_id?: number;
  ctrxn_airticket_no?: string;
  ctrxn_route?: string | null;
  ctrxn_pnr?: string;
  ctrxn_pax?: string;
  ctrxn_pay_type?: string;
  ctrxn_type: 'DEBIT' | 'CREDIT';
  ctrxn_amount: number;
  ctrxn_particular_id: number;
  ctrxn_note: string;
  ctrxn_created_at: string;
  ctrxn_journey_date?: string | null;
  ctrxn_return_date?: string | null;
}

export interface IClTrxn
  extends Omit<IClTrxnBody, 'ctrxn_cl' | 'client_id' | 'combined_id'> {
  ctrxn_cl_id: number;
  ctrxn_user_id: number;
  ctrxn_agency_id: number;
}

export interface IClTrxnUpdate
  extends Omit<
    IClTrxnBody,
    'ctrxn_user_id' | 'ctrxn_voucher' | 'ctrxn_ref_id'
  > {
  transId: number;
}

export interface IUpdateCTrxn {
  p_trxn_id: number;
  p_client_id: number;
  p_voucher?: string;
  p_airticket_no: string;
  p_route?: string | null;
  p_pax?: string | null;
  p_pnr?: string;
  p_type: 'DEBIT' | 'CREDIT';
  p_amount: number;
  p_particular_id: number;
  p_note: string;
  p_pay_type?: string;
  p_created_at: string;
}

export interface IVTrxn {
  com_vendor: string;
  vtrxn_voucher?: string;
  vtrxn_airticket_no?: string;
  vtrxn_pax?: string | null;
  vtrxn_route?: string | null;
  vtrxn_pnr?: string;
  vtrxn_type: 'CREDIT' | 'DEBIT';
  vtrxn_amount: number;
  vtrxn_particular_id: number;
  vtrxn_note: string;
  vtrxn_created_at: string;
  vtrxn_pay_type?: string;
  vtrxn_ref_id?: number;
}

export interface IVTrxnDb extends Omit<IVTrxn, 'com_vendor'> {
  vtrxn_v_id: number | any;
  vtrxn_user_id: number;
  vtrxn_agency_id?: number;
}

export interface IUpdateVTrxn extends Omit<IVTrxnDb, 'vtrxn_agency_id'> {
  p_trxn_id: number;
}

export interface IVTrxnUpdate
  extends Omit<IVTrxn, 'com_vendor' | 'vtrxn_voucher' | 'vtrxn_ref_id'> {
  trxn_id: number;
  vendor_id?: number;
  combined_id?: number;
  com_vendor?: string;
}

export interface IUpdateCombTrxn {
  p_trxn_id: number;
  p_airticket_no?: string;
  p_voucher_no?: string;
  p_pnr?: string;
  p_route?: string | null;
  p_type: 'DEBIT' | 'CREDIT';
  p_comb_id: any;
  p_particular_id: number;
  p_amount: number;
  p_note: string;
  p_create_at: string;
  p_pax: string;
  p_pay_type?: string;
}

export interface IAccTrxn {
  acctrxn_ac_id: number;
  acctrxn_pay_type: number;
  acctrxn_particular_id: number;
  acctrxn_type: 'DEBIT' | 'CREDIT';
  acctrxn_amount: number;
  acctrxn_lbalance: number;
  acctrxn_note?: string;
  acctrxn_created_at: string;
  acctrxn_created_by: number;
}

export interface IAcTrxn extends Omit<IAccTrxn, 'acctrxn_lbalance'> {
  acctrxn_voucher?: string;
}
export interface IAcTrxnUpdate extends IAcTrxn {
  trxn_id: number;
}

export interface IUpdateAccTrxn {
  p_trxn_id: number;
  p_ac_id: number;
  p_pay_type: number;
  p_particular_id: number;
  // p_particular_type: string;
  p_type: 'DEBIT' | 'CREDIT';
  p_amount: number;
  p_note: string;
  p_created_at: string;
}
export interface IInvoiceInfoDb {
  invoice_org_agency: number;
  invoice_category_id: number;
  invoice_no: string;
  invoice_client_id: number | null;
  invoice_combined_id: number | null;
  invoice_customer_name?: string;
  invoice_sales_man_id: number;
  invoice_agent_id?: number;
  invoice_sub_total: number;
  invoice_discount?: number;
  invoice_service_charge?: number;
  invoice_net_total: number;
  invoice_purchase_total: number;
  invoice_agent_commission?: number;
  invoice_total_profit: number;
  invoice_show_discount?: 0 | 1;
  invoice_show_passport_details?: 0 | 1;
  invoice_show_prev_due?: 0 | 1;
  invoice_show_unit?: 0 | 1;
  invoice_note: string;
  invoice_sales_date: string;
  invoice_due_date?: string;
  invoice_created_by: number;
  is_quotation?: 0 | 1;
  invoice_type?: 'NEW' | 'EXISTING' | 'IUR' | 'PNR' | 'MANUAL' | 'MRI';
}

export interface IAirTicketBody extends IInvoiceInfo {
  tickets: ITicket[];
}

export interface IAirTicketPax extends IUpdateAirTicketPax {
  p_invoice_id: number;
  p_airticket_id?: number;
}
export interface IUpdateAirTicketPax {
  p_passport_id?: number;
  p_passport_no?: string;
  p_passport_name?: string;
  p_passport_type?: personType | null;
  p_mobile_no?: string;
  p_email: string;
}

export interface IFlightDetail {
  fltdetails_id?: number;
  is_deleted?: number;
  fltdetails_from_airport_id: number;
  fltdetails_to_airport_id: number;
  fltdetails_airline_id: number;
  fltdetails_flight_no: string;
  fltdetails_fly_date: string;
  fltdetails_departure_time: string;
  fltdetails_arrival_time: string;
}
export interface IFlightDetailsDb extends IFlightDetail {
  fltdetails_airticket_id: number;
  fltdetails_invoice_id: number;
}

export interface IRefundDb {
  com_client: string;
  client_id: number | null;
  combined_id: number | null;
  refund_by: number;
  refund_date: string;
  refund_note: string;
  voucher_no: string;
  sales_price: number;
  purchase_price: number;
  total_penalties: number;
  client_extra_fee: number;
  rf_type: 'AIR_TICKET' | 'OTHERS';
  client_refund_amount: number;
  vendor_refund_amount: number;
  created_by: number;
  org_agency: number;
}
export interface IRefundItem {
  id?: number;
  isDelete?: number;
  airticket_id: number;
  invoice_id: number;
  penalties: number;
  client_extra_fee: number;
  vendor_name: string;
}

export interface UploadedFile {
  name: string;
  data: Buffer;
  size: number;
  encoding: string;
  tempFilePath?: string;
  truncated: boolean;
  mimetype: string;
  md5?: string;
  mv: (path: string, callback?: (err?: any) => void) => Promise<void>;
}
export interface IPaymentDB {
  agency_id: number;
  voucher_no: string; // Max length 25
  comb_vendor: string; // Max length 50
  vendor_id: number | null;
  combined_id: number | null;
  vendor_trxn_id: number | null;
  combined_trxn_id: number | null;
  bsp_period: string; // Max length 50
  payment_date: string; // Timestamp
  payment_to: 'OVERALL' | 'TICKET'; // Enum type
  payment_type: any; // TinyInt
  payment_cheque_id: number | null;
  transaction_no?: string; // Optional, Max length 100
  account_id: number;
  account_vou1: number | null;
  account_vou2: number | null;
  payment_by: number;
  payment_total: number; // Decimal(10,2)
  payment_note: string; // Optional, Text
  bank_name: string; // Optional, Max length 100
  cheque_number: string; // Optional, Max length 50
  cheque_date: string; // Optional, Timestamp
  withdraw_date: string; // Optional, Timestamp
  created_by: number;
}
export interface IRefundItemDb extends Omit<IRefundItem, 'vendor_name'> {
  refund_id: number;
  sale_return_vou1: number;
  sale_return_vou2: number;
  purchase_return_vou1: number;
  purchase_return_vou2: number;
  penalty_vou_1: number | null;
  penalty_vou_2: number | null;
  extra_fee_vou_1?: number | null;
  extra_fee_vou_2?: number | null;
  v_penalty_trans_id?: number | null;
  cl_extra_fee_trans_id?: number | null;
  clTransId: number | null;
  clComTransId: number | null;
  vendorTransId: number | null;
  vendorComTransId: number | null;
}

export interface ITaxesCommission {
  airline_taxes: number;
  airline_commission: number;
  airline_tax_type: string;
}
export interface ITaxesCommissionDB extends ITaxesCommission {
  airline_airticket_id: number;
  airline_invoice_id: number;
}
[];
export interface IUpdateAirTicketDb {
  airticket_ticket_type: TicketType;
  airticket_client_id: number | null;
  airticket_combined_id: number | null;
  airticket_vendor_id: number | null;
  airticket_vendor_combine_id: number | null;
  airticket_remarks?: string;
  airticket_airline_id: number;
  airticket_ticket_no: string;
  airticket_pnr: string;
  airticket_classes: ticketClassType;
  airticket_gross_fare: number;
  airticket_base_fare: number;
  airticket_commission_percent: number;
  airticket_commission_amount: number;
  airticket_ait: number;
  airticket_total_taxes_commission: number;
  airticket_discount_total: number;
  airticket_net_commission: number;
  airticket_tax: number;
  airticket_extra_fee: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_profit: number;
  airticket_pax_name: string;
  airticket_gds: gdsType;
  airticket_segment: number;
  airticket_bd_charge: number;
  airticket_xt_charge: number;
  airticket_ut_charge: number;
  airticket_es_charge: number;
  airticket_ow_charge: number;
  airticket_pz_charge: number;
  airticket_qa_charge: number;
  airticket_g4_charge: number;
  airticket_e5_charge: number;
  airticket_p7_charge: number;
  airticket_p8_charge: number;
  airticket_r9_charge: number;
  airticket_sales_date: string;
  airticket_is_void?: number;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_route_or_sector: string;
}
export interface IAirTicketDb extends IUpdateAirTicketDb {
  airticket_invoice_id: number;
  airticket_org_agency: number;
  airticket_cl_trans_id: number | null;
  airticket_cl_com_trans_id: number | null;
  airticket_v_trans_id: number | null;
  airticket_v_com_trans_id: number | null;
  airticket_ac_sale_vou1: number;
  airticket_ac_sale_vou2: number;
  airticket_ac_pur_vou1: number;
  airticket_ac_pur_vou2: number;
}

export type VoucherType =
  | 'ADR'
  | 'AM'
  | 'AGP'
  | 'IOQ'
  | 'AIT'
  | 'AIV'
  | 'AIQ'
  | 'ANC'
  | 'ARF'
  | 'ARI'
  | 'ATR'
  | 'BT'
  | 'ITPQ'
  | 'TS'
  | 'CL'
  | 'EXP'
  | 'ICI'
  | 'IH'
  | 'IHP'
  | 'IO'
  | 'ITP'
  | 'ITS'
  | 'IU'
  | 'IV'
  | 'IVT'
  | 'LN'
  | 'LNP'
  | 'LNR'
  | 'MR'
  | 'NII'
  | 'OB'
  | 'OTR'
  | 'PRF'
  | 'ORF'
  | 'QT'
  | 'RCM'
  | 'TPR'
  | 'TRF'
  | 'AG'
  | 'VEN'
  | 'VPY'
  | 'TSQ'
  | 'PR';
