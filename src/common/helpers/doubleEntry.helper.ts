import { Request } from 'express';
import { Knex } from 'knex';

import AgentDashboardModel from '../../models/agent/agentDashboard.model';
// import db from '../../app/db';

import { CTimestamp } from '../types/commonTypes';
import { db2 } from '../../app/database';
import { IVoucher, paymentType } from '../types/doubleEntry.interface';

export class DoubleEntryHelpers {
  // protected conn: AgentDashboardModel;
  protected req: Request;

  constructor(req: Request, trx: Knex.Transaction) {
    this.req = req;
    // Initialize the connection directly without using the Models class
    // this.conn = new AgentDashboardModel(req, trx);
  }

  insertAccVoucher = async (
    serial_no: number,
    acc_head_id: number,
    voucher_no: string,
    amount: number,
    trans_type: 'DEBIT' | 'CREDIT',
    description: string,
    payment_type: paymentType,
    payment_method?: number,
    bank_name?: string
  ) => {
    const payload = {
      acc_head_id,
      created_by: 127,
      credit: trans_type === 'CREDIT' ? amount : 0,
      debit: trans_type === 'DEBIT' ? amount : 0,
      description,
      org_id: 154,
      payment_method,
      payment_type,
      serial_no,
      voucher_date: CTimestamp,
      voucher_no,
      bank_name,
    };

    // return await this.conn.insertAccVoucher(payload);
  };
}
