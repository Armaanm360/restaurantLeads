import { Knex } from 'knex';
import { db } from '../app/database';
import Models from '../models/rootModels';
import ManageFile from '../utils/lib/manageFile';
import ResMsg from '../utils/miscellaneous/responseMessage';
import Schema from '../utils/miscellaneous/schema';
import StatusCode from '../utils/miscellaneous/statusCode';
import { Request } from 'express';
import { DoubleEntryHelpers } from '../common/helpers/doubleEntry.helper';
import { accountHead, transactionTypes } from '../common/types/commonTypes';
import { VoucherType } from '../common/helpers/commonTypes';

abstract class AbstractServices {
  protected db = db;
  protected manageFile = new ManageFile();
  protected ResMsg = ResMsg;
  protected StatusCode = StatusCode;
  protected Model = new Models();
  protected schema = new Schema();
  protected deHelper(req: Request, trx: Knex.Transaction<any, any[]>) {
    return new DoubleEntryHelpers(req, trx);
  }

  protected generateVoucher = async (req: Request, type: VoucherType) => {
    const conn = this.Model.agentDashboardModel();

    const voucher = await conn.generateVoucher(type);

    return voucher as string;
  };

  protected superVoucher = async (req: Request, type: VoucherType) => {
    const agency_id = 154; // অথবা req থেকে dynamic
    const [[[voucher]]] = await this.db.raw(
      `CALL trabill_double_entry.sp_generate_voucher('${type}', ${agency_id})`
    );
    return voucher.voucher_number;
  };

  protected updateVoucher = async (req: Request, type: VoucherType) => {
    const conn = this.Model.agentDashboardModel();

    await conn.updateVoucher(type);
  };
  protected trnType = transactionTypes;
  protected accHead = accountHead;
}

export default AbstractServices;
