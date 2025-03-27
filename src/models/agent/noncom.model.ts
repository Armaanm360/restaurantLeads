import { group } from 'console';
import { Request } from 'express';
import { CTimestamp, TDB, TDB2 } from '../../common/types/commonTypes';
import Schema from '../../utils/miscellaneous/schema';
import { IVoucher } from '../../common/types/doubleEntry.interface';
import { separateCombClientToId } from '../../common/helpers/common.helper';
import {
  IAirTicketPax,
  IFlightDetailsDb,
  IRefundDb,
  IRefundItemDb,
  ITaxesCommissionDB,
  VoucherType,
} from '../../common/helpers/commonTypes';
import config from '../../config/config';

class NonComModel extends Schema {
  private db: TDB;
  private db2: TDB2;

  constructor(db: TDB, db2: TDB2) {
    super();
    this.db = db;
    this.db2 = db2;
  }

  public async getSingleEntryClient(agency_id: Number) {
    return await this.db('trabill_clients')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ client_org_agency: agency_id })
      .andWhere('client_is_deleted', false);
  }

  public async insertClTrxn(payload: any) {
    const [id] = await this.db2(`client_trxn`).insert(payload);

    return id;
  }

  // IComTrxnDb
  public async insertComTrxn(payload: any) {
    const [id] = await this.db2('comb_trxn').insert(payload);

    return id;
  }
  public async insertVTrxn(payload: any) {
    const [id] = await this.db2('vendor_trxn').insert(payload);

    return id;
  }

  public async getSingleEntryVendor(agency_id: Number) {
    return await this.db('trabill_vendors')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ vendor_org_agency: agency_id })
      .andWhere('vendor_is_deleted', false);
  }
  public async getSingleEntryEmployee(agency_id: Number) {
    return await this.db('trabill_employees')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ employee_org_agency: agency_id })
      .andWhere('employee_is_deleted', false);
  }

  public async getDoubleEntryClient(agency_id: Number) {
    return await this.db('trabill_clients')
      .withSchema(this.DOUBLE)
      .select('*')
      .where({ client_org_agency: agency_id })
      .andWhere('client_is_deleted', false);
  }

  public async getDoubleEntryVendor(agency_id: Number) {
    return await this.db('trabill_vendors')
      .withSchema(this.DOUBLE)
      .select('*')
      .where({ vendor_org_agency: agency_id })
      .andWhere('vendor_is_deleted', false);
  }
  public async getDoubleEntryEmployee(agency_id: Number) {
    return await this.db('trabill_vendors')
      .withSchema(this.DOUBLE)
      .select('*')
      .where({ vendor_org_agency: agency_id })
      .andWhere('vendor_is_deleted', false);
  }

  public async columnSingle() {
    return await this.db('trabill_clients')
      .withSchema(this.SINGLE)
      .columnInfo();
  }
  public async columnDouble() {
    return await this.db2('trabill_clients')
      .withSchema(this.DOUBLE)
      .columnInfo();
  }
  public async columnSingleVendor() {
    return await this.db('trabill_vendors')
      .withSchema(this.SINGLE)
      .columnInfo();
  }
  public async columnSingleEmployee() {
    return await this.db('trabill_employees')
      .withSchema(this.SINGLE)
      .columnInfo();
  }
  public async columnDoubleVendor() {
    return await this.db2('trabill_vendors')
      .withSchema(this.DOUBLE)
      .columnInfo();
  }
  public async columnDoubleEmployee() {
    return await this.db2('trabill_employees')
      .withSchema(this.DOUBLE)
      .columnInfo();
  }

  public async insertDoubleEntry(transformedClient: any) {
    await this.db2('trabill_clients')
      .withSchema(this.DOUBLE)
      .insert(transformedClient);
  }
  public async insertDoubleEntryVendor(transformedClient: any) {
    await this.db2('trabill_vendors')
      .withSchema(this.DOUBLE)
      .insert(transformedClient);
  }
  public async insertDoubleEntryEmployee(transformedClient: any) {
    await this.db2('trabill_employees')
      .withSchema(this.DOUBLE)
      .insert(transformedClient);
  }

  // invoice latest points

  public async singleEntryInvoices() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 2,
        // invoice_is_reissued: 0,
        // invoice_is_cancel: 0,
        // invoice_is_refund: 0,
        // invoice_is_deleted: 0,
        // invoice_is_void: 0,
      });
  }

  public async singleEntryInvoicesRefund() {
    return await this.db('trabill_invoices')
      .withSchema('trabill_iata_single_entry_2025')
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_refund: 1,
      });
  }

  public async singleEntryInvoicesRefundCount() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .count('* as count') // Count all rows that match the criteria
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_reissued: 0,
        invoice_is_cancel: 0,
        invoice_is_refund: 1,
        invoice_is_deleted: 0,
        invoice_is_void: 0,
      })
      .then((result) => result[0].count); // Extract the count from the result
  }

  public async singleEntryInvoicesReissue() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_reissued: 1,
        invoice_is_cancel: 0,
        invoice_is_refund: 0,
        invoice_is_deleted: 0,
        invoice_is_void: 0,
      });
  }

  public async singleEntryInvoicesVoid() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_reissued: 0,
        invoice_is_cancel: 0,
        invoice_is_refund: 0,
        invoice_is_deleted: 0,
        invoice_is_void: 1,
      });
  }

  public async singleEntryInvoicesCanceled() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_reissued: 0,
        invoice_is_cancel: 1,
        invoice_is_refund: 0,
        invoice_is_deleted: 0,
        invoice_is_void: 0,
      });
  }

  public async singleEntryInvoicesReissueRefund() {
    return await this.db('trabill_invoices')
      .withSchema(this.SINGLE)
      .select('*')
      .where({
        invoice_org_agency: 76,
        invoice_category_id: 1,
        invoice_is_reissued: 1,
        invoice_is_cancel: 0,
        invoice_is_refund: 1,
        invoice_is_deleted: 0,
        invoice_is_void: 0,
      });
  }

  public async singleEntryInvoicesAirTicketItems(invoice_id: number) {
    return await this.db('trabill_invoice_noncom_airticket_items')
      .withSchema(this.SINGLE)
      .select('*')
      .where('airticket_org_agency', 76)
      .andWhere('airticket_invoice_id', invoice_id)
      .andWhere('airticket_is_deleted', 0)
      // .andWhere('airticket_ticket_type', 'NEW TKT');
      .andWhere('airticket_is_reissued', 0)
      .andWhere('airticket_is_refund', 0)
      .andWhere('airticket_is_void', 0);
    // .andWhere('airticket_is_deleted', 0);
  }
  public async singleEntryInvoicesAirTicketItemsRefund(invoice_id: number) {
    return await this.db('trabill_invoice_airticket_items')
      .withSchema(this.SINGLE)
      .select('*')
      .where('airticket_org_agency', 76)
      .andWhere('airticket_invoice_id', invoice_id)
      .andWhere('airticket_ticket_type', 'NEW TKT')
      .andWhere('airticket_is_reissued', 0)
      .andWhere('airticket_is_refund', 0)
      .andWhere('airticket_is_void', 0)
      .andWhere('airticket_is_deleted', 0);
  }

  //insert invoice
  public async insertInvoicesInfo(payload: any) {
    const [invoice_id] = await this.db2('trabill_invoices').insert(payload);
    return invoice_id;
  }

  public async insertAirTicketItem(payload: any) {
    const [airticket_id] = await this.db2(
      'trabill_invoice_noncom_airticket_items'
    ).insert(payload);

    return airticket_id as number;
  }

  //hello world
  insertAccVoucher = async (payload: any) => {
    const [id] = await this.db2('acc_voucher').insert(payload);

    return id;
  };

  public insertAccVoucherDb = async (body: any) => {
    const {
      serial_no,
      acc_head_id,
      voucher_no,
      amount,
      trans_type,
      description,
      payment_type,
      payment_method,
      bank_name,
    } = body;

    const payload: any = {
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

    return await this.insertAccVoucher(payload);
  };
  // IClTrxnBody
  public insertClientTrans = async (body: any) => {
    const {
      client_id,
      combined_id,
      ctrxn_amount,
      ctrxn_created_at,
      ctrxn_note,
      ctrxn_particular_id,
      ctrxn_pax,
      ctrxn_pnr,
      ctrxn_route,
      ctrxn_type,
      ctrxn_voucher,
      ctrxn_airticket_no,
      ctrxn_pay_type,
      ctrxn_journey_date,
      ctrxn_return_date,
      ctrxn_ref_id,
    } = body;

    // console.log('where the problem is actually happening!', body);

    let clTransId = null;
    let clComTransId = null;

    if (client_id) {
      console.log('client_id', client_id);
      const clTrxnBody: any = {
        ctrxn_amount,
        ctrxn_cl_id: client_id,
        ctrxn_created_at,
        ctrxn_note,
        ctrxn_particular_id,
        ctrxn_pax,
        ctrxn_pnr,
        ctrxn_route,
        ctrxn_type,
        ctrxn_voucher,
        ctrxn_airticket_no,
        ctrxn_pay_type,
        ctrxn_user_id: 127,
        ctrxn_agency_id: 154,
        ctrxn_journey_date,
        ctrxn_return_date,
        ctrxn_ref_id,
      };
      // IComTrxnDb
      clTransId = await this.insertClTrxn(clTrxnBody);
    } else if (combined_id) {
      const comTrxnBody: any = {
        comtrxn_voucher_no: ctrxn_voucher,
        comtrxn_airticket_no: ctrxn_airticket_no,
        comtrxn_route: ctrxn_route as string,
        comtrxn_pnr: ctrxn_pnr as string,
        comtrxn_pax: ctrxn_pax as string,
        comtrxn_type: ctrxn_type,
        comtrxn_comb_id: combined_id as number,
        comtrxn_particular_id: ctrxn_particular_id,
        comtrxn_amount: ctrxn_amount,
        comtrxn_note: ctrxn_note,
        comtrxn_created_at: ctrxn_created_at,
        comtrxn_user_id: 127,
        comtrxn_pay_type: ctrxn_pay_type,
        comtrxn_journey_date: ctrxn_journey_date,
        comtrxn_return_date: ctrxn_return_date,
        comtrxn_ref_id: ctrxn_ref_id,
        comtrxn_agency_id: 154,
      };

      clComTransId = await this.insertComTrxn(comTrxnBody);
    }

    return { clTransId, clComTransId };
  };

  public insertVendorTrans = async (body: any) => {
    const {
      com_vendor,
      vtrxn_voucher,
      vtrxn_pax,
      vtrxn_airticket_no,
      vtrxn_pnr,
      vtrxn_route,
      vtrxn_type,
      vtrxn_amount,
      vtrxn_particular_id,
      vtrxn_note,
      vtrxn_created_at,
      vtrxn_pay_type,
      vtrxn_ref_id,
    } = body;

    let vendorTransId = null;
    let vendorComTransId = null;

    const { vendor_id, combined_id } = separateCombClientToId(com_vendor);

    if (vendor_id) {
      const VTrxnBody: any = {
        vtrxn_voucher,
        vtrxn_pax,
        vtrxn_type,
        vtrxn_amount,
        vtrxn_particular_id,
        vtrxn_note,
        vtrxn_created_at,
        vtrxn_v_id: vendor_id,
        vtrxn_airticket_no,
        vtrxn_pnr,
        vtrxn_route,
        vtrxn_pay_type,
        vtrxn_ref_id,
        vtrxn_agency_id: 154,
        vtrxn_user_id: 127,
      };

      vendorTransId = await this.insertVTrxn(VTrxnBody);
    } else if (combined_id) {
      const comTrxnBody: any = {
        comtrxn_voucher_no: vtrxn_voucher,
        comtrxn_type: vtrxn_type,
        comtrxn_comb_id: combined_id as number,
        comtrxn_particular_id: vtrxn_particular_id,
        comtrxn_amount: vtrxn_amount,
        comtrxn_note: vtrxn_note,
        comtrxn_created_at: vtrxn_created_at,
        comtrxn_user_id: 127,
        comtrxn_agency_id: 154,
        comtrxn_pax: vtrxn_pax as string,
        comtrxn_pnr: vtrxn_pnr as string,
        comtrxn_route: vtrxn_route as string,
        comtrxn_airticket_no: vtrxn_airticket_no,
        comtrxn_ref_id: vtrxn_ref_id,
      };

      vendorComTransId = await this.insertComTrxn(comTrxnBody);
    }

    return { vendorTransId, vendorComTransId };
  };

  public async refreshDatabase() {
    await this.db2('acc_voucher').where('org_id', 154).delete();
    await this.db2('trabill_invoice_airticket_items')
      .where('airticket_org_agency', 154)
      .delete();
    await this.db2('vendor_trxn').where('vtrxn_agency_id', 154).delete();
    await this.db2('client_trxn').where('ctrxn_agency_id', 154).delete();

    const ids = await this.db2('trabill_refunds')
      .where('org_agency', 154)
      .pluck('id');

    // Loop through the IDs and delete the corresponding records
    for (const id of ids) {
      await this.db2('trabill_refund_items').where('refund_id', id).delete();
    }

    await this.db2('trabill_refunds').where('org_agency', 154).delete();

    // Delete records from trabill_invoices based on invoice_org_agency
    return await this.db2('trabill_invoices')
      .where('invoice_org_agency', 154)
      .delete();
  }

  public async getClientName(id: number) {
    return await this.db2('trabill_clients')
      .select('client_name')
      .where('client_id', id)
      .first();
  }

  public async getVendorName(id: number) {
    return await this.db2('trabill_vendors')
      .select('vendor_name')
      .where('vendor_id', id)
      .first();
  }

  public async insertAirTicketPax(payload: IAirTicketPax) {
    await this.db2('trabill_invoice_airticket_pax').insert(payload);
  }

  public async insertAirTicketFlights(
    flight_details: IFlightDetailsDb | IFlightDetailsDb[]
  ) {
    await this.db2('trabill_invoice_airticket_flights').insert(flight_details);
  }

  public async insertAirTicketCommission(
    taxes_commission: ITaxesCommissionDB | ITaxesCommissionDB[]
  ) {
    await this.db2('airticket_taxes_commissions').insert(taxes_commission);
  }

  generateVoucher = async (voucher_type: VoucherType) => {
    const [[[voucher]]] = await this.db.raw(
      `call ${config.DB_NAME2}.get_voucher_num('${voucher_type}', ${154})`
    );

    return voucher.voucher_number;
  };

  updateVoucher = async (voucher_type: VoucherType) => {
    await this.db.raw(
      `call ${config.DB_NAME2}.updateVoucherNumber('${voucher_type}', 154)`
    );
  };

  //get single entry refunds
  public async getSingleEntryRefund(agency_id: Number) {
    return await this.db('trabill_airticket_refunds')
      .withSchema(this.SINGLE)
      .select('*')
      .leftJoin(
        'trabill_invoices as ti',
        'ti.invoice_id',
        '=',
        'trabill_airticket_refunds.atrefund_invoice_id'
      )
      .where({ atrefund_org_agency: agency_id })
      .andWhere('atrefund_is_deleted', false)
      .andWhere('ti.invoice_category_id', 1);
  }

  public async getSingleEntryRefundAirItems(refundId: Number) {
    return await this.db('trabill_airticket_client_refunds')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ crefund_refund_id: refundId });
  }

  //get single entry refund invoice_wise
  public async getInvoiceWiseRefundAirticket(invoice_id: Number) {
    return await this.db('trabill_invoice_airticket_items')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ airticket_invoice_id: invoice_id })
      .andWhere('airticket_is_deleted', 0)
      .andWhere('airticket_is_refund', 1);
  }

  public async getTicketInfo(invoiceId: Number, airTicketId: Number) {
    return await this.db('v_air_tickets_info')
      .withSchema(this.SINGLE)
      .select(
        'airticket_id',
        'airticket_invoice_id',
        'airticket_client_id',
        'airticket_combined_id',
        'airticket_vendor_id',
        'airticket_vendor_combine_id',
        'airticket_airline_id',
        'airticket_ticket_no',
        'airticket_pnr',
        'airticket_classes',
        'airticket_route_or_sector',
        'airticket_client_price',
        'airticket_purchase_price',
        'airticket_pax_name',
        'airticket_journey_date',
        'airticket_return_date',
        'comb_vendor',
        'vendor_name',
        'comb_client',
        'client_name'
      )

      .leftJoin('v_all_clients', function () {
        this.on('v_all_clients.client_id', '=', 'airticket_client_id').orOn(
          'v_all_clients.combined_id',
          '=',
          'airticket_combined_id'
        );
      })

      .leftJoin('v_all_vendors', function () {
        this.on('v_all_vendors.vendor_id', '=', 'airticket_vendor_id').orOn(
          'v_all_vendors.combined_id',
          '=',
          'airticket_vendor_combine_id'
        );
      })

      .where('airticket_org_agency', 154)
      .andWhere('airticket_id', airTicketId)
      .andWhere('airticket_invoice_id', invoiceId)
      .first();
  }

  public async getTicketInfoByTicketNumber(airTicketId: string) {
    return await this.db2('trabill_invoice_airticket_items')
      .withSchema(this.DOUBLE)
      .select(
        'airticket_id',
        'airticket_invoice_id',
        'airticket_client_id',
        'airticket_combined_id',
        'airticket_vendor_id',
        'airticket_vendor_combine_id',
        'airticket_airline_id',
        'airticket_ticket_no',
        'airticket_pnr',
        'airticket_classes',
        'airticket_route_or_sector',
        'airticket_client_price',
        'airticket_purchase_price',
        'airticket_pax_name',
        'airticket_journey_date',
        'airticket_return_date',
        'comb_vendor',
        'vendor_name',
        'comb_client',
        'client_name'
      )

      .leftJoin('v_all_clients', function () {
        this.on('v_all_clients.client_id', '=', 'airticket_client_id').orOn(
          'v_all_clients.combined_id',
          '=',
          'airticket_combined_id'
        );
      })

      .leftJoin('v_all_vendors', function () {
        this.on('v_all_vendors.vendor_id', '=', 'airticket_vendor_id').orOn(
          'v_all_vendors.combined_id',
          '=',
          'airticket_vendor_combine_id'
        );
      })

      .where('airticket_org_agency', 154)
      .andWhere('airticket_ticket_no', airTicketId)
      .first();
  }
  public async getTicketInfoByNumber(airticketNo: string) {
    return await this.db2('trabill_invoice_airticket_items')
      .withSchema(this.DOUBLE)
      .select('*')

      .where('airticket_org_agency', 154)
      .andWhere('airticket_ticket_no', airticketNo)
      .first();
  }

  async insertRefund(refundItem: IRefundDb) {
    const [id] = await this.db2('trabill_refunds').insert(refundItem);

    return id;
  }

  async insertRefundItems(refundItem: IRefundItemDb[]) {
    await this.db2('trabill_refund_items').insert(refundItem);
  }

  public async getInvoiceWiseRefundAirticketOld(vrefund_refund_id: Number) {
    return await this.db('v_ait_refund_desc')
      .withSchema(this.SINGLE)
      .select('*')
      .where({ vrefund_refund_id: vrefund_refund_id });
  }
}

export default NonComModel;
