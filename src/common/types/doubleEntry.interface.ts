export interface IAccHeadBody {
  isParent?: boolean;
  head_group_code: number;
  head_parent_id?: number;
  head_name: string[];
}

export interface IAccHeadDb {
  head_group_code: number;
  head_name: string;
  head_parent_id: number | undefined;
  head_code: number;
  head_agency_id: number;
  head_created_by: number;
  account_opening_balance_type?: string;
}

export type paymentType =
  | 'REFUND'
  | 'INVOICE'
  | 'EMD'
  | 'AIR_TICKET_VOID'
  | 'RECEIPT'
  | 'OPENING_BALANCE'
  | 'INVESTMENT'
  | 'ADVANCE'
  | 'EXPENSE'
  | 'PAYMENT'
  | 'PAYROLL'
  | 'LOAN'
  | 'LOAN_PAYMENT'
  | 'LOAN_RECEIVE';

export interface IVoucher {
  org_id: number;
  acc_head_id: number;
  voucher_no: string;
  voucher_date: string;
  serial_no: number;
  debit: number;
  credit: number;
  payment_method?: number;
  payment_type: paymentType;
  is_cheque?: 0 | 1;
  cheque_no?: string;
  cheque_date?: string;
  bank_name?: string;
  description: string;
  created_by: number;
}
