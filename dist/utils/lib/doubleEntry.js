"use strict";
// import { Request } from 'express';
// import { Knex } from 'knex';
// import {
//   IVoucher,
//   paymentType,
// } from '../../common/types/doubleEntry.interface';
// import { db, db2 } from '../../app/database';
// import { CTimestamp } from '../../common/types/commonTypes';
// import AgentDashboardModel from '../../models/agent/agentDashboard.model';
// export class DoubleEntryHelpers {
//   protected conn: AgentDashboardModel;
//   protected req: Request;
//   protected models = new Models(db2);
//   constructor(req: Request, trx: Knex.Transaction) {
//     this.req = req;
//     this.conn = this.models.doubleEntry(req, trx);
//   }
//   insertAccVoucher = async (
//     serial_no: number,
//     acc_head_id: number,
//     voucher_no: string,
//     amount: number,
//     trans_type: 'DEBIT' | 'CREDIT',
//     description: string,
//     payment_type: paymentType,
//     payment_method?: number,
//     bank_name?: string
//   ) => {
//     const payload = {
//       acc_head_id,
//       created_by: 126, //need to change this
//       credit: trans_type === 'CREDIT' ? amount : 0,
//       debit: trans_type === 'DEBIT' ? amount : 0,
//       description,
//       org_id: 154, //need to change this
//       payment_method,
//       payment_type,
//       serial_no,
//       voucher_date: CTimestamp,
//       voucher_no,
//       bank_name,
//     };
//     return await this.conn.insertAccVoucher(payload);
//   };
// }
