import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';
import { Mistral } from '@mistralai/mistralai';
import MistralClient from '@mistralai/mistralai';
// import { MistralClient, uploadFile } from '@mistralai/client-ts';
import fs from 'fs';
import { Blob } from 'buffer'; // Import Blob from buffer
import fetch from 'node-fetch';
import axios from 'axios';
import FormData from 'form-data';
const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
import {
  airTicketNonCommissionPayloadFormatter,
  airTicketPayloadFormatter,
  invoiceReissueFormatter,
} from '../types/airticketutils';
import { any } from 'joi';
import {
  IAirTicketDb,
  IClTrxnBody,
  IFlightDetailsDb,
  IRefundDb,
  IVTrxn,
} from '../helpers/commonTypes';
import { formatDate } from '../helpers/common.helper';
import { numRound } from '../types/commonTypes';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';

class reissueService extends AbstractServices {
  constructor() {
    super();
  }
  public async reissueTransfer(req: Request) {
    const model = this.Model.ReissueModel();
    const commonModel = this.Model.agentDashboardModel();

    // const { data } = await model.singleEntryInvoicesReissue();

    const { data } = await model.singleEntryInvoicesReissue();

    const invoices: any = [];

    for (const itemData of data) {
      const ticketItems = await model.getReissueItems(itemData.invoice_id);

      const clientInfo = await commonModel.getSingleClientInfo(
        itemData.invoice_client_id
      );

      const tickets = await Promise.all(
        ticketItems.map(async (ticket) => {
          const ticketInfo = await commonModel.getReissuedInvoice(
            ticket.airticket_reissue_ticket_no
          );

          const singleVendor: any = await commonModel.getSingleEntryVendorInfo(
            ticket.airticket_vendor_id
          );

          const getAirlineId = await commonModel.getAirlineInfoAndId(
            ticket.airticket_airline_id
          );

          return {
            airticket_airline_id: getAirlineId.doubleAirlineId,
            airticket_id: ticket.airticket_id,
            previous_ticket_no: ticket.airticket_ticket_no,
            airticket_vendor_id: singleVendor.vendor_id,
            existing_airticket_id: ticket.existing_airticket_id,
            existing_invoiceid: ticket.existing_invoiceid,
            airticket_ticket_no: ticket.airticket_reissue_ticket_no,
            airticket_is_refund: ticket.airticket_is_refund,
            airticket_is_reissued: ticket.airticket_is_reissued,
            airticket_is_void: ticket.airticket_is_void,

            double_entry_prev_airticket_id: ticketInfo?.airticket_id ?? null,
            double_entry_prev_invoice_id:
              ticketInfo?.airticket_invoice_id ?? null,

            airticket_penalties: ticket.airticket_penalties,
            airticket_fare_difference: ticket.airticket_fare_difference,
            airticket_tax_difference: ticket.airticket_tax_difference,
            airticket_classes: ticket.airticket_classes,
            airticket_pnr: ticket.airticket_pnr,
            airticket_commission_percent: ticket.airticket_commission_percent,
            airticket_route_or_sector: ticket.airticket_routes,
            airticket_ait: ticket.airticket_ait,
            airticket_journey_date: ticket.airticket_journey_date,
            airticket_return_date: ticket.airticket_return_date,
            airticket_extra_fee: ticket.airticket_extra_fee,
            airticket_comvendor: `vendor-${singleVendor.vendor_id}`,
            vendor_name: singleVendor.vendor_name,
            airticket_client_price: ticket.airticket_client_price,
            airticket_purchase_price: ticket.airticket_purchase_price,
            airticket_profit: ticket.airticket_profit,
          };
        })
      );

      const employeeInfo = await commonModel.getEmployeeInfoAndId(
        itemData.invoice_sales_man_id
      );
      const userName = await commonModel.getUserInfoAndId(
        itemData.invoice_created_by
      );
      const invoice_part = {
        invoice_id: itemData.invoice_id,
        invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        clientId: clientInfo?.doubleClientId,
        invoice_org_agency: 154,
        invoice_created_by: userName.doubleUserId,
        invoice_sales_man_id: employeeInfo.doubleEmployeeId,
        invoice_sales_date: itemData.invoice_date,
        invoice_sub_total: itemData.net_total,
        tickets,
      };

      invoices.push(invoice_part);
    }

    return await this.db.transaction(async (trx) => {
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      const commonModel = this.Model.agentDashboardModel();
      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await invoiceReissueFormatter(invoice);

          // const invoice_no = await this.generateVoucher(req, 'ARI');
          const invoice_no = await this.superVoucher(req, 'ARI');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo({
            ...invoicePayload,
            invoice_org_agency: 154,
            invoice_created_by: invoice.invoice_created_by,
            invoice_no: invoice_no,
          });

          const clientNameGet = await invoiceModel.getClientName(
            Number(invoice.clientId)
          );

          // const clientInfo = await commonModel.getSingleClientInfo(
          //   invoice.invoice_client_id
          // );

          // console.log('clientNameGet', clientNameGet);

          for (const ticket of ticketsFormat) {
            const { airTicketDetails, clTransPayload, VTransPayload } = ticket;

            const {
              airticket_id,
              airticket_is_deleted,
              airticket_existing_airticket_id,
              airticket_existing_invoice,
              previous_ticket_no,
              ...restAirTicket
            } = airTicketDetails;

            const vendorNameGet = await invoiceModel.getVendorName(
              Number(ticket.airTicketDetails.airticket_vendor_id)
            );

            const constNameVendorIdGet = await invoiceModel.getVendorInfoByNo(
              airTicketDetails.airticket_ticket_no
            );

            // --------- SALES

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              // description: `Purchase ticket from ${
              //   constNameVendorIdGet.vendor_name !== null &&
              //   constNameVendorIdGet.vendor_name !== undefined
              //     ? constNameVendorIdGet.vendor_name
              //     : null
              // } on account`,
              description: `Purchase ticket from ${ticket?.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${ticket?.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: invoice_no,
              // ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_at: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: invoice_no,
              vtrxn_created_date: invoicePayload.invoice_sales_date,
              // vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });

            const airTicketItemPayload = {
              airticket_is_deleted: 0,
              airticket_client_id: invoice.clientId,
              // airticket_combined_id: null,
              airticket_ticket_no: airTicketDetails.previous_ticket_no,
              airticket_penalties: airTicketDetails.airticket_penalties,
              airticket_classes: airTicketDetails.airticket_classes,
              airticket_vendor_id: airTicketDetails.airticket_vendor_id,
              airticket_fare_difference:
                airTicketDetails.airticket_fare_difference,
              airticket_commission_percent:
                airTicketDetails.airticket_commission_percent,
              airticket_route_or_sector:
                airTicketDetails.airticket_route_or_sector,
              airticket_ait: airTicketDetails.airticket_ait,
              airticket_tax_difference: 0,
              airticket_pnr: airTicketDetails.airticket_pnr,
              airticket_airline_id: airTicketDetails.airticket_airline_id,
              airticket_client_price: airTicketDetails.airticket_client_price,
              airticket_purchase_price:
                airTicketDetails.airticket_purchase_price,
              airticket_profit: airTicketDetails.airticket_profit,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_existing_invoice:
                airTicketDetails.airticket_existing_invoice,
              airticket_existing_airticket_id:
                airTicketDetails.airticket_existing_airticket_id,
              airticket_is_refund: airTicketDetails.airticket_is_refund,
              airticket_is_reissued: airTicketDetails.airticket_is_reissued,
              airticket_is_void: airTicketDetails.airticket_is_void,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            await invoiceModel.insertAirTicketReissueItem(airTicketItemPayload);

            // await model.updateIsReissued(
            //   checkInvoiceNoWiseInfo.airticket_invoice_id,
            //   checkInvoiceNoWiseInfo.airticket_id
            // );
          }
          await this.updateVoucher(req, 'ARI');

          //content and history data must be added there
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
            invoice: invoice, // or invoice.id if available
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });
        }
      }
      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: invoices.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          invoices: invoices,
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
  // public async reissueTransfer(req: Request) {
  //   const model = this.Model.ReissueModel();
  //   const commonModel = this.Model.agentDashboardModel();

  //   // const { data } = await model.singleEntryInvoicesReissue();

  //   const { data } = await model.singleEntryInvoicesReissue();

  //   const invoices: any = [];

  //   for (const itemData of data) {
  //     const ticketItems = await model.singleEntryInvoicesAirTicketItemsReissue(
  //       itemData.invoice_id
  //     );
  //     const employeeInfo = await commonModel.getSingleEntryEmployeeInfo(
  //       itemData.invoice_sales_man_id
  //     );
  //     const clientInfo = await commonModel.getSingleClientInfo(
  //       itemData.invoice_client_id
  //     );
  //     const invoice_part = {
  //       invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
  //       invoice_org_agency: 154,
  //       invoice_no: 'HelloWorld12354',
  //       invoice_sales_man_id: employeeInfo?.doubleEmployeeId,
  //       invoice_sales_date: formatDate(itemData.invoice_date),
  //       invoice_sub_total: itemData.net_total,
  //       tickets: ticketItems.map((ticket) => ({
  //         airticket_airline_id: ticket.new_airline_id,
  //         airticket_id: ticket.airticket_id,
  //         previous_ticket_no: ticket.airticket_ticket_no,
  //         airticket_vendor_id: ticket.airticket_vendor_id,
  //         existing_airticket_id: ticket.existing_airticket_id,
  //         existing_invoiceid: ticket.existing_invoiceid,
  //         airticket_ticket_no: ticket.airticket_reissue_ticket_no,
  //         airticket_penalties: ticket.airticket_penalties,
  //         airticket_fare_difference: ticket.airticket_fare_difference,
  //         airticket_tax_difference: ticket.airticket_tax_difference,
  //         airticket_classes: ticket.airticket_classes,
  //         airticket_pnr: ticket.airticket_pnr,
  //         airticket_commission_percent: ticket.airticket_commission_percent,
  //         airticket_route_or_sector: ticket.airticket_routes,
  //         airticket_ait: ticket.airticket_ait,
  //         airticket_journey_date: ticket.airticket_journey_date,
  //         airticket_return_date: ticket.airticket_return_date,
  //         airticket_extra_fee: ticket.airticket_extra_fee,
  //         airticket_comvendor: ticket.airticket_comvendor,
  //         vendor_name: ticket.vendor_name,
  //         airticket_client_price: ticket.airticket_client_price,
  //         airticket_purchase_price: ticket.airticket_purchase_price,
  //         airticket_profit: ticket.airticket_profit,
  //       })),
  //     };

  //     invoices.push(invoice_part);
  //   }

  //   return {
  //     data: invoices,
  //     code: this.StatusCode.HTTP_OK,
  //   };

  //   return await this.db.transaction(async (trx) => {
  //     const processingErrors: Array<{
  //       invoice: any;
  //       error: string;
  //       errorType?: string;
  //     }> = [];
  //     let successCount = 0;
  //     let errorCount = 0;
  //     const commonModel = this.Model.agentDashboardModel();
  //     for (const invoice of invoices) {
  //       try {
  //         const { invoicePayload, ticketsFormat, client_name } =
  //           await invoiceReissueFormatter(invoice);

  //         // const invoice_no = await this.generateVoucher(req, 'ARI');
  //         const invoice_no = await this.superVoucher(req, 'ARI');

  //         const invoiceModel = this.Model.agentDashboardModel(trx);
  //         const invoiceId = await invoiceModel.insertInvoicesInfo({
  //           ...invoicePayload,
  //           invoice_org_agency: 154,
  //           invoice_created_by: 1666,
  //           invoice_no: invoice_no,
  //         });

  //         const clientNameGet = await invoiceModel.getClientName(
  //           Number(invoicePayload.invoice_client_id)
  //         );

  //         console.log('clientNameGet', clientNameGet);

  //         for (const ticket of ticketsFormat) {
  //           const {
  //             airTicketDetails,
  //             clTransPayload,
  //             VTransPayload,
  //             vendor_name,
  //           } = ticket;

  //           const {
  //             airticket_id,
  //             airticket_is_deleted,
  //             airticket_existing_airticket_id,
  //             airticket_existing_invoice,
  //             previous_ticket_no,
  //             ...restAirTicket
  //           } = airTicketDetails;

  //           const vendorNameGet = await invoiceModel.getVendorName(
  //             Number(ticket.airTicketDetails.airticket_vendor_id)
  //           );

  //           const constNameVendorIdGet = await invoiceModel.getVendorInfoByNo(
  //             airTicketDetails.airticket_ticket_no
  //           );

  //           // --------- SALES

  //           const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 1,
  //             acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
  //             voucher_no: `Sales-${invoiceId}`,
  //             amount: restAirTicket.airticket_client_price,
  //             trans_type: 'DEBIT',
  //             description: `Ticket sale to ${clientNameGet.client_name} on account`,
  //             payment_type: 'INVOICE',
  //           });

  //           const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 2,
  //             acc_head_id: this.accHead['Air Ticket(Sales)'],
  //             voucher_no: `Sales-${invoiceId}`,
  //             amount: restAirTicket.airticket_client_price,
  //             trans_type: 'CREDIT',
  //             description: `Ticket sale to ${clientNameGet.client_name} on account`,
  //             payment_type: 'INVOICE',
  //           });

  //           const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 1,
  //             acc_head_id: this.accHead['Air Ticket(Purchase)'],
  //             voucher_no: `Purchase-${invoiceId}`,
  //             amount: restAirTicket.airticket_purchase_price,
  //             trans_type: 'DEBIT',
  //             description: `Purchase ticket from ${
  //               constNameVendorIdGet.vendor_name !== null &&
  //               constNameVendorIdGet.vendor_name !== undefined
  //                 ? constNameVendorIdGet.vendor_name
  //                 : null
  //             } on account`,
  //             payment_type: 'INVOICE',
  //           });

  //           const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 2,
  //             acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
  //             voucher_no: `Purchase-${invoiceId}`,
  //             amount: restAirTicket.airticket_purchase_price,
  //             trans_type: 'CREDIT',
  //             description: `Purchase ticket from ${
  //               constNameVendorIdGet.vendor_name !== null &&
  //               constNameVendorIdGet.vendor_name !== undefined
  //                 ? constNameVendorIdGet.vendor_name
  //                 : null
  //             } on account`,
  //             payment_type: 'INVOICE',
  //           });

  //           const clTrans = await invoiceModel.insertClientTrans({
  //             ...clTransPayload,
  //             ctrxn_voucher: invoice_no,
  //             // ctrxn_voucher: `ClientTrans-${invoiceId}`,
  //             ctrxn_created_date: invoicePayload.invoice_sales_date,
  //             ctrxn_ref_id: invoiceId,
  //           });

  //           const vTrans = await invoiceModel.insertVendorTrans({
  //             ...VTransPayload,
  //             vtrxn_voucher: invoice_no,
  //             vtrxn_created_date: invoicePayload.invoice_sales_date,
  //             // vtrxn_voucher: `VendorTrans-${invoiceId}`,
  //             vtrxn_ref_id: invoiceId,
  //           });

  //           const checkInvoiceNoWiseInfo = await model.getAirTicketWiseInfoNew(
  //             airTicketDetails.airticket_ticket_no
  //           );
  //           // const checkInvoiceNoWiseInfo = await model.getTicketInfoByNumber(
  //           //   airTicketDetails.previous_ticket_no
  //           // );

  //           // const airTicketItemPayload = {
  //           //   airticket_existing_airticket_id:
  //           //     checkInvoiceNoWiseInfo.airticket_id,
  //           //   airticket_is_deleted: 0,
  //           //   // airticket_id: checkInvoiceNoWiseInfo.airticket_id,
  //           //   airticket_existing_invoice:
  //           //     checkInvoiceNoWiseInfo.airticket_invoice_id,
  //           //   airticket_client_id: checkInvoiceNoWiseInfo.airticket_client_id,
  //           //   airticket_combined_id:
  //           //     checkInvoiceNoWiseInfo.airticket_combined_id,
  //           //   airticket_ticket_no: airTicketDetails.airticket_ticket_no,
  //           //   airticket_penalties: airTicketDetails.airticket_penalties,
  //           //   airticket_classes: airTicketDetails.airticket_classes,
  //           //   airticket_fare_difference:
  //           //     airTicketDetails.airticket_fare_difference,
  //           //   airticket_commission_percent:
  //           //     airTicketDetails.airticket_commission_percent,
  //           //   airticket_route_or_sector:
  //           //     airTicketDetails.airticket_route_or_sector,
  //           //   airticket_ait: airTicketDetails.airticket_ait,
  //           //   airticket_tax_difference: 0,
  //           //   airticket_pnr: airTicketDetails.airticket_pnr,
  //           //   airticket_airline_id: airTicketDetails.airticket_airline_id,
  //           //   airticket_client_price: airTicketDetails.airticket_client_price,
  //           //   airticket_purchase_price:
  //           //     airTicketDetails.airticket_purchase_price,
  //           //   airticket_profit: airTicketDetails.airticket_profit,
  //           //   airticket_cl_com_trans_id: clTrans.clComTransId,
  //           //   airticket_cl_trans_id: clTrans.clTransId,
  //           //   airticket_invoice_id: invoiceId,
  //           //   airticket_org_agency: 154,
  //           //   airticket_v_com_trans_id: vTrans.vendorComTransId,
  //           //   airticket_v_trans_id: vTrans.vendorTransId,
  //           //   airticket_ac_sale_vou1: ac_sale_vou1,
  //           //   airticket_ac_sale_vou2: ac_sale_vou2,
  //           //   airticket_ac_pur_vou1: ac_pur_vou1,
  //           //   airticket_ac_pur_vou2: ac_pur_vou2,
  //           // };

  //           const airTicketItemPayload = {
  //             airticket_is_deleted: 0,
  //             airticket_client_id: checkInvoiceNoWiseInfo.airticket_client_id,
  //             airticket_combined_id:
  //               checkInvoiceNoWiseInfo.airticket_combined_id,
  //             airticket_ticket_no: airTicketDetails.airticket_ticket_no,
  //             airticket_penalties: airTicketDetails.airticket_penalties,
  //             airticket_classes: airTicketDetails.airticket_classes,
  //             airticket_fare_difference:
  //               airTicketDetails.airticket_fare_difference,
  //             airticket_commission_percent:
  //               airTicketDetails.airticket_commission_percent,
  //             airticket_route_or_sector:
  //               airTicketDetails.airticket_route_or_sector,
  //             airticket_ait: airTicketDetails.airticket_ait,
  //             airticket_tax_difference: 0,
  //             airticket_pnr: airTicketDetails.airticket_pnr,
  //             airticket_airline_id: airTicketDetails.airticket_airline_id,
  //             airticket_client_price: airTicketDetails.airticket_client_price,
  //             airticket_purchase_price:
  //               airTicketDetails.airticket_purchase_price,
  //             airticket_profit: airTicketDetails.airticket_profit,
  //             airticket_cl_com_trans_id: clTrans.clComTransId,
  //             airticket_cl_trans_id: clTrans.clTransId,
  //             airticket_invoice_id: invoiceId,
  //             airticket_org_agency: 154,
  //             airticket_v_com_trans_id: vTrans.vendorComTransId,
  //             airticket_v_trans_id: vTrans.vendorTransId,
  //             airticket_ac_sale_vou1: ac_sale_vou1,
  //             airticket_ac_sale_vou2: ac_sale_vou2,
  //             airticket_ac_pur_vou1: ac_pur_vou1,
  //             airticket_ac_pur_vou2: ac_pur_vou2,
  //           };

  //           await invoiceModel.insertAirTicketReissueItem(airTicketItemPayload);

  //           // await model.updateIsReissued(
  //           //   checkInvoiceNoWiseInfo.airticket_invoice_id,
  //           //   checkInvoiceNoWiseInfo.airticket_id
  //           // );
  //         }
  //         await this.updateVoucher(req, 'ARI');

  //         //content and history data must be added there
  //       } catch (error) {
  //         errorCount++;
  //         console.error('Error processing invoice:', error);

  //         // Extract error type from the error message or object
  //         let errorType = 'Unknown';
  //         if (error instanceof Error) {
  //           if (error.message.includes('trabill_invoices')) {
  //             errorType = 'Database Insert Error';
  //           } else if (error.message.includes('validation')) {
  //             errorType = 'Validation Error';
  //           }
  //           // Add more error type checks as needed
  //         }

  //         processingErrors.push({
  //           invoice: invoice, // or invoice.id if available
  //           error: error instanceof Error ? error.message : String(error),
  //           errorType: errorType,
  //         });
  //       }
  //     }
  //     return {
  //       success: errorCount === 0,
  //       code:
  //         errorCount === 0
  //           ? this.StatusCode.HTTP_OK
  //           : this.StatusCode.HTTP_PARTIAL_CONTENT,
  //       data: {
  //         totalInvoices: invoices.length,
  //         processedSuccessfully: successCount,
  //         failedToProcess: errorCount,
  //         invoices: invoices,
  //       },
  //       errors: processingErrors,
  //       errorSummary: {
  //         totalErrors: errorCount,
  //         errorTypes: processingErrors.reduce((acc, err) => {
  //           acc[err.errorType || 'Unknown'] =
  //             (acc[err.errorType || 'Unknown'] || 0) + 1;
  //           return acc;
  //         }, {} as Record<string, number>),
  //       },
  //     };
  //   });
  // }
}
export default reissueService;
