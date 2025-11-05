"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const airticketutils_1 = require("../types/airticketutils");
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';
class reissueService extends abstract_service_1.default {
    constructor() {
        super();
    }
    reissueTransfer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.ReissueModel();
            const commonModel = this.Model.agentDashboardModel();
            // const { data } = await model.singleEntryInvoicesReissue();
            const { data } = yield model.singleEntryInvoicesReissue();
            const invoices = [];
            for (const itemData of data) {
                const ticketItems = yield model.getReissueItems(itemData.invoice_id);
                const clientInfo = yield commonModel.getSingleClientInfo(itemData.invoice_client_id);
                const tickets = yield Promise.all(ticketItems.map((ticket) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const ticketInfo = yield commonModel.getReissuedInvoice(ticket.airticket_reissue_ticket_no);
                    const singleVendor = yield commonModel.getSingleEntryVendorInfo(ticket.airticket_vendor_id);
                    const getAirlineId = yield commonModel.getAirlineInfoAndId(ticket.airticket_airline_id);
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
                        double_entry_prev_airticket_id: (_a = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.airticket_id) !== null && _a !== void 0 ? _a : null,
                        double_entry_prev_invoice_id: (_b = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.airticket_invoice_id) !== null && _b !== void 0 ? _b : null,
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
                })));
                const employeeInfo = yield commonModel.getEmployeeInfoAndId(itemData.invoice_sales_man_id);
                const userName = yield commonModel.getUserInfoAndId(itemData.invoice_created_by);
                const invoice_part = {
                    invoice_id: itemData.invoice_id,
                    invoice_combclient_id: `client-${clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.doubleClientId}`,
                    clientId: clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.doubleClientId,
                    invoice_org_agency: 154,
                    invoice_created_by: userName.doubleUserId,
                    invoice_sales_man_id: employeeInfo.doubleEmployeeId,
                    invoice_sales_date: itemData.invoice_date,
                    invoice_sub_total: itemData.net_total,
                    tickets,
                };
                invoices.push(invoice_part);
            }
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const processingErrors = [];
                let successCount = 0;
                let errorCount = 0;
                const commonModel = this.Model.agentDashboardModel();
                for (const invoice of invoices) {
                    try {
                        const { invoicePayload, ticketsFormat, client_name } = yield (0, airticketutils_1.invoiceReissueFormatter)(invoice);
                        // const invoice_no = await this.generateVoucher(req, 'ARI');
                        const invoice_no = yield this.superVoucher(req, 'ARI');
                        const invoiceModel = this.Model.agentDashboardModel(trx);
                        const invoiceId = yield invoiceModel.insertInvoicesInfo(Object.assign(Object.assign({}, invoicePayload), { invoice_org_agency: 154, invoice_created_by: invoice.invoice_created_by, invoice_no: invoice_no }));
                        const clientNameGet = yield invoiceModel.getClientName(Number(invoice.clientId));
                        // const clientInfo = await commonModel.getSingleClientInfo(
                        //   invoice.invoice_client_id
                        // );
                        // console.log('clientNameGet', clientNameGet);
                        for (const ticket of ticketsFormat) {
                            const { airTicketDetails, clTransPayload, VTransPayload } = ticket;
                            const { airticket_id, airticket_is_deleted, airticket_existing_airticket_id, airticket_existing_invoice, previous_ticket_no } = airTicketDetails, restAirTicket = __rest(airTicketDetails, ["airticket_id", "airticket_is_deleted", "airticket_existing_airticket_id", "airticket_existing_invoice", "previous_ticket_no"]);
                            const vendorNameGet = yield invoiceModel.getVendorName(Number(ticket.airTicketDetails.airticket_vendor_id));
                            const constNameVendorIdGet = yield invoiceModel.getVendorInfoByNo(airTicketDetails.airticket_ticket_no);
                            // --------- SALES
                            const ac_sale_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'DEBIT',
                                description: `Ticket sale to ${clientNameGet.client_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_sale_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Sales)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'CREDIT',
                                description: `Ticket sale to ${clientNameGet.client_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou1 = yield invoiceModel.insertAccVoucherDb({
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
                                description: `Purchase ticket from ${ticket === null || ticket === void 0 ? void 0 : ticket.vendor_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'CREDIT',
                                description: `Purchase ticket from ${ticket === null || ticket === void 0 ? void 0 : ticket.vendor_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const clTrans = yield invoiceModel.insertClientTrans(Object.assign(Object.assign({}, clTransPayload), { ctrxn_voucher: invoice_no, 
                                // ctrxn_voucher: `ClientTrans-${invoiceId}`,
                                ctrxn_created_at: invoicePayload.invoice_sales_date, ctrxn_ref_id: invoiceId }));
                            const vTrans = yield invoiceModel.insertVendorTrans(Object.assign(Object.assign({}, VTransPayload), { vtrxn_voucher: invoice_no, vtrxn_created_date: invoicePayload.invoice_sales_date, 
                                // vtrxn_voucher: `VendorTrans-${invoiceId}`,
                                vtrxn_ref_id: invoiceId }));
                            const airTicketItemPayload = {
                                airticket_is_deleted: 0,
                                airticket_client_id: invoice.clientId,
                                // airticket_combined_id: null,
                                airticket_ticket_no: airTicketDetails.previous_ticket_no,
                                airticket_penalties: airTicketDetails.airticket_penalties,
                                airticket_classes: airTicketDetails.airticket_classes,
                                airticket_vendor_id: airTicketDetails.airticket_vendor_id,
                                airticket_fare_difference: airTicketDetails.airticket_fare_difference,
                                airticket_commission_percent: airTicketDetails.airticket_commission_percent,
                                airticket_route_or_sector: airTicketDetails.airticket_route_or_sector,
                                airticket_ait: airTicketDetails.airticket_ait,
                                airticket_tax_difference: 0,
                                airticket_pnr: airTicketDetails.airticket_pnr,
                                airticket_airline_id: airTicketDetails.airticket_airline_id,
                                airticket_client_price: airTicketDetails.airticket_client_price,
                                airticket_purchase_price: airTicketDetails.airticket_purchase_price,
                                airticket_profit: airTicketDetails.airticket_profit,
                                airticket_cl_com_trans_id: clTrans.clComTransId,
                                airticket_cl_trans_id: clTrans.clTransId,
                                airticket_invoice_id: invoiceId,
                                airticket_existing_invoice: airTicketDetails.airticket_existing_invoice,
                                airticket_existing_airticket_id: airTicketDetails.airticket_existing_airticket_id,
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
                            yield invoiceModel.insertAirTicketReissueItem(airTicketItemPayload);
                            // await model.updateIsReissued(
                            //   checkInvoiceNoWiseInfo.airticket_invoice_id,
                            //   checkInvoiceNoWiseInfo.airticket_id
                            // );
                        }
                        yield this.updateVoucher(req, 'ARI');
                        //content and history data must be added there
                    }
                    catch (error) {
                        errorCount++;
                        console.error('Error processing invoice:', error);
                        // Extract error type from the error message or object
                        let errorType = 'Unknown';
                        if (error instanceof Error) {
                            if (error.message.includes('trabill_invoices')) {
                                errorType = 'Database Insert Error';
                            }
                            else if (error.message.includes('validation')) {
                                errorType = 'Validation Error';
                            }
                            // Add more error type checks as needed
                        }
                        processingErrors.push({
                            invoice: invoice,
                            error: error instanceof Error ? error.message : String(error),
                            errorType: errorType,
                        });
                    }
                }
                return {
                    success: errorCount === 0,
                    code: errorCount === 0
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
                        }, {}),
                    },
                };
            }));
        });
    }
}
exports.default = reissueService;
