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
import {
  formatDate,
  getPAymentReceiptOverallPaymentInvoice,
  getReceiptOverallPaymentInvoice,
  separateCombClientToId,
} from '../helpers/common.helper';
import { numRound } from '../types/commonTypes';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';

class nonComService extends AbstractServices {
  constructor() {
    super();
  }
  public async testInvoicesNon(req: Request) {
    const model = this.Model.NonComModel();
    const modelPrev = this.Model.agentDashboardModel();
    const processingErrors: Array<{
      invoice: any;
      error: string;
      errorType?: string;
    }> = [];
    let successCount = 0;
    let errorCount = 0;

    const data = await model.singleEntryInvoices();

    const invoices: any = [];

    for (const itemData of data) {
      const ticketItems = await model.singleEntryInvoicesAirTicketItems(
        itemData.invoice_id
      );

      const commonModel = this.Model.agentDashboardModel();

      const employeeInfo = await commonModel.getEmployeeInfoAndId(
        itemData.invoice_sales_man_id
      );
      const clientInfo = await commonModel.getSingleClientInfo(
        itemData.invoice_client_id
      );
      const userName = await commonModel.getUserInfoAndId(
        itemData.invoice_created_by
      );

      const invoice_part = {
        // invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        // invoice_org_agency: 154,
        // invoice_no: itemData.invoice_no,
        // invoice_sales_man_id: employeeInfo?.doubleEmployeeId,
        // invoice_sales_date: formatDate(itemData.invoice_sales_date),
        // invoice_sub_total: itemData.invoice_sub_total,
        // invoice_agent_id: null,
        // invoice_agent_commission: 0,
        // invoice_show_passport_details: 0,
        // invoice_show_prev_due: 1,
        // invoice_show_unit: 1,
        // invoice_show_discount: 1,
        // invoice_total_profit: itemData.invoice_total_profit,
        // invoice_note: itemData.invoice_note,

        invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        clientCode: clientInfo?.clientCode,
        salesMan: employeeInfo?.doubleEmployeeId,
        salesManname: employeeInfo?.employeeConn,
        invoice_sales_date: formatDate(itemData.invoice_sales_date),
        invoice_created_by: userName.doubleUserId,
        created_by: userName.userConn,
        tickets: await Promise.all(
          ticketItems.map(async (ticket) => {
            // Fetch flight details dynamically for each ticket
            const flightDetails: any = await commonModel.singleFlightNonCom(
              ticket.airticket_id
            );

            const airlineName = await commonModel.getAirlineInfo(
              ticket.airticket_airline_id
            );

            const singleVendor: any =
              await commonModel.getSingleEntryVendorInfo(
                ticket.airticket_vendor_id
              );

            const passportDetails: any = await commonModel.singlePassport(
              itemData.invoice_id,
              ticket.airticket_id
            );
            const getAirlineId = await commonModel.getAirlineInfoAndId(
              ticket.airticket_airline_id
            );

            return {
              airticket_org_agency: 154,
              airticket_ticket_type: ticket.airticket_ticket_type,
              airticket_classes: ticket.airticket_classes,
              airticket_ticket_no: ticket.airticket_ticket_no,
              airticket_comvendor: singleVendor.vendor_id
                ? `vendor-${singleVendor.vendor_id}`
                : ticket?.airticket_vendor_combine_id
                ? `combine-${ticket.airticket_vendor_combine_id}`
                : ticket?.airticket_comvendor,
              vendor_name: singleVendor?.vendor_name,
              airline: airlineName,
              // getAirlineId: getAirlineId,
              airticket_airline_id: getAirlineId.doubleAirlineId,
              airticket_extra_fee: ticket.airticket_extra_fee,
              airticket_issue_date: ticket.airticket_issue_date,
              airticket_profit: ticket.airticket_profit,
              airticket_is_reissued: ticket?.airticket_is_reissued,
              airticket_is_refund: ticket?.airticket_is_refund,
              airticket_is_void: ticket?.airticket_is_void,

              airticket_client_price: ticket.airticket_client_price,
              airticket_purchase_price: ticket.airticket_purchase_price,
              airticket_pnr: ticket.airticket_pnr,
              airticket_journey_date: ticket.airticket_journey_date,
              airticket_return_date: ticket.airticket_return_date,
              airticket_route_or_sector: ticket.airticket_routes,

              passport_id: passportDetails?.p_passport_id || null,
              passport_no: passportDetails?.p_passport_no || null,
              passport_name: passportDetails?.p_passport_name || null,
              passport_person_type: passportDetails?.p_passport_type || null,
              passport_email: passportDetails?.p_email || null,
              passport_mobile_no: passportDetails?.p_mobile_no || null,

              flight_details: flightDetails
                ? await Promise.all(
                    flightDetails.map(async (flight: any) => {
                      const fromAirportName = await commonModel.getAirportInfo(
                        flight.fltdetails_from_airport_id
                      );
                      const toAirportName = await commonModel.getAirportInfo(
                        flight.fltdetails_to_airport_id
                      );
                      const airline = await commonModel.getAirlineInfoAndId(
                        flight.fltdetails_airline_id
                      );
                      return {
                        from_airport_id: fromAirportName.doubleAirportId,
                        to_airport_id: toAirportName.doubleAirportId,
                        airline_id: airline.doubleAirlineId,
                        fltdetails_flight_no: flight.fltdetails_flight_no,
                        fltdetails_fly_date: flight.fltdetails_fly_date,
                        fltdetails_departure_time:
                          flight.fltdetails_departure_time,
                        fltdetails_arrival_time: flight.fltdetails_arrival_time,
                      };
                    })
                  )
                : [],
            };
          })
        ),
      };

      invoices.push(invoice_part);
    }

    // return {
    //   success: true,
    //   code: this.StatusCode.HTTP_OK,
    //   data: invoices.filter(
    //     (invoice: any) => invoice.tickets && invoice.tickets.length > 0
    //   ),
    // };

    return await this.db.transaction(async (trx) => {
      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await airTicketNonCommissionPayloadFormatter(invoice);

          // const invoice_no = await this.generateVoucher(req, 'ANC');
          const invoice_no = await this.superVoucher(req, 'ANC');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo({
            ...invoicePayload,
            invoice_org_agency: 154,
            invoice_created_by: invoice.invoice_created_by,
            invoice_sales_man_id: invoice.salesMan,
            invoice_show_discount: 0,
            invoice_show_prev_due: 0,
            invoice_no,
          });

          const clientNameGet = await invoiceModel.getClientName(
            Number(invoicePayload.invoice_client_id)
          );
          for (const ticket of ticketsFormat) {
            const {
              airTicketDetails,
              flightDetails,
              passportDetails,
              clTransPayload,
              VTransPayload,
              vendor_name,
            } = ticket;

            const { airticket_id, airticket_is_deleted, ...restAirTicket } =
              airTicketDetails;

            const vendorNameGet = await invoiceModel.getVendorName(
              Number(ticket.airTicketDetails.airticket_vendor_id)
            );

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id:
                this.accHead['Air Ticket-Non Commission(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket-Non Commission(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket-Non Commission(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id:
                this.accHead['Air Ticket-Non Commission(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: invoice_no,
              // ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_date: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: invoice_no,
              vtrxn_created_date: invoicePayload.invoice_sales_date,
              // vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });
            console.log('ticketBro', ticket.airTicketDetails);
            const airTicketItemPayload = {
              ...restAirTicket,
              airticket_gross_fare:
                ticket.airTicketDetails.airticket_client_price,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            console.log('airTicketItemPayload', airTicketItemPayload);

            const airTicketId = await model.insertAirTicketItem(
              airTicketItemPayload
            );

            if (passportDetails) {
              await invoiceModel.insertAirTicketPax({
                p_passport_id: passportDetails?.p_passport_id,
                p_passport_no: passportDetails?.p_passport_no,
                p_passport_name: passportDetails?.p_passport_name,
                p_passport_type: passportDetails?.p_passport_type,
                p_email: passportDetails?.p_email,
                p_mobile_no: passportDetails?.p_mobile_no,
                p_airticket_id: airTicketId,
                p_invoice_id: invoiceId,
              });
            }

            if (flightDetails) {
              const flightsDetails: IFlightDetailsDb[] = flightDetails?.map(
                (item: any) => {
                  return {
                    fltdetails_from_airport_id: item.from_airport_id
                      ? item.from_airport_id
                      : null,
                    fltdetails_to_airport_id: item.to_airport_id
                      ? item.to_airport_id
                      : null,
                    fltdetails_airline_id: item.airline_id
                      ? item.airline_id
                      : null,
                    fltdetails_flight_no: item.fltdetails_flight_no || null,
                    fltdetails_fly_date: item.fltdetails_fly_date || null,
                    fltdetails_arrival_time:
                      item.fltdetails_arrival_time || null,
                    fltdetails_departure_time:
                      item.fltdetails_departure_time || null,
                    fltdetails_airticket_id: airTicketId,
                    fltdetails_invoice_id: invoiceId,
                  };
                }
              );

              if (flightsDetails && flightsDetails.length > 0) {
                await invoiceModel.insertAirTicketFlights(flightsDetails);
              }
            }
          }
          await this.updateVoucher(req, 'ANC');

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
  public async testReissueInvoicenoncom(req: Request) {
    const model = this.Model.NonComModel();
    const modelPrev = this.Model.agentDashboardModel();
    const processingErrors: Array<{
      invoice: any;
      error: string;
      errorType?: string;
    }> = [];
    let successCount = 0;
    let errorCount = 0;

    const data = await model.singleEntryInvoices();

    const invoices: any = [];

    // for (const itemData of data) {
    //   const ticketItems = await model.singleEntryInvoicesAirTicketItems(
    //     itemData.invoice_id
    //   );

    //   const invoice_part = {
    //     invoice_combclient_id: `client-${itemData.invoice_client_id}`,
    //     invoice_org_agency: 154,
    //     invoice_no: itemData.invoice_no,
    //     invoice_sales_man_id: itemData.invoice_sales_man_id,
    //     invoice_sales_date: formatDate(itemData.invoice_sales_date),
    //     invoice_sub_total: itemData.invoice_sub_total,
    //     invoice_agent_id: null,
    //     invoice_agent_commission: 0,
    //     invoice_show_passport_details: 0,
    //     invoice_show_prev_due: 1,
    //     invoice_show_unit: 1,
    //     invoice_show_discount: 1,
    //     invoice_note: itemData.invoice_note,
    //     tickets: ticketItems.map((ticket) => ({
    //       airticket_org_agency: 154,
    //       airticket_ticket_type: ticket.airticket_ticket_type,
    //       airticket_classes: ticket.airticket_classes,
    //       airticket_ticket_no: ticket.airticket_ticket_no,
    //       airticket_comvendor: ticket?.airticket_vendor_id
    //         ? `vendor-${ticket.airticket_vendor_id}`
    //         : ticket?.airticket_vendor_combine_id
    //         ? `combine-${ticket.airticket_vendor_combine_id}`
    //         : ticket?.airticket_comvendor,
    //       vendor_name: 'Shamim Al Mamon',
    //       airticket_airline_id: ticket.airticket_airline_id,
    //       airticket_extra_fee: ticket.airticket_extra_fee,
    //       airticket_issue_date: ticket.airticket_issue_date,
    //       airticket_profit: ticket.airticket_profit,
    //       airticket_client_price: ticket.airticket_client_price,
    //       airticket_purchase_price: ticket.airticket_purchase_price,
    //       airticket_pnr: ticket.airticket_pnr,
    //       airticket_journey_date: ticket.airticket_journey_date,
    //       airticket_return_date: ticket.airticket_return_date,
    //       passport_id: ticket.airticket_passport_id,
    //       passport_no: 'P0292292922',
    //       passport_name: 'MOHAMMAD SHAMIM AL MAMON',
    //       passport_person_type: 'Adult',
    //       passport_email: 'nazmul.m360ict@gmail.com',
    //       passport_mobile_no: '01888798798',
    //       passport_date_of_birth: '1975-07-03T18:00:00.000Z',
    //       passport_date_of_expire: '2031-11-01T00:00:00.000Z',
    //       airticket_route_or_sector: ticket.airticket_routes,
    //       // taxes_commission: [
    //       //   {
    //       //     airline_commission: 18,
    //       //     airline_taxes: 250,
    //       //     airline_tax_type: 'YQ',
    //       //   },
    //       //   {
    //       //     airline_commission: 4,
    //       //     airline_tax_type: 'YR',
    //       //     airline_taxes: 50,
    //       //   },
    //       // ],
    //       // flight_details: [
    //       //   {
    //       //     fltdetails_from_airport_id: 358,
    //       //     fltdetails_to_airport_id: 394,
    //       //     fltdetails_airline_id: 109,
    //       //     fltdetails_flight_no: 713,
    //       //     fltdetails_fly_date: '2024-10-23',
    //       //     fltdetails_departure_time: '14:38:41',
    //       //     fltdetails_arrival_time: '14:38:43',
    //       //   },
    //       // ],
    //     })),
    //   };

    //   invoices.push(invoice_part);
    // }
    for (const itemData of data) {
      const ticketItems = await model.singleEntryInvoicesAirTicketItems(
        itemData.invoice_id
      );

      const commonModel = this.Model.agentDashboardModel();

      const employeeInfo = await commonModel.getSingleEntryEmployeeInfo(
        itemData.invoice_sales_man_id
      );
      const clientInfo = await commonModel.getSingleClientInfo(
        itemData.invoice_client_id
      );

      const invoice_part = {
        invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        invoice_org_agency: 154,
        invoice_no: itemData.invoice_no,
        invoice_sales_man_id: employeeInfo?.doubleEmployeeId,
        invoice_sales_date: formatDate(itemData.invoice_sales_date),
        invoice_sub_total: itemData.invoice_sub_total,
        invoice_agent_id: null,
        invoice_agent_commission: 0,
        invoice_show_passport_details: 0,
        invoice_show_prev_due: 1,
        invoice_show_unit: 1,
        invoice_show_discount: 1,
        invoice_total_profit: itemData.invoice_total_profit,
        invoice_note: itemData.invoice_note,
        tickets: await Promise.all(
          ticketItems.map(async (ticket) => {
            // Fetch flight details dynamically for each ticket
            const flightDetails: any = await modelPrev.singleFlightNonCom(
              ticket.airticket_id
            );
            const taxDetails: any = await modelPrev.singleTax(
              ticket.airticket_id
            );

            const singleVendor: any =
              await commonModel.getSingleEntryVendorInfo(
                ticket.airticket_vendor_id
              );

            const passportDetails: any = await modelPrev.singlePassport(
              itemData.invoice_id,
              ticket.airticket_id
            );

            return {
              airticket_org_agency: 154,
              airticket_ticket_type: ticket.airticket_ticket_type,
              airticket_classes: ticket.airticket_classes,
              airticket_ticket_no: ticket.airticket_ticket_no,
              airticket_comvendor: singleVendor.vendor_id
                ? `vendor-${singleVendor.vendor_id}`
                : ticket?.airticket_vendor_combine_id
                ? `combine-${ticket.airticket_vendor_combine_id}`
                : ticket?.airticket_comvendor,
              vendor_name: singleVendor?.vendor_name,
              airticket_airline_id: ticket.airticket_airline_id,
              airticket_extra_fee: ticket.airticket_extra_fee,
              airticket_issue_date: ticket.airticket_issue_date,
              airticket_profit: ticket.airticket_profit,

              airticket_client_price: ticket.airticket_client_price,
              airticket_purchase_price: ticket.airticket_purchase_price,
              airticket_pnr: ticket.airticket_pnr,
              airticket_journey_date: ticket.airticket_journey_date,
              airticket_return_date: ticket.airticket_return_date,
              airticket_route_or_sector: ticket.airticket_routes,

              passport_id: passportDetails?.p_passport_id || null,
              passport_no: passportDetails?.p_passport_no || null,
              passport_name: passportDetails?.p_passport_name || null,
              passport_person_type: passportDetails?.p_passport_type || null,
              passport_email: passportDetails?.p_email || null,
              passport_mobile_no: passportDetails?.p_mobile_no || null,

              flight_details: flightDetails
                ? flightDetails.map((flight: any) => ({
                    fltdetails_from_airport_id:
                      flight.fltdetails_from_airport_id,
                    fltdetails_to_airport_id: flight.fltdetails_to_airport_id,
                    fltdetails_airline_id: flight.fltdetails_airline_id,
                    fltdetails_flight_no: flight.fltdetails_flight_no,
                    fltdetails_fly_date: flight.fltdetails_fly_date,
                    fltdetails_departure_time: flight.fltdetails_departure_time,
                    fltdetails_arrival_time: flight.fltdetails_arrival_time,
                  }))
                : [],
            };
          })
        ),
      };

      invoices.push(invoice_part);
    }

    return await this.db.transaction(async (trx) => {
      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await airTicketNonCommissionPayloadFormatter(invoice);

          // const invoice_no = await this.generateVoucher(req, 'ANC');
          const invoice_no = await this.superVoucher(req, 'ANC');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo({
            ...invoicePayload,
            invoice_total_profit: invoice.invoice_total_profit,
            invoice_sub_total: invoice.invoice_sub_total,
            invoice_org_agency: 154,
            invoice_created_by: 1666,
            invoice_no: invoice_no,
          });

          const clientNameGet = await invoiceModel.getClientName(
            Number(invoicePayload.invoice_client_id)
          );
          for (const ticket of ticketsFormat) {
            const {
              airTicketDetails,
              flightDetails,
              passportDetails,
              clTransPayload,
              VTransPayload,
              vendor_name,
            } = ticket;

            const { airticket_id, airticket_is_deleted, ...restAirTicket } =
              airTicketDetails;

            const vendorNameGet = await invoiceModel.getVendorName(
              Number(ticket.airTicketDetails.airticket_vendor_id)
            );

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id:
                this.accHead['Air Ticket-Non Commission(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket-Non Commission(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket-Non Commission(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id:
                this.accHead['Air Ticket-Non Commission(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: invoice_no,
              // ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_date: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: invoice_no,
              vtrxn_created_date: invoicePayload.invoice_sales_date,
              // vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });
            console.log('ticketBro', ticket.airTicketDetails);
            const airTicketItemPayload = {
              ...restAirTicket,
              airticket_gross_fare:
                ticket.airTicketDetails.airticket_client_price,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            console.log('airTicketItemPayload', airTicketItemPayload);

            const airTicketId = await model.insertAirTicketItem(
              airTicketItemPayload
            );

            if (passportDetails) {
              console.log('NewGameStarts', passportDetails);
              await invoiceModel.insertAirTicketPax({
                p_passport_id: passportDetails?.p_passport_id,
                p_passport_no: passportDetails?.p_passport_no,
                p_passport_name: passportDetails?.p_passport_name,
                p_email: passportDetails?.p_email,
                p_mobile_no: passportDetails?.p_mobile_no,
                p_airticket_id: airTicketId,
                p_invoice_id: invoiceId,
              });
            }

            if (flightDetails) {
              const flightsDetails: IFlightDetailsDb[] = flightDetails?.map(
                (item: any) => {
                  return {
                    fltdetails_from_airport_id: item.from_airport_id
                      ? item.from_airport_id
                      : null,
                    fltdetails_to_airport_id: item.to_airport_id
                      ? item.to_airport_id
                      : null,
                    fltdetails_airline_id: item.airline_id
                      ? item.airline_id
                      : null,
                    fltdetails_flight_no: item.fltdetails_flight_no || null,
                    fltdetails_fly_date: item.fltdetails_fly_date || null,
                    fltdetails_arrival_time:
                      item.fltdetails_arrival_time || null,
                    fltdetails_departure_time:
                      item.fltdetails_departure_time || null,
                    fltdetails_airticket_id: airTicketId,
                    fltdetails_invoice_id: invoiceId,
                  };
                }
              );

              if (flightsDetails && flightsDetails.length > 0) {
                await invoiceModel.insertAirTicketFlights(flightsDetails);
              }
            }
          }
          await this.updateVoucher(req, 'ANC');

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

  // public async receipt(req: Request) {
  //   const model = this.Model.receipt();
  //   const invoiceModel = this.Model.agentDashboardModel();
  //   const data = await model.singleEntryInvoicesReceipt();
  //   const invoices: any = [];
  //   for (const itemData of data) {
  //     const ticketItems = await model.singleReceiptItems(itemData.receipt_id);
  //     const masterReceipt = {
  //       receipt_account_id: itemData.receipt_account_id,
  //       receipt_discount: itemData.receipt_total_discount,
  //       receipt_org_agency: 154,

  //       account_name: await invoiceModel.getAccountInfo(
  //         itemData.receipt_account_id
  //       ),
  //       comb_client: itemData.receipt_client_id,
  //       client_name: await invoiceModel.getClientInfo(
  //         itemData.receipt_client_id
  //       ),

  //       // await invoiceModel.getClientNameSingle(
  //       //   itemData.comb_client
  //       // ),
  //       receipt_total: itemData.receipt_total_amount,
  //       receipt_date: itemData.receipt_payment_date,
  //       receipt_to: itemData.receipt_payment_to, //overall
  //       receipt_payment_type: itemData.receipt_payment_type, ///cash
  //       receipt_note: itemData.receipt_note,
  //       // transaction_no: null,
  //       // bank_name: 'Armaan Meow',
  //       // cheque_number: 'Armaan Meow',
  //       // cheque_date: 'Armaan Meow',
  //       receipt_amount: itemData.receipt_total_amount,
  //       invoices: ticketItems.map((ticket) => ({
  //         invoice_id: ticket.invclientpayment_invoice_id,
  //         amount: ticket.invclientpayment_amount,
  //         discount: 0,
  //         total: ticket.invclientpayment_amount - 0,
  //       })),
  //     };

  //     invoices.push(masterReceipt);
  //   }

  //   // return {
  //   //   data: invoices,
  //   //   code: this.StatusCode.HTTP_OK,
  //   // };

  //   return await this.db.transaction(async (trx) => {
  //     const processingErrors: Array<{
  //       invoice: any;
  //       error: string;
  //       errorType?: string;
  //     }> = [];
  //     let successCount = 0;
  //     let errorCount = 0;
  //     for (const rec of invoices) {
  //       try {
  //         // --------- RECEIPT
  //         let clTrans: {
  //           clComTransId: number | null;
  //           clTransId: number | null;
  //         } = {
  //           clComTransId: null,
  //           clTransId: null,
  //         };

  //         const { client_id, combined_id } = separateCombClientToId(
  //           'client-' + `${rec.comb_client}`
  //         );
  //         const receipt_no = await this.generateVoucher(req, 'MR');
  //         let receipt_voucher1: number | null = null;
  //         let receipt_voucher2: number | null = null;
  //         let receipt_cheque_id: number | null = null;
  //         if (rec.receipt_payment_type !== 'CHEQUE') {
  //           const accHeadId = await invoiceModel.getAccountName(
  //             rec.account_name
  //           );

  //           const voucherDescription = `Money receipt of ${rec.receipt_total}/- from ${rec.client_name} through  ${rec.receipt_payment_type}.`;

  //           receipt_voucher1 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 1,
  //             acc_head_id: accHeadId,
  //             voucher_no: `${receipt_no}R`,
  //             amount: rec.receipt_amount,
  //             trans_type: 'DEBIT',
  //             description: voucherDescription,
  //             payment_type: 'RECEIPT',
  //           });

  //           receipt_voucher2 = await invoiceModel.insertAccVoucherDb({
  //             serial_no: 2,
  //             acc_head_id: this.accHead['Accounts Receivables'], // ACCOUNT RECEIVABLE
  //             voucher_no: `${receipt_no}R`,
  //             amount: rec.receipt_amount,
  //             trans_type: 'CREDIT',
  //             description: voucherDescription,
  //             payment_type: 'RECEIPT',
  //           });
  //           clTrans = await invoiceModel.insertClientTrans({
  //             ctrxn_voucher: receipt_no,
  //             client_id,
  //             combined_id,
  //             ctrxn_amount: rec.receipt_total,
  //             ctrxn_created_at: rec.receipt_date,
  //             ctrxn_note: rec.receipt_note,
  //             ctrxn_particular_id: 17,
  //             ctrxn_type: 'CREDIT',
  //             ctrxn_pay_type: rec.receipt_payment_type,
  //           });
  //         } else {
  //           receipt_cheque_id = await invoiceModel.insertCheque({
  //             cheque_org_agency: 154,
  //             cheque_voucher_no: receipt_no,
  //             cheque_number: rec.cheque_number,
  //             cheque_bank_name: rec.bank_name,
  //             cheque_withdraw_date: rec.cheque_date,
  //             cheque_note: rec.receipt_note,
  //             cheque_amount: rec.receipt_total,
  //             cheque_type: 'RECEIPT',
  //           });
  //         }

  //         const accountIDGet = await invoiceModel.getAccountID(
  //           rec.account_name
  //         );
  //         const receiptPayload: any = {
  //           comb_client: rec.comb_client,
  //           bank_name: rec.bank_name,
  //           cheque_date: rec.cheque_date,
  //           cheque_number: rec.cheque_number,
  //           receipt_voucher1: receipt_voucher1,
  //           receipt_voucher2: receipt_voucher2,
  //           receipt_account_id: accountIDGet,
  //           receipt_note: rec.receipt_note,
  //           receipt_amount: rec.receipt_amount,
  //           receipt_client_id: client_id,
  //           receipt_cl_trxn_id: clTrans?.clTransId,
  //           receipt_combined_id: combined_id,
  //           receipt_com_trxn_id: clTrans?.clComTransId,
  //           receipt_created_by: 1666,
  //           receipt_date: rec.receipt_date,
  //           receipt_discount: rec.receipt_discount,
  //           receipt_no: receipt_no,
  //           receipt_org_agency: 154,
  //           receipt_to: rec.receipt_to,
  //           receipt_payment_type: rec.receipt_payment_type,
  //           receipt_status:
  //             rec.receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS',
  //           receipt_total: rec.receipt_total,
  //           received_by: 1481,
  //           transaction_no: null,
  //           receipt_cheque_id: receipt_cheque_id,
  //           last_balance: 0,
  //         };

  //         // Mapping for receipt_payment_type
  //         const paymentTypeMapping: any = {
  //           1: 'CASH',
  //           2: 'BANK',
  //           3: 'MOBILE_BANKING',
  //           4: 'CHEQUE',
  //         };

  //         // Add the mapped payment type to the payload
  //         receiptPayload.receipt_payment_type =
  //           paymentTypeMapping[rec.receipt_payment_type];

  //         // receipt_to: itemData.receipt_payment_to, //overall
  //         // receipt_payment_type: itemData.receipt_payment_type, ///cash
  //         console.log('professional receipt', receiptPayload);

  //         const receipt_id = await invoiceModel.insertReceipt(receiptPayload);

  //         if (rec.receipt_to === 'OVERALL') {
  //           const total_due = await invoiceModel.getInvoiceWiseDue(
  //             client_id,
  //             combined_id
  //           );

  //           const { payment_total, inv_history } =
  //             getReceiptOverallPaymentInvoice(
  //               total_due,
  //               rec.receipt_total,
  //               receipt_id,
  //               1666,
  //               receipt_no
  //             );

  //           await invoiceModel.insertReceiptItems(payment_total);
  //           // await invConn.insertInvoiceHistory(inv_history);
  //         } else {
  //           const inv_history: any[] = [];

  //           const receiptItems: any[] = invoices?.map((item: any) => {
  //             const invHistory: any = {
  //               history_activity_type: 'INVOICE_PAYMENT_CREATED',
  //               history_created_by: 1666,
  //               history_invoice_id: item.invoice_id,
  //               history_invoice_payment_amount: item.total,
  //               invoicelog_content: `Specific receipt Amount:${item.amount}/-, Discount:${item.discount}/-, Total:${item.total}/- Voucher:${receipt_no}`,
  //             };
  //             inv_history.push(invHistory);

  //             return {
  //               ...item,
  //               receipt_id,
  //             };
  //           });

  //           await invoiceModel.insertReceiptItems(receiptItems);
  //           // await invConn.insertInvoiceHistory(inv_history);
  //         }

  //         await this.updateVoucher(req, 'MR');

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
  //           invoice: invoices, // or invoice.id if available
  //           error: error instanceof Error ? error.message : String(error),
  //           errorType: errorType,
  //         });
  //         console.error('Error processing refund:', invoices, error);
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

  public async receipt(req: Request) {
    const model = this.Model.receipt();
    const invoiceModel = this.Model.agentDashboardModel();

    try {
      console.log('🔄 Starting receipt processing...');
      const data = await model.singleEntryInvoicesReceipt();
      console.log(`📊 Found ${data.length} receipts to process`);

      const invoices: any = [];

      console.log();

      for (const itemData of data) {
        console.log(`🎫 Processing receipt ID: ${itemData.receipt_id}`);

        const ticketItems = await model.singleReceiptItems(itemData.receipt_id);
        console.log(
          `📋 Found ${ticketItems.length} ticket items for receipt ${itemData.receipt_id}`
        );

        const clientInfo = await invoiceModel.getSingleClientInfo(
          itemData.receipt_client_id
        );
        const masterReceipt = {
          receipt_account_id: itemData.receipt_account_id,
          receipt_discount: itemData.receipt_total_discount,
          receipt_org_agency: 154,

          account_name: await invoiceModel.getAccountInfo(
            itemData.receipt_account_id
          ),
          comb_client: clientInfo?.doubleClientId,
          client_name: await invoiceModel.getClientInfo(
            itemData.receipt_client_id
          ),

          receipt_total: itemData.receipt_total_amount,
          receipt_date: itemData.receipt_payment_date,
          receipt_to: itemData.receipt_payment_to,
          receipt_payment_type: itemData.receipt_payment_type,
          receipt_note: itemData.receipt_note,
          receipt_amount: itemData.receipt_total_amount,
          invoices: ticketItems.map((ticket) => ({
            invoice_id: ticket.invclientpayment_invoice_id,
            amount: ticket.invclientpayment_amount,
            discount: 0,
            total: ticket.invclientpayment_amount - 0,
          })),
        };

        invoices.push(masterReceipt);
      }

      console.log(`✅ All receipts prepared. Total: ${invoices.length}`);

      return await this.db.transaction(async (trx) => {
        console.log('💾 Starting database transaction...');

        const processingErrors: Array<{
          receiptIndex: number;
          receiptId?: any;
          clientName?: string;
          error: string;
          errorType: string;
          step: string;
          timestamp: Date;
        }> = [];

        let successCount = 0;
        let errorCount = 0;

        for (let index = 0; index < invoices.length; index++) {
          const rec = invoices[index];

          try {
            console.log(
              `\n🔄 Processing receipt ${index + 1}/${invoices.length}`
            );
            console.log(`👤 Client: ${rec.client_name}`);
            console.log(`💰 Amount: ${rec.receipt_total}`);
            console.log(`📅 Date: ${rec.receipt_date}`);
            console.log(`💳 Payment Type: ${rec.receipt_payment_type}`);

            // Step 1: Initialize client transaction
            console.log('📍 Step 1: Initializing client transaction...');
            let clTrans: {
              clComTransId: number | null;
              clTransId: number | null;
            } = {
              clComTransId: null,
              clTransId: null,
            };

            // Step 2: Separate client ID
            console.log('📍 Step 2: Separating client ID...');
            const { client_id, combined_id } = separateCombClientToId(
              'client-' + `${rec.comb_client}`
            );
            console.log(
              `🆔 Client ID: ${client_id}, Combined ID: ${combined_id}`
            );

            // Step 3: Generate voucher
            console.log('📍 Step 3: Generating voucher number...');
            // const receipt_no = await this.generateVoucher(req, 'MR');
            const receipt_no = await this.superVoucher(req, 'MR');
            console.log(`🧾 Generated voucher: ${receipt_no}`);

            let receipt_voucher1: number | null = null;
            let receipt_voucher2: number | null = null;
            let receipt_cheque_id: number | null = null;

            if (rec.receipt_payment_type !== 'CHEQUE') {
              console.log('📍 Step 4: Processing non-cheque payment...');

              // Step 4a: Get account head ID
              console.log('📍 Step 4a: Getting account head ID...');
              const accHeadId = await invoiceModel.getAccountName(
                rec.account_name
              );
              console.log(`🏦 Account Head ID: ${accHeadId}`);

              const voucherDescription = `Money receipt of ${rec.receipt_total}/- from ${rec.client_name} through ${rec.receipt_payment_type}.`;
              console.log(`📝 Voucher Description: ${voucherDescription}`);

              // Step 4b: Insert first voucher (DEBIT)
              console.log('📍 Step 4b: Inserting DEBIT voucher...');
              receipt_voucher1 = await invoiceModel.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: accHeadId,
                voucher_no: `${receipt_no}R`,
                amount: rec.receipt_amount,
                trans_type: 'DEBIT',
                description: voucherDescription,
                payment_type: 'RECEIPT',
              });
              console.log(`✅ DEBIT Voucher ID: ${receipt_voucher1}`);

              // Step 4c: Insert second voucher (CREDIT)
              console.log('📍 Step 4c: Inserting CREDIT voucher...');
              receipt_voucher2 = await invoiceModel.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Accounts Receivables'],
                voucher_no: `${receipt_no}R`,
                amount: rec.receipt_amount,
                trans_type: 'CREDIT',
                description: voucherDescription,
                payment_type: 'RECEIPT',
              });
              console.log(`✅ CREDIT Voucher ID: ${receipt_voucher2}`);

              // Step 4d: Insert client transaction
              console.log('📍 Step 4d: Inserting client transaction...');
              clTrans = await invoiceModel.insertClientTrans({
                ctrxn_voucher: receipt_no,
                client_id,
                combined_id,
                ctrxn_amount: rec.receipt_total,
                ctrxn_created_at: rec.receipt_date,
                ctrxn_note: rec.receipt_note,
                ctrxn_particular_id: 17,
                ctrxn_type: 'CREDIT',
                ctrxn_pay_type: rec.receipt_payment_type,
              });
              console.log(
                `✅ Client Transaction IDs: ${JSON.stringify(clTrans)}`
              );
            } else {
              console.log('📍 Step 4: Processing cheque payment...');
              receipt_cheque_id = await invoiceModel.insertCheque({
                cheque_org_agency: 154,
                cheque_voucher_no: receipt_no,
                cheque_number: rec.cheque_number,
                cheque_bank_name: rec.bank_name,
                cheque_withdraw_date: rec.cheque_date,
                cheque_note: rec.receipt_note,
                cheque_amount: rec.receipt_total,
                cheque_type: 'RECEIPT',
              });
              console.log(`✅ Cheque ID: ${receipt_cheque_id}`);
            }

            // Step 5: Get account ID
            console.log('📍 Step 5: Getting account ID...');
            const accountIDGet = await invoiceModel.getAccountID(
              rec.account_name
            );
            console.log(`🏦 Account ID: ${accountIDGet}`);

            // const userName = await invoiceModel.getUserInfoAndId(
            //   rec.receipt_created_by
            // );

            // const employeeInfo = await invoiceModel.getEmployeeInfoAndId(
            //   rec.received_by
            // );

            // Step 6: Prepare receipt payload
            console.log('📍 Step 6: Preparing receipt payload...');
            const receiptPayload: any = {
              comb_client: rec.comb_client,
              bank_name: rec.bank_name,
              cheque_date: rec.cheque_date,
              cheque_number: rec.cheque_number,
              receipt_voucher1: receipt_voucher1,
              receipt_voucher2: receipt_voucher2,
              receipt_account_id: accountIDGet,
              receipt_note: rec.receipt_note,
              receipt_amount: rec.receipt_amount,
              receipt_client_id: client_id,
              receipt_cl_trxn_id: clTrans?.clTransId,
              receipt_combined_id: combined_id,
              receipt_com_trxn_id: clTrans?.clComTransId,
              receipt_created_by: 1666,
              receipt_date: rec.receipt_date,
              receipt_discount: rec.receipt_discount,
              receipt_no: receipt_no,
              receipt_org_agency: 154,
              receipt_to: rec.receipt_to,
              receipt_payment_type: rec.receipt_payment_type,
              receipt_status:
                rec.receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS',
              receipt_total: rec.receipt_total,
              received_by: 2984,
              transaction_no: null,
              receipt_cheque_id: receipt_cheque_id,
              last_balance: 0,
            };

            // Payment type mapping
            const paymentTypeMapping: any = {
              1: 'CASH',
              2: 'BANK',
              3: 'MOBILE_BANKING',
              4: 'CHEQUE',
            };

            receiptPayload.receipt_payment_type =
              paymentTypeMapping[rec.receipt_payment_type];
            console.log(
              `💳 Mapped payment type: ${receiptPayload.receipt_payment_type}`
            );

            // Step 7: Insert receipt
            console.log('📍 Step 7: Inserting receipt...');
            console.log(
              'Receipt payload:',
              JSON.stringify(receiptPayload, null, 2)
            );

            const receipt_id = await invoiceModel.insertReceipt(receiptPayload);
            console.log(`✅ Receipt inserted with ID: ${receipt_id}`);

            // Step 8: Process receipt items
            if (rec.receipt_to === 'OVERALL') {
              console.log('📍 Step 8: Processing OVERALL receipt...');

              const total_due = await invoiceModel.getInvoiceWiseDue(
                client_id,
                combined_id
              );
              console.log(`💰 Total due amount: ${JSON.stringify(total_due)}`);

              const { payment_total, inv_history } =
                getReceiptOverallPaymentInvoice(
                  total_due,
                  rec.receipt_total,
                  receipt_id,
                  1666,
                  receipt_no
                );

              console.log(`📋 Payment total items: ${payment_total.length}`);
              await invoiceModel.insertReceiptItems(payment_total);
              console.log('✅ Receipt items inserted for OVERALL payment');
            } else {
              console.log('📍 Step 8: Processing SPECIFIC receipt...');

              const inv_history: any[] = [];
              const receiptItems: any[] = rec.invoices?.map((item: any) => {
                const invHistory: any = {
                  history_activity_type: 'INVOICE_PAYMENT_CREATED',
                  history_created_by: 1666,
                  history_invoice_id: item.invoice_id,
                  history_invoice_payment_amount: item.total,
                  invoicelog_content: `Specific receipt Amount:${item.amount}/-, Discount:${item.discount}/-, Total:${item.total}/- Voucher:${receipt_no}`,
                };
                inv_history.push(invHistory);

                return {
                  ...item,
                  receipt_id,
                };
              });

              console.log(`📋 Receipt items to insert: ${receiptItems.length}`);
              await invoiceModel.insertReceiptItems(receiptItems);
              console.log('✅ Receipt items inserted for SPECIFIC payment');
            }

            // Step 9: Update voucher
            console.log('📍 Step 9: Updating voucher...');
            await this.updateVoucher(req, 'MR');
            console.log('✅ Voucher updated');

            successCount++;
            console.log(`🎉 Receipt ${index + 1} processed successfully!`);
          } catch (error) {
            errorCount++;
            console.error(`\n❌ ERROR in receipt ${index + 1}:`);
            console.error(`👤 Client: ${rec.client_name || 'Unknown'}`);
            console.error(`🆔 Receipt ID: ${rec.receipt_id || 'Unknown'}`);
            console.error(`💰 Amount: ${rec.receipt_total || 'Unknown'}`);

            // Determine error type and step
            let errorType = 'Unknown Error';
            let step = 'Unknown Step';

            if (error instanceof Error) {
              console.error(`📄 Error Message: ${error.message}`);
              console.error(`📚 Error Stack: ${error.stack}`);

              // Identify error type based on message content
              if (error.message.includes('separateCombClientToId')) {
                errorType = 'Client ID Separation Error';
                step = 'Step 2: Separating client ID';
              } else if (error.message.includes('generateVoucher')) {
                errorType = 'Voucher Generation Error';
                step = 'Step 3: Generating voucher';
              } else if (error.message.includes('getAccountName')) {
                errorType = 'Account Name Retrieval Error';
                step = 'Step 4a: Getting account head ID';
              } else if (error.message.includes('insertAccVoucherDb')) {
                errorType = 'Account Voucher Insert Error';
                step = 'Step 4b/4c: Inserting vouchers';
              } else if (error.message.includes('insertClientTrans')) {
                errorType = 'Client Transaction Insert Error';
                step = 'Step 4d: Inserting client transaction';
              } else if (error.message.includes('insertCheque')) {
                errorType = 'Cheque Insert Error';
                step = 'Step 4: Processing cheque payment';
              } else if (error.message.includes('getAccountID')) {
                errorType = 'Account ID Retrieval Error';
                step = 'Step 5: Getting account ID';
              } else if (error.message.includes('insertReceipt')) {
                errorType = 'Receipt Insert Error';
                step = 'Step 7: Inserting receipt';
              } else if (error.message.includes('getInvoiceWiseDue')) {
                errorType = 'Invoice Due Retrieval Error';
                step = 'Step 8: Processing OVERALL receipt';
              } else if (error.message.includes('insertReceiptItems')) {
                errorType = 'Receipt Items Insert Error';
                step = 'Step 8: Processing receipt items';
              } else if (error.message.includes('updateVoucher')) {
                errorType = 'Voucher Update Error';
                step = 'Step 9: Updating voucher';
              } else if (error.message.includes('trabill_')) {
                errorType = 'Database Constraint Error';
                step = 'Database Operation';
              } else if (error.message.includes('validation')) {
                errorType = 'Data Validation Error';
                step = 'Data Validation';
              } else if (error.message.includes('timeout')) {
                errorType = 'Database Timeout Error';
                step = 'Database Connection';
              } else if (error.message.includes('duplicate')) {
                errorType = 'Duplicate Entry Error';
                step = 'Database Insert';
              }
            } else {
              console.error(`❓ Non-Error object thrown: ${String(error)}`);
            }

            const errorDetails = {
              receiptIndex: index + 1,
              receiptId: rec.receipt_id,
              clientName: rec.client_name,
              error: error instanceof Error ? error.message : String(error),
              errorType: errorType,
              step: step,
              timestamp: new Date(),
            };

            processingErrors.push(errorDetails);

            console.error(`🔍 Error Details:`);
            console.error(`   - Type: ${errorType}`);
            console.error(`   - Step: ${step}`);
            console.error(`   - Index: ${index + 1}/${invoices.length}`);
            console.error(`   - Time: ${errorDetails.timestamp.toISOString()}`);

            // Instead of continuing, throw the error to stop processing
            console.error(`\n🛑 STOPPING PROCESS DUE TO ERROR`);
            console.error(
              `📊 Progress: ${successCount} successful, ${errorCount} failed`
            );

            // Throw detailed error
            throw new Error(
              `Receipt processing failed at ${step}. Error: ${
                error instanceof Error ? error.message : String(error)
              }. Client: ${rec.client_name}. Receipt Index: ${index + 1}/${
                invoices.length
              }`
            );
          }
        }

        console.log(`\n🎊 All receipts processed successfully!`);
        console.log(
          `📊 Final Stats: ${successCount} successful, ${errorCount} failed`
        );

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
              acc[err.errorType] = (acc[err.errorType] || 0) + 1;
              return acc;
            }, {} as Record<string, number>),
          },
        };
      });
    } catch (error) {
      console.error(`\n💥 FATAL ERROR IN RECEIPT PROCESSING:`);
      console.error(
        `📄 Error Message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      console.error(
        `📚 Error Stack: ${
          error instanceof Error ? error.stack : 'No stack trace'
        }`
      );

      // Re-throw the error to ensure it stops execution
      throw error;
    }
  }

  // public async payment(req: Request) {
  //   const model = this.Model.receipt();
  //   const invoiceModel = this.Model.agentDashboardModel();

  //   try {
  //     console.log('🔄 Starting payment processing...');
  //     const data = await model.vendorPayment();
  //     console.log(`📊 Found ${data.length} payments to process`);

  //     // Create an array of promises
  //     console.log('📍 Step 1: Enhancing data with account names...');
  //     const enhancedDataPromises = data.map(async (item: any) => ({
  //       ...item,
  //       account_name: await invoiceModel.getAccountInfo(item.vpay_account_id),
  //     }));

  //     // Wait for all promises to resolve
  //     const enhancedData = await Promise.all(enhancedDataPromises);
  //     console.log(
  //       `✅ Data enhanced successfully. Total payments: ${enhancedData.length}`
  //     );

  //     return await this.db.transaction(async (trx) => {
  //       console.log('💾 Starting database transaction...');
  //       const superModel = this.Model.agentDashboardModel(trx);

  //       const processingErrors: Array<{
  //         paymentIndex: number;
  //         paymentId?: any;
  //         vendorName?: string;
  //         error: string;
  //         errorType: string;
  //         step: string;
  //         timestamp: Date;
  //       }> = [];

  //       let successCount = 0;
  //       let errorCount = 0;

  //       for (let index = 0; index < enhancedData.length; index++) {
  //         const rec = enhancedData[index];

  //         try {
  //           console.log(
  //             `\n🔄 Processing payment ${index + 1}/${enhancedData.length}`
  //           );
  //           console.log(`🏢 Vendor ID: ${rec.vpay_vendor_id}`);
  //           console.log(`💰 Amount: ${rec.payment_amount}`);
  //           console.log(`📅 Date: ${rec.payment_date}`);
  //           console.log(`💳 Payment Method: ${rec.payment_method_id}`);
  //           console.log(`🏦 Account: ${rec.account_name}`);

  //           // Step 1: Initialize vendor transaction
  //           console.log('📍 Step 1: Initializing vendor transaction...');
  //           let vTrxId: {
  //             vendorTransId: number | null;
  //             vendorComTransId: number | null;
  //           } = {
  //             vendorTransId: null,
  //             vendorComTransId: null,
  //           };

  //           // Step 2: Separate vendor ID
  //           console.log('📍 Step 2: Separating vendor ID...');
  //           const { vendor_id, combined_id } = separateCombClientToId(
  //             'vendor-' + `${rec.vpay_vendor_id}`
  //           );
  //           console.log(
  //             `🆔 Vendor ID: ${vendor_id}, Combined ID: ${combined_id}`
  //           );

  //           // Step 3: Get vendor name
  //           console.log('📍 Step 3: Getting vendor name...');
  //           const vendorNameGet = await superModel.getVendorName(
  //             rec.vpay_vendor_id
  //           );
  //           console.log(`🏢 Vendor Name: ${vendorNameGet.vendor_name}`);

  //           // Step 4: Generate voucher
  //           console.log('📍 Step 4: Generating voucher number...');
  //           const receipt_no = await this.generateVoucher(req, 'VPY');
  //           console.log(`🧾 Generated voucher: ${receipt_no}`);

  //           let account_vou1: number | null = null;
  //           let account_vou2: number | null = null;
  //           let receipt_cheque_id: number | null = null;

  //           if (rec.payment_method_id !== 4) {
  //             console.log('📍 Step 5: Processing non-cheque payment...');

  //             // Step 5a: Get account head ID
  //             console.log('📍 Step 5a: Getting account head ID...');
  //             const accHeadId = await superModel.getAccountName(
  //               rec.account_name
  //             );
  //             console.log(`🏦 Account Head ID: ${accHeadId}`);

  //             const voucherDescription = `Payment ${rec.payment_amount}/- To ${vendorNameGet.vendor_name} through ${rec.account_name}.`;
  //             console.log(`📝 Voucher Description: ${voucherDescription}`);

  //             // Step 5b: Insert first account voucher (DEBIT)
  //             console.log('📍 Step 5b: Inserting DEBIT account voucher...');
  //             account_vou1 = await superModel.insertAccVoucherDb({
  //               serial_no: 1,
  //               acc_head_id: accHeadId,
  //               voucher_no: `${receipt_no}R`,
  //               amount: rec.payment_amount,
  //               trans_type: 'DEBIT',
  //               description: voucherDescription,
  //               payment_type: 'PAYMENT',
  //             });
  //             console.log(`✅ DEBIT Account Voucher ID: ${account_vou1}`);

  //             // Step 5c: Insert second account voucher (CREDIT)
  //             console.log('📍 Step 5c: Inserting CREDIT account voucher...');
  //             account_vou2 = await superModel.insertAccVoucherDb({
  //               serial_no: 2,
  //               acc_head_id: this.accHead['Accounts Payable'],
  //               voucher_no: `${receipt_no}R`,
  //               amount: rec.payment_amount,
  //               trans_type: 'CREDIT',
  //               description: voucherDescription,
  //               payment_type: 'PAYMENT',
  //             });
  //             console.log(`✅ CREDIT Account Voucher ID: ${account_vou2}`);

  //             // Step 5d: Insert vendor transaction
  //             console.log('📍 Step 5d: Inserting vendor transaction...');
  //             vTrxId = await superModel.insertVendorTrans({
  //               com_vendor: `vendor-${rec.vpay_vendor_id}`,
  //               vtrxn_type: 'DEBIT',
  //               vtrxn_amount: rec.payment_amount,
  //               vtrxn_voucher: receipt_no,
  //               vtrxn_particular_id: this.trnType['VENDOR PAYMENT'],
  //               vtrxn_note: rec.note,
  //               vtrxn_created_at: rec.payment_date,
  //             });
  //             console.log(
  //               `✅ Vendor Transaction IDs: ${JSON.stringify(vTrxId)}`
  //             );
  //           } else {
  //             console.log('📍 Step 5: Processing cheque payment...');
  //             receipt_cheque_id = await invoiceModel.insertCheque({
  //               cheque_org_agency: 154,
  //               cheque_voucher_no: receipt_no,
  //               cheque_number: rec.cheque_number,
  //               cheque_bank_name: rec.bank_name,
  //               cheque_withdraw_date: rec.cheque_date,
  //               cheque_note: rec.receipt_note,
  //               cheque_amount: rec.receipt_total,
  //               cheque_type: 'RECEIPT',
  //             });
  //             console.log(`✅ Cheque ID: ${receipt_cheque_id}`);
  //           }

  //           // Step 6: Get account ID
  //           console.log('📍 Step 6: Getting account ID...');
  //           const accountIDGet = await superModel.getAccountID(
  //             rec.account_name
  //           );
  //           console.log(`🏦 Account ID: ${accountIDGet}`);

  //           // Step 7: Prepare payment payload
  //           console.log('📍 Step 7: Preparing payment payload...');
  //           const paymentPayload: any = {
  //             comb_vendor: `vendor-${rec.vpay_vendor_id}`,
  //             agency_id: 154,
  //             bsp_period: rec.vpay_bsp_period,
  //             payment_date: rec.payment_date,
  //             voucher_no: receipt_no,
  //             vendor_id: rec.vpay_vendor_id,
  //             combined_id: rec.vpay_combined_id,
  //             combined_trxn_id: vTrxId?.vendorComTransId,
  //             vendor_trxn_id: vTrxId?.vendorTransId,
  //             payment_to: 'OVERALL',
  //             payment_type: rec.payment_method_id,
  //             account_id: accountIDGet,
  //             payment_by: rec.vpay_payment_by,
  //             payment_note: rec.note,
  //             account_vou1: account_vou1,
  //             account_vou2: account_vou2,
  //             bank_name: null,
  //             cheque_date: null,
  //             cheque_number: null,
  //             payment_total: rec.payment_amount,
  //             created_by: 1666,
  //             payment_cheque_id: null,
  //             withdraw_date: null,
  //           };

  //           // Payment type mapping
  //           const paymentTypeMapping: any = {
  //             1: 'CASH',
  //             2: 'BANK',
  //             3: 'MOBILE_BANKING',
  //             4: 'CHEQUE',
  //           };

  //           paymentPayload.payment_type =
  //             paymentTypeMapping[rec.payment_method_id];
  //           console.log(
  //             `💳 Mapped payment type: ${paymentPayload.payment_type}`
  //           );

  //           // Step 8: Insert payment
  //           console.log('📍 Step 8: Inserting payment...');
  //           console.log(
  //             'Payment payload:',
  //             JSON.stringify(paymentPayload, null, 2)
  //           );

  //           const receipt_id = await superModel.insertPayment(paymentPayload);
  //           console.log(`✅ Payment inserted with ID: ${receipt_id}`);

  //           // Step 9: Process payment items for OVERALL payments
  //           if (rec.vpay_payment_to === 'OVERALL') {
  //             console.log('📍 Step 9: Processing OVERALL payment...');

  //             console.log('📍 Step 9a: Getting ticket-wise due amounts...');
  //             const total_due = (await superModel.getTicketWiseDue(
  //               vendor_id,
  //               combined_id
  //             )) as {
  //               airticket_invoice_id: number;
  //               airticket_id: number;
  //               due_amount: string;
  //             }[];
  //             console.log(`💰 Total due tickets: ${total_due.length}`);
  //             console.log(`💰 Due details: ${JSON.stringify(total_due)}`);

  //             console.log('📍 Step 9b: Calculating payment distribution...');
  //             const payment_total_found =
  //               getPAymentReceiptOverallPaymentInvoice(
  //                 total_due,
  //                 paymentPayload.payment_total,
  //                 receipt_id
  //               );
  //             console.log(
  //               `📋 Payment items calculated: ${payment_total_found.length}`
  //             );

  //             if (payment_total_found.length) {
  //               console.log('📍 Step 9c: Inserting payment items...');
  //               await superModel.insertPayment(payment_total_found);
  //               console.log('✅ Payment items inserted successfully');
  //             } else {
  //               console.log('⚠️ No payment items to insert');
  //             }
  //           } else {
  //             console.log(
  //               '📍 Step 9: Skipping payment items (not OVERALL payment)'
  //             );
  //           }

  //           // Step 10: Update voucher
  //           console.log('📍 Step 10: Updating voucher...');
  //           await this.updateVoucher(req, 'VPY');
  //           console.log('✅ Voucher updated');

  //           successCount++;
  //           console.log(`🎉 Payment ${index + 1} processed successfully!`);
  //         } catch (error) {
  //           errorCount++;
  //           console.error(`\n❌ ERROR in payment ${index + 1}:`);
  //           console.error(`🏢 Vendor ID: ${rec.vpay_vendor_id || 'Unknown'}`);
  //           console.error(`💰 Amount: ${rec.payment_amount || 'Unknown'}`);
  //           console.error(`🏦 Account: ${rec.account_name || 'Unknown'}`);

  //           // Determine error type and step
  //           let errorType = 'Unknown Error';
  //           let step = 'Unknown Step';

  //           if (error instanceof Error) {
  //             console.error(`📄 Error Message: ${error.message}`);
  //             console.error(`📚 Error Stack: ${error.stack}`);

  //             // Identify error type based on message content
  //             if (error.message.includes('separateCombClientToId')) {
  //               errorType = 'Vendor ID Separation Error';
  //               step = 'Step 2: Separating vendor ID';
  //             } else if (error.message.includes('getVendorName')) {
  //               errorType = 'Vendor Name Retrieval Error';
  //               step = 'Step 3: Getting vendor name';
  //             } else if (error.message.includes('generateVoucher')) {
  //               errorType = 'Voucher Generation Error';
  //               step = 'Step 4: Generating voucher';
  //             } else if (error.message.includes('getAccountName')) {
  //               errorType = 'Account Name Retrieval Error';
  //               step = 'Step 5a: Getting account head ID';
  //             } else if (error.message.includes('insertAccVoucherDb')) {
  //               errorType = 'Account Voucher Insert Error';
  //               step = 'Step 5b/5c: Inserting account vouchers';
  //             } else if (error.message.includes('insertVendorTrans')) {
  //               errorType = 'Vendor Transaction Insert Error';
  //               step = 'Step 5d: Inserting vendor transaction';
  //             } else if (error.message.includes('insertCheque')) {
  //               errorType = 'Cheque Insert Error';
  //               step = 'Step 5: Processing cheque payment';
  //             } else if (error.message.includes('getAccountID')) {
  //               errorType = 'Account ID Retrieval Error';
  //               step = 'Step 6: Getting account ID';
  //             } else if (error.message.includes('insertPayment')) {
  //               errorType = 'Payment Insert Error';
  //               step = 'Step 8: Inserting payment';
  //             } else if (error.message.includes('getTicketWiseDue')) {
  //               errorType = 'Ticket Due Retrieval Error';
  //               step = 'Step 9a: Getting ticket-wise due amounts';
  //             } else if (
  //               error.message.includes('getPAymentReceiptOverallPaymentInvoice')
  //             ) {
  //               errorType = 'Payment Distribution Calculation Error';
  //               step = 'Step 9b: Calculating payment distribution';
  //             } else if (error.message.includes('updateVoucher')) {
  //               errorType = 'Voucher Update Error';
  //               step = 'Step 10: Updating voucher';
  //             } else if (error.message.includes('trabill_')) {
  //               errorType = 'Database Constraint Error';
  //               step = 'Database Operation';
  //             } else if (error.message.includes('validation')) {
  //               errorType = 'Data Validation Error';
  //               step = 'Data Validation';
  //             } else if (error.message.includes('timeout')) {
  //               errorType = 'Database Timeout Error';
  //               step = 'Database Connection';
  //             } else if (error.message.includes('duplicate')) {
  //               errorType = 'Duplicate Entry Error';
  //               step = 'Database Insert';
  //             } else if (error.message.includes('trnType')) {
  //               errorType = 'Transaction Type Error';
  //               step = 'Step 5d: Inserting vendor transaction';
  //             } else if (error.message.includes('accHead')) {
  //               errorType = 'Account Head Error';
  //               step = 'Step 5c: Inserting CREDIT account voucher';
  //             }
  //           } else {
  //             console.error(`❓ Non-Error object thrown: ${String(error)}`);
  //           }

  //           const errorDetails = {
  //             paymentIndex: index + 1,
  //             paymentId: rec.vpay_vendor_id,
  //             vendorName: rec.vpay_vendor_id,
  //             error: error instanceof Error ? error.message : String(error),
  //             errorType: errorType,
  //             step: step,
  //             timestamp: new Date(),
  //           };

  //           processingErrors.push(errorDetails);

  //           console.error(`🔍 Error Details:`);
  //           console.error(`   - Type: ${errorType}`);
  //           console.error(`   - Step: ${step}`);
  //           console.error(`   - Index: ${index + 1}/${enhancedData.length}`);
  //           console.error(`   - Time: ${errorDetails.timestamp.toISOString()}`);

  //           // Instead of continuing, throw the error to stop processing
  //           console.error(`\n🛑 STOPPING PROCESS DUE TO ERROR`);
  //           console.error(
  //             `📊 Progress: ${successCount} successful, ${errorCount} failed`
  //           );

  //           // Throw detailed error
  //           throw new Error(
  //             `Payment processing failed at ${step}. Error: ${
  //               error instanceof Error ? error.message : String(error)
  //             }. Vendor ID: ${rec.vpay_vendor_id}. Payment Index: ${
  //               index + 1
  //             }/${enhancedData.length}`
  //           );
  //         }
  //       }

  //       console.log(`\n🎊 All payments processed successfully!`);
  //       console.log(
  //         `📊 Final Stats: ${successCount} successful, ${errorCount} failed`
  //       );

  //       return {
  //         success: errorCount === 0,
  //         code:
  //           errorCount === 0
  //             ? this.StatusCode.HTTP_OK
  //             : this.StatusCode.HTTP_PARTIAL_CONTENT,
  //         data: {
  //           totalInvoices: enhancedData.length,
  //           processedSuccessfully: successCount,
  //           failedToProcess: errorCount,
  //           invoices: enhancedData,
  //         },
  //         errors: processingErrors,
  //         errorSummary: {
  //           totalErrors: errorCount,
  //           errorTypes: processingErrors.reduce((acc, err) => {
  //             acc[err.errorType] = (acc[err.errorType] || 0) + 1;
  //             return acc;
  //           }, {} as Record<string, number>),
  //         },
  //       };
  //     });
  //   } catch (error) {
  //     console.error(`\n💥 FATAL ERROR IN PAYMENT PROCESSING:`);
  //     console.error(
  //       `📄 Error Message: ${
  //         error instanceof Error ? error.message : String(error)
  //       }`
  //     );
  //     console.error(
  //       `📚 Error Stack: ${
  //         error instanceof Error ? error.stack : 'No stack trace'
  //       }`
  //     );

  //     // Re-throw the error to ensure it stops execution
  //     throw error;
  //   }
  // }
  public async payment(req: Request) {
    const model = this.Model.receipt();
    const invoiceModel = this.Model.agentDashboardModel();

    try {
      const data = await model.vendorPayment();

      // Enhance data with account names
      const enhancedData = await Promise.all(
        data.map(async (item: any) => ({
          ...item,
          account_name: await invoiceModel.getAccountInfo(item.vpay_account_id),
        }))
      );

      return await this.db.transaction(async (trx) => {
        const superModel = this.Model.agentDashboardModel(trx);
        const processingErrors: any[] = [];
        let successCount = 0;

        for (const [index, rec] of enhancedData.entries()) {
          try {
            // Process each payment step
            const { vendor_id, combined_id } = separateCombClientToId(
              'vendor-' + `${rec.vpay_vendor_id}`
            );

            const vendorNameGet = await superModel.getVendorName(
              rec.vpay_vendor_id
            );
            const receipt_no = await this.superVoucher(req, 'VPY');

            let vTrxId: any = { vendorTransId: null, vendorComTransId: null };
            let account_vou1: number | null = null;
            let account_vou2: number | null = null;
            let receipt_cheque_id: number | null = null;

            if (rec.payment_method_id !== 4) {
              const accHeadId = await superModel.getAccountName(
                rec.account_name
              );
              const voucherDescription = `Payment ${rec.payment_amount}/- To ${vendorNameGet.vendor_name} through ${rec.account_name}.`;

              account_vou1 = await superModel.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: accHeadId,
                voucher_no: `${receipt_no}R`,
                amount: rec.payment_amount,
                trans_type: 'DEBIT',
                description: voucherDescription,
                payment_type: 'PAYMENT',
              });

              account_vou2 = await superModel.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Accounts Payable'],
                voucher_no: `${receipt_no}R`,
                amount: rec.payment_amount,
                trans_type: 'CREDIT',
                description: voucherDescription,
                payment_type: 'PAYMENT',
              });

              vTrxId = await superModel.insertVendorTrans({
                com_vendor: `vendor-${rec.vpay_vendor_id}`,
                vtrxn_type: 'CREDIT',
                vtrxn_amount: rec.payment_amount,
                vtrxn_voucher: receipt_no,
                vtrxn_particular_id: this.trnType['VENDOR PAYMENT'],
                vtrxn_note: rec.note,
                vtrxn_created_at: rec.payment_date,
              });
            } else {
              receipt_cheque_id = await invoiceModel.insertCheque({
                cheque_org_agency: 154,
                cheque_voucher_no: receipt_no,
                cheque_number: rec.cheque_number,
                cheque_bank_name: rec.bank_name,
                cheque_withdraw_date: rec.cheque_date,
                cheque_note: rec.receipt_note,
                cheque_amount: rec.receipt_total,
                cheque_type: 'RECEIPT',
              });
            }

            const accountIDGet = await superModel.getAccountID(
              rec.account_name
            );

            const paymentPayload: any = {
              comb_vendor: `vendor-${rec.vpay_vendor_id}`,
              agency_id: 154,
              bsp_period: rec.vpay_bsp_period,
              payment_date: rec.payment_date,
              voucher_no: receipt_no,
              vendor_id: rec.vpay_vendor_id,
              combined_id: rec.vpay_combined_id,
              combined_trxn_id: vTrxId?.vendorComTransId,
              vendor_trxn_id: vTrxId?.vendorTransId,
              payment_to: 'OVERALL',
              payment_type: ['CASH', 'BANK', 'MOBILE_BANKING', 'CHEQUE'][
                rec.payment_method_id - 1
              ],
              account_id: accountIDGet,
              payment_by: rec.vpay_payment_by,
              payment_note: rec.note,
              account_vou1,
              account_vou2,
              bank_name: null,
              cheque_date: null,
              cheque_number: null,
              payment_total: rec.payment_amount,
              created_by: 1666,
              payment_cheque_id: null,
              withdraw_date: null,
            };

            const receipt_id = await superModel.insertPayment(paymentPayload);

            if (rec.vpay_payment_to === 'OVERALL') {
              const total_due = await superModel.getTicketWiseDue(
                vendor_id,
                combined_id
              );
              const payment_total_found =
                getPAymentReceiptOverallPaymentInvoice(
                  total_due,
                  paymentPayload.payment_total,
                  receipt_id
                );

              if (payment_total_found.length) {
                await superModel.insertPayment(payment_total_found);
              }
            }

            await this.updateVoucher(req, 'VPY');
            successCount++;
          } catch (error) {
            processingErrors.push({
              paymentIndex: index + 1,
              paymentId: rec.vpay_vendor_id,
              vendorName: rec.vpay_vendor_id,
              error: error instanceof Error ? error.message : String(error),
              timestamp: new Date(),
            });

            // Continue processing next payments even if one fails
            continue;
          }
        }

        return {
          success: processingErrors.length === 0,
          code:
            processingErrors.length === 0
              ? this.StatusCode.HTTP_OK
              : this.StatusCode.HTTP_PARTIAL_CONTENT,
          data: {
            totalInvoices: enhancedData.length,
            processedSuccessfully: successCount,
            failedToProcess: processingErrors.length,
          },
          errors: processingErrors,
        };
      });
    } catch (error) {
      return {
        success: false,
        code: this.StatusCode.HTTP_INTERNAL_SERVER_ERROR,
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // public async mistralNew(req: Request) {
  //   const mistral = new Mistral({
  //     apiKey: process.env.MISTRAL_API_KEY ?? '',
  //   });
  //   const result = await mistral.chat.complete({
  //     model: 'mistral-small-latest',
  //     stream: false,
  //     messages: [
  //       {
  //         content: 'Best Player Ever In Cricket',
  //         role: 'user',
  //       },
  //     ],
  //   });

  //   return {
  //     success: true,
  //     code: this.StatusCode.HTTP_OK,
  //     data: result,
  //   };
  // }
  // public async mistralNewGem(req: Request) {
  //   const ai = new GoogleGenAI({
  //     apiKey: 'AIzaSyBINQQf5kJo2Rt60_vFESbldqWFcoVmhIg',
  //   });

  //   const response = await ai.models.generateContent({
  //     model: 'gemini-2.0-flash',
  //     contents: 'Explain how AI works in a few words',
  //   });

  //   return {
  //     success: true,
  //     code: this.StatusCode.HTTP_OK,
  //     data: response.candidates,
  //   };
  // }
  // // INxlxf2nTCokzhuubmHREbS2OiA3LgZp;

  // // ... inside your service class

  // public async mistralNewTukho(req: Request) {}
}
export default nonComService;
