import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';
import { airTicketPayloadFormatter } from '../types/airticketutils';
import { any } from 'joi';
import {
  IAirTicketDb,
  IClTrxnBody,
  IFlightDetailsDb,
  IRefundDb,
  IVTrxn,
} from '../helpers/commonTypes';
import {
  formatDate,
  generateNextGroupCode,
  separateCombClientToId,
} from '../helpers/common.helper';
import { numRound } from '../types/commonTypes';
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';

export class RefundService extends AbstractServices {
  constructor() {
    super();
  }
  public async refundTest(req: Request) {
    const model = this.Model.agentDashboardModel(); // Get the property model

    // Function to get refunds with their associated items
    async function getRefundsWithItems() {
      // Get the refunds
      const refunds = await model.getSingleEntryRefund(76);

      // For each refund, fetch and attach its refund items and extra info
      const refundsWithItems = await Promise.all(
        refunds.map(async (refund) => {
          // Fetch refund items
          const refundItems = await model.getInvoiceWiseRefundAirticketOld(
            refund.atrefund_id
          );

          // Fetch client info for this refund
          const clientInfo = await model.getSingleClientInfo(
            refund.atrefund_client_id
          );

          // Attach double entry info to each refund item
          const refundItemsWithDoubleEntry = await Promise.all(
            refundItems.map(async (item) => {
              const doubleEntry = await model.getAllAirTicketBased(
                item.airticket_ticket_no
              );

              return {
                ...item,
                double_entry_ticket: doubleEntry?.airticket_ticket_no || null,
                double_entry_airticket_id: doubleEntry?.airticket_id || null,
                double_entry_invoice_id:
                  doubleEntry?.airticket_invoice_id || null,
                double_vendor_id: doubleEntry?.vendor_id || null,
              };
            })
          );

          // Return refund object with new fields
          return {
            ...refund,
            refund_items: refundItemsWithDoubleEntry,
            client_info: clientInfo?.doubleClientId,
          };
        })
      );

      return refundsWithItems;
    }

    // Usage
    const refundsData = await getRefundsWithItems();

    // return {
    //   data: refundsData,
    //   code: this.StatusCode.HTTP_ACCEPTED,
    // };

    return await this.db.transaction(async (trx) => {
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      for (const refunds of refundsData) {
        try {
          const conn = this.Model.agentDashboardModel();
          console.log('Processing refund for:', refunds);

          const clientInfo = await model.getSingleClientInfo(
            refunds.atrefund_client_id
          );

          let com_client = clientInfo?.doubleClientId
            ? `client-${clientInfo?.doubleClientId}`
            : `combined-${refunds.atrefund_combined_id}`;

          const voucher_no = await this.superVoucher(req, 'ARF');
          const { client_id, combined_id } = separateCombClientToId(com_client);

          let sales_price = 0;
          let purchase_price = 0;
          let total_penalties = 0;
          let client_extra_fee = 0;

          const refundItems = [];

          const { refund_by, refund_date, refund_note, client_name, items } =
            req.body as any;

          for (const item of refunds.refund_items) {
            try {
              const { vendor_name, ...restItem } = item;
              const airTicketInfo = await conn.getSingleEntryAirticketInfo(
                item.airticket_ticket_no
              );

              sales_price += Number(airTicketInfo?.airticket_client_price || 0);
              purchase_price += Number(
                airTicketInfo?.airticket_purchase_price || 0
              );
              total_penalties += Number(item?.penalties || 0);
              client_extra_fee += Number(item?.client_extra_fee || 0);

              const client_refund =
                Number(airTicketInfo?.airticket_client_price || 0) -
                Number(item?.penalties || 0) -
                Number(item?.client_extra_fee || 0);

              const vendor_refund =
                Number(airTicketInfo?.airticket_purchase_price || 0) -
                Number(item?.penalties || 0);

              function getValidAmount(value: any) {
                const num = Number(value);
                return !isNaN(num) && isFinite(num) ? num : 0;
              }

              const sale_return_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket((-) Sales Return)'],
                voucher_no: voucher_no + 'AIR',
                amount: airTicketInfo?.airticket_client_price,
                trans_type: 'DEBIT',
                description: `Ticket return from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const sale_return_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_client_price),
                trans_type: 'CREDIT',
                description: `Ticket return from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const purchase_return_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_purchase_price),
                trans_type: 'DEBIT',
                description: `Ticket return to ${
                  item?.vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const purchase_return_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Purchases Return)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_purchase_price),
                trans_type: 'CREDIT',
                description: `Ticket return to ${
                  item?.vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const penalty_vou_1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Refund Penalties'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'DEBIT',
                description: `Refund Penalty from ${
                  vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const penalty_vou_2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'CREDIT',
                description: `Refund Penalty from ${
                  vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const extra_fee_vou_1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'DEBIT',
                description: `Refund Charge from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const extra_fee_vou_2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Refund Charge'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'CREDIT',
                description: `Refund Charge from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const clientTrans: IClTrxnBody = {
                client_id,
                combined_id,
                ctrxn_amount: +airTicketInfo?.airticket_client_price,
                ctrxn_created_at: refunds.atrefund_date,
                ctrxn_note: refund_note,
                ctrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                ctrxn_type: 'CREDIT',
                ctrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                ctrxn_journey_date: airTicketInfo?.airticket_journey_date,
                ctrxn_pax: airTicketInfo?.airticket_pax_name,
                ctrxn_pnr: airTicketInfo?.airticket_pnr,
                ctrxn_route: airTicketInfo?.airticket_route_or_sector,
                ctrxn_voucher: voucher_no,
              };

              const vendorTrans: IVTrxn = {
                com_vendor: airTicketInfo?.comb_vendor,
                vtrxn_amount: +airTicketInfo.airticket_purchase_price,
                vtrxn_created_at: refunds.atrefund_date,
                vtrxn_note: refund_note,
                vtrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                vtrxn_type: 'CREDIT',
                vtrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                vtrxn_pax: airTicketInfo?.airticket_pax_name,
                vtrxn_pnr: airTicketInfo?.airticket_pnr,
                vtrxn_route: airTicketInfo?.airticket_route_or_sector,
                vtrxn_voucher: voucher_no,
              };

              const clientTransExtraFee: IClTrxnBody = {
                client_id,
                combined_id,
                ctrxn_amount: item?.vrefund_charge_amount,
                ctrxn_created_at: refunds.atrefund_create_date,
                ctrxn_note: refund_note,
                ctrxn_particular_id: this.trnType['REFUND CHARGE'],
                ctrxn_type: 'DEBIT',
                ctrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                ctrxn_journey_date: airTicketInfo?.airticket_journey_date,
                ctrxn_pax: airTicketInfo?.airticket_pax_name,
                ctrxn_pnr: airTicketInfo?.airticket_pnr,
                ctrxn_route: airTicketInfo?.airticket_route_or_sector,
                ctrxn_voucher: voucher_no,
              };

              const vendorTransPenalty: IVTrxn = {
                com_vendor: airTicketInfo?.comb_vendor,
                vtrxn_amount: item?.vrefund_charge_amount,
                vtrxn_created_at: refunds.atrefund_create_date,
                vtrxn_note: refund_note,
                vtrxn_particular_id: this.trnType['REFUND PENALTIES'],
                vtrxn_type: 'CREDIT',
                vtrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                vtrxn_pax: airTicketInfo?.airticket_pax_name,
                vtrxn_pnr: airTicketInfo?.airticket_pnr,
                vtrxn_route: airTicketInfo?.airticket_route_or_sector,
                vtrxn_voucher: voucher_no,
              };

              refundItems.push({
                refundItem: {
                  ...restItem,
                  client_refund: client_refund,
                  vendor_refund: vendor_refund,
                  sale_return_vou1,
                  sale_return_vou2,
                  purchase_return_vou1,
                  purchase_return_vou2,
                  penalty_vou_1,
                  penalty_vou_2,
                  extra_fee_vou_1,
                  extra_fee_vou_2,
                },
                clientTrans,
                vendorTrans,
                clientTransExtraFee,
                vendorTransPenalty,
              });
            } catch (itemErr) {
              console.error('Error processing refund item:', item, itemErr);
            }
          }

          const userName = await model.getUserInfoAndId(
            refunds.atrefund_created_by
          );

          const refundPayload: IRefundDb = {
            com_client: `client-${refunds.client_info}`,
            client_id: refunds.client_info,
            combined_id: null,
            refund_by: userName.doubleUserId,
            refund_date: refunds.atrefund_date,
            refund_note: refunds.atrefund_note,
            voucher_no,
            sales_price: refunds.invoice_sub_total,
            purchase_price: 0,
            total_penalties: refunds.atrefund_profit,
            client_extra_fee: 0,
            client_refund_amount: refunds.atrefund_cl_return,
            vendor_refund_amount: refunds.atrefund_vendor_return,
            created_by: 1666,
            org_agency: 154,
            rf_type: 'AIR_TICKET',
          };

          const refund_id = await conn.insertRefund(refundPayload);
          // const refundsItems: any = [];

          // Initialize with empty array
          const refundsItems: any = [];

          for (const item of refundItems) {
            try {
              console.log(
                'Processing refund item:',
                JSON.stringify(item, null, 2)
              );

              const {
                clientTrans,
                vendorTrans,
                clientTransExtraFee,
                vendorTransPenalty,
                refundItem,
              } = item;

              // Log each transaction object to check if they contain data
              console.log('clientTrans:', clientTrans);
              console.log('vendorTrans:', vendorTrans);
              console.log('clientTransExtraFee:', clientTransExtraFee);
              console.log('vendorTransPenalty:', vendorTransPenalty);
              console.log('refundItem:', refundItem);

              const clTrxId = await conn.insertClientTrans({
                ...clientTrans,
                ctrxn_ref_id: refund_id,
              });
              console.log('Client transaction inserted:', clTrxId);

              const vTrxId = await conn.insertVendorTrans({
                ...vendorTrans,
                vtrxn_ref_id: refund_id,
              });
              console.log('Vendor transaction inserted:', vTrxId);

              const clExTrxId = await conn.insertClientTrans({
                ...clientTransExtraFee,
                ctrxn_ref_id: refund_id,
              });
              console.log('Client extra fee transaction inserted:', clExTrxId);

              const vPenTrxId = await conn.insertVendorTrans({
                ...vendorTransPenalty,
                vtrxn_ref_id: refund_id,
              });
              console.log('Vendor penalty transaction inserted:', vPenTrxId);

              const getTicketWiseId =
                await conn.getTicketInfoByTicketNumberDouble(
                  refundItem.airticket_ticket_no
                );
              console.log('Ticket info retrieved:', getTicketWiseId);

              const refundItemData = {
                refund_id,
                client_refund:
                  (Number(refundItem?.airticket_client_price) || 0) -
                  (Number(refundItem?.vrefund_charge_amount) || 0),
                vendor_refund:
                  (Number(refundItem?.airticket_purchase_price) || 0) -
                  (Number(refundItem?.vrefund_charge_amount) || 0),
                airticket_id: item.refundItem.double_entry_airticket_id,
                penalties: refundItem.vrefund_charge_amount,
                invoice_id: item.refundItem.double_entry_invoice_id,
                sale_return_vou1: +refundItem.sale_return_vou1 || null,
                sale_return_vou2: +refundItem.sale_return_vou2 || null,
                purchase_return_vou1: +refundItem.purchase_return_vou1 || null,
                purchase_return_vou2: +refundItem.purchase_return_vou2 || null,
                penalty_vou_1: +refundItem.penalty_vou_1 || null,
                penalty_vou_2: +refundItem.penalty_vou_2 || null,
                extra_fee_vou_1: +refundItem.extra_fee_vou_1 || null,
                extra_fee_vou_2: +refundItem.extra_fee_vou_2 || null,
                v_penalty_trans_id:
                  vPenTrxId?.vendorTransId != null
                    ? Number(vPenTrxId.vendorTransId)
                    : null,
                cl_extra_fee_trans_id:
                  clExTrxId?.clTransId != null
                    ? Number(clExTrxId.clTransId)
                    : null,
                clTransId:
                  clTrxId?.clTransId != null ? Number(clTrxId.clTransId) : null,
                clComTransId:
                  clTrxId?.clComTransId != null
                    ? Number(clTrxId.clComTransId)
                    : null,
                vendorTransId:
                  vTrxId?.vendorTransId != null
                    ? Number(vTrxId.vendorTransId)
                    : null,
                vendorComTransId:
                  vTrxId?.vendorComTransId != null
                    ? Number(vTrxId.vendorComTransId)
                    : null,
              };

              console.log('Refund item data prepared:', refundItemData);
              refundsItems.push(refundItemData);
            } catch (subErr) {
              console.error('Error inserting refund sub-data:', subErr);
              // Consider re-throwing or handling differently if you want to stop execution
            }
          }

          console.log('Total refund items to insert:', refundsItems.length);
          console.log('Refund items data:', refundsItems);

          if (refundsItems.length === 0) {
            console.warn(
              'No refund items to insert - this might cause "query is empty" error'
            );
            // You might want to throw an error or handle this case differently
          } else {
            await conn.insertRefundItems(refundsItems);
            console.log('Refund items inserted successfully');
          }
          await this.updateVoucher(req, 'ARF');
        } catch (error) {
          errorCount++;
          console.error('Error processing invoice:', error);

          // Extract error type from the error message or object
          let errorType = 'Unknown';
          if (error instanceof Error) {
            if (error.message.includes('trabill_invoices')) {
              errorType = 'Database Insert Error';
            } else if (error.message.includes('validation')) {
              errorType = 'Validation Error';
            }
            // Add more error type checks as needed
          }

          processingErrors.push({
            invoice: refunds, // or invoice.id if available
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });
          console.error('Error processing refund:', refunds, error);
        }
      }

      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: refundsData.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          invoices: refundsData,
        },
        errors: processingErrors,
        errorSummary: {
          totalErrors: errorCount,
          errorTypes: processingErrors.reduce((acc, err) => {
            acc[err.errorType || 'Unknown'] =
              (acc[err.errorType || 'Unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    });
  }

  public async refundTestNon(req: Request) {
    const model = this.Model.agentDashboardModel(); // Get the property model

    // Function to get refunds with their associated items
    async function getRefundsWithItems() {
      // Get the refunds
      const refunds = await model.getSingleEntryRefundNonCom(76);

      // For each refund, fetch and attach its refund items
      const refundsWithItems = await Promise.all(
        refunds.map(async (refund) => {
          const refundItems = await model.getInvoiceWiseRefundAirticketOld(
            refund.atrefund_id
          );

          return {
            ...refund,
            refund_items: refundItems,
          };
        })
      );

      return refundsWithItems;
    }

    // Usage
    const refundsData = await getRefundsWithItems();

    return await this.db.transaction(async (trx) => {
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      for (const refunds of refundsData) {
        try {
          const conn = this.Model.agentDashboardModel();
          console.log('Processing refund for:', refunds);

          let com_client = refunds.atrefund_client_id
            ? `client-${refunds.atrefund_client_id}`
            : `combined-${refunds.atrefund_combined_id}`;

          const voucher_no = await this.superVoucher(req, 'ARF');
          const { client_id, combined_id } = separateCombClientToId(com_client);

          let sales_price = 0;
          let purchase_price = 0;
          let total_penalties = 0;
          let client_extra_fee = 0;

          const refundItems = [];

          const { refund_by, refund_date, refund_note, client_name, items } =
            req.body as any;

          for (const item of refunds.refund_items) {
            try {
              const { vendor_name, ...restItem } = item;
              const airTicketInfo = await conn.getSingleEntryAirticketInfo(
                item.airticket_ticket_no
              );
              console.log('Fetched AirTicket Info:', airTicketInfo);

              sales_price += Number(airTicketInfo?.airticket_client_price || 0);
              purchase_price += Number(
                airTicketInfo?.airticket_purchase_price || 0
              );
              total_penalties += Number(item?.penalties || 0);
              client_extra_fee += Number(item?.client_extra_fee || 0);

              const client_refund =
                Number(airTicketInfo?.airticket_client_price || 0) -
                Number(item?.penalties || 0) -
                Number(item?.client_extra_fee || 0);

              const vendor_refund =
                Number(airTicketInfo?.airticket_purchase_price || 0) -
                Number(item?.penalties || 0);

              function getValidAmount(value: any) {
                const num = Number(value);
                return !isNaN(num) && isFinite(num) ? num : 0;
              }

              const sale_return_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket((-) Sales Return)'],
                voucher_no: voucher_no + 'AIR',
                amount: airTicketInfo?.airticket_client_price,
                trans_type: 'DEBIT',
                description: `Ticket return from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const sale_return_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_client_price),
                trans_type: 'CREDIT',
                description: `Ticket return from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const purchase_return_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_purchase_price),
                trans_type: 'DEBIT',
                description: `Ticket return to ${
                  item?.vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const purchase_return_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Purchases Return)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(airTicketInfo?.airticket_purchase_price),
                trans_type: 'CREDIT',
                description: `Ticket return to ${
                  item?.vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const penalty_vou_1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Refund Penalties'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'DEBIT',
                description: `Refund Penalty from ${
                  vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const penalty_vou_2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'CREDIT',
                description: `Refund Penalty from ${
                  vendor_name || 'Unknown Vendor'
                }`,
                payment_type: 'REFUND',
              });

              const extra_fee_vou_1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'DEBIT',
                description: `Refund Charge from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const extra_fee_vou_2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Refund Charge'],
                voucher_no: voucher_no + 'AIR',
                amount: getValidAmount(item?.vrefund_charge_amount),
                trans_type: 'CREDIT',
                description: `Refund Charge from ${
                  client_name || 'Unknown Client'
                }`,
                payment_type: 'REFUND',
              });

              const clientTrans: IClTrxnBody = {
                client_id,
                combined_id,
                ctrxn_amount: +airTicketInfo?.airticket_client_price,
                ctrxn_created_at: refunds.atrefund_date,
                ctrxn_note: refund_note,
                ctrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                ctrxn_type: 'CREDIT',
                ctrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                ctrxn_journey_date: airTicketInfo?.airticket_journey_date,
                ctrxn_pax: airTicketInfo?.airticket_pax_name,
                ctrxn_pnr: airTicketInfo?.airticket_pnr,
                ctrxn_route: airTicketInfo?.airticket_route_or_sector,
                ctrxn_voucher: voucher_no,
              };

              const vendorTrans: IVTrxn = {
                com_vendor: airTicketInfo?.comb_vendor,
                vtrxn_amount: +airTicketInfo.airticket_purchase_price,
                vtrxn_created_at: refunds.atrefund_date,
                vtrxn_note: refund_note,
                vtrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                vtrxn_type: 'CREDIT',
                vtrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                vtrxn_pax: airTicketInfo?.airticket_pax_name,
                vtrxn_pnr: airTicketInfo?.airticket_pnr,
                vtrxn_route: airTicketInfo?.airticket_route_or_sector,
                vtrxn_voucher: voucher_no,
              };

              const clientTransExtraFee: IClTrxnBody = {
                client_id,
                combined_id,
                ctrxn_amount: item?.vrefund_charge_amount,
                ctrxn_created_at: refunds.atrefund_create_date,
                ctrxn_note: refund_note,
                ctrxn_particular_id: this.trnType['REFUND CHARGE'],
                ctrxn_type: 'DEBIT',
                ctrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                ctrxn_journey_date: airTicketInfo?.airticket_journey_date,
                ctrxn_pax: airTicketInfo?.airticket_pax_name,
                ctrxn_pnr: airTicketInfo?.airticket_pnr,
                ctrxn_route: airTicketInfo?.airticket_route_or_sector,
                ctrxn_voucher: voucher_no,
              };

              const vendorTransPenalty: IVTrxn = {
                com_vendor: airTicketInfo?.comb_vendor,
                vtrxn_amount: item?.vrefund_charge_amount,
                vtrxn_created_at: refunds.atrefund_create_date,
                vtrxn_note: refund_note,
                vtrxn_particular_id: this.trnType['REFUND PENALTIES'],
                vtrxn_type: 'CREDIT',
                vtrxn_airticket_no: airTicketInfo?.airticket_ticket_no,
                vtrxn_pax: airTicketInfo?.airticket_pax_name,
                vtrxn_pnr: airTicketInfo?.airticket_pnr,
                vtrxn_route: airTicketInfo?.airticket_route_or_sector,
                vtrxn_voucher: voucher_no,
              };

              refundItems.push({
                refundItem: {
                  ...restItem,
                  client_refund,
                  vendor_refund,
                  sale_return_vou1,
                  sale_return_vou2,
                  purchase_return_vou1,
                  purchase_return_vou2,
                  penalty_vou_1,
                  penalty_vou_2,
                  extra_fee_vou_1,
                  extra_fee_vou_2,
                },
                clientTrans,
                vendorTrans,
                clientTransExtraFee,
                vendorTransPenalty,
              });
            } catch (itemErr) {
              console.error('Error processing refund item:', item, itemErr);
            }
          }

          const refundPayload: IRefundDb = {
            com_client,
            client_id: refunds.atrefund_client_id,
            combined_id: refunds.atrefund_combined_id,
            refund_by: 1666,
            refund_date: refunds.atrefund_date,
            refund_note: refunds.atrefund_note,
            voucher_no,
            sales_price: refunds.invoice_sub_total,
            purchase_price: 0,
            total_penalties: refunds.atrefund_profit,
            client_extra_fee: 0,
            client_refund_amount: refunds.atrefund_cl_return,
            vendor_refund_amount: refunds.atrefund_vendor_return,
            created_by: 1666,
            org_agency: 154,
            rf_type: 'AIR_TICKET',
          };

          const refund_id = await conn.insertRefund(refundPayload);
          const refundsItems: any = [];

          for (const item of refundItems) {
            try {
              const {
                clientTrans,
                vendorTrans,
                clientTransExtraFee,
                vendorTransPenalty,
                refundItem,
              } = item;

              const clTrxId = await conn.insertClientTrans({
                ...clientTrans,
                ctrxn_ref_id: refund_id,
              });

              const vTrxId = await conn.insertVendorTrans({
                ...vendorTrans,
                vtrxn_ref_id: refund_id,
              });

              const clExTrxId = await conn.insertClientTrans({
                ...clientTransExtraFee,
                ctrxn_ref_id: refund_id,
              });

              const vPenTrxId = await conn.insertVendorTrans({
                ...vendorTransPenalty,
                vtrxn_ref_id: refund_id,
              });

              const getTicketWiseId =
                await conn.getTicketInfoByTicketNumberDouble(
                  refundItem.airticket_ticket_no
                );

              refundsItems.push({
                refund_id,
                airticket_id: getTicketWiseId.airticket_id,
                penalties: refundItem.vrefund_charge_amount,
                invoice_id: refunds.atrefund_invoice_id,
                sale_return_vou1: +refundItem.sale_return_vou1 || null,
                sale_return_vou2: +refundItem.sale_return_vou2 || null,
                purchase_return_vou1: +refundItem.purchase_return_vou1 || null,
                purchase_return_vou2: +refundItem.purchase_return_vou2 || null,
                penalty_vou_1: +refundItem.penalty_vou_1 || null,
                penalty_vou_2: +refundItem.penalty_vou_2 || null,
                extra_fee_vou_1: +refundItem.extra_fee_vou_1 || null,
                extra_fee_vou_2: +refundItem.extra_fee_vou_2 || null,
                v_penalty_trans_id:
                  vPenTrxId?.vendorTransId != null
                    ? Number(vPenTrxId.vendorTransId)
                    : null,
                cl_extra_fee_trans_id:
                  clExTrxId?.clTransId != null
                    ? Number(clExTrxId.clTransId)
                    : null,
                clTransId:
                  clTrxId?.clTransId != null ? Number(clTrxId.clTransId) : null,
                clComTransId:
                  clTrxId?.clComTransId != null
                    ? Number(clTrxId.clComTransId)
                    : null,
                vendorTransId:
                  vTrxId?.vendorTransId != null
                    ? Number(vTrxId.vendorTransId)
                    : null,
                vendorComTransId:
                  vTrxId?.vendorComTransId != null
                    ? Number(vTrxId.vendorComTransId)
                    : null,
              });
            } catch (subErr) {
              console.error('Error inserting refund sub-data:', subErr);
            }
          }

          await conn.insertRefundItems(refundsItems);
          await this.updateVoucher(req, 'ARF');
        } catch (error) {
          errorCount++;
          console.error('Error processing invoice:', error);

          // Extract error type from the error message or object
          let errorType = 'Unknown';
          if (error instanceof Error) {
            if (error.message.includes('trabill_invoices')) {
              errorType = 'Database Insert Error';
            } else if (error.message.includes('validation')) {
              errorType = 'Validation Error';
            }
            // Add more error type checks as needed
          }

          processingErrors.push({
            invoice: refunds, // or invoice.id if available
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });
          console.error('Error processing refund:', refunds, error);
        }
      }

      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: refundsData.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          invoices: refundsData,
        },
        errors: processingErrors,
        errorSummary: {
          totalErrors: errorCount,
          errorTypes: processingErrors.reduce((acc, err) => {
            acc[err.errorType || 'Unknown'] =
              (acc[err.errorType || 'Unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    });
  }
}
