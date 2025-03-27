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
const airticketutils_1 = require("../types/airticketutils");
const common_helper_1 = require("../helpers/common.helper");
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';
class nonComService extends abstract_service_1.default {
    constructor() {
        super();
    }
    testInvoicesNon(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.NonComModel();
            const data = yield model.singleEntryInvoices();
            const invoices = [];
            for (const itemData of data) {
                const ticketItems = yield model.singleEntryInvoicesAirTicketItems(itemData.invoice_id);
                const invoice_part = {
                    invoice_combclient_id: `client-${itemData.invoice_client_id}`,
                    invoice_org_agency: 154,
                    invoice_no: 'HelloWorld12354',
                    invoice_sales_man_id: itemData.invoice_sales_man_id,
                    invoice_sales_date: (0, common_helper_1.formatDate)(itemData.invoice_sales_date),
                    invoice_sub_total: itemData.invoice_sub_total,
                    invoice_agent_id: null,
                    invoice_agent_commission: 0,
                    invoice_show_passport_details: 0,
                    invoice_show_prev_due: itemData.invoice_client_previous_due,
                    invoice_show_unit: 1,
                    invoice_show_discount: 1,
                    invoice_note: itemData.invoice_note,
                    tickets: ticketItems.map((ticket) => ({
                        airticket_org_agency: 154,
                        airticket_ticket_type: ticket.airticket_ticket_type,
                        airticket_classes: ticket.airticket_classes,
                        airticket_ticket_no: ticket.airticket_ticket_no,
                        airticket_comvendor: (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_id)
                            ? `vendor-${ticket.airticket_vendor_id}`
                            : (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_combine_id)
                                ? `combine-${ticket.airticket_vendor_combine_id}`
                                : ticket === null || ticket === void 0 ? void 0 : ticket.airticket_comvendor,
                        vendor_name: 'Shamim Al Mamon',
                        airticket_airline_id: ticket.airticket_airline_id,
                        airticket_extra_fee: ticket.airticket_extra_fee,
                        airticket_issue_date: ticket.airticket_issue_date,
                        airticket_profit: ticket.airticket_profit,
                        airticket_client_price: ticket.airticket_client_price,
                        airticket_purchase_price: ticket.airticket_purchase_price,
                        airticket_pnr: ticket.airticket_pnr,
                        airticket_journey_date: ticket.airticket_journey_date,
                        airticket_return_date: ticket.airticket_return_date,
                        passport_id: ticket.airticket_passport_id,
                        passport_no: 'P0292292922',
                        passport_name: 'MOHAMMAD SHAMIM AL MAMON',
                        passport_person_type: 'Adult',
                        passport_email: 'nazmul.m360ict@gmail.com',
                        passport_mobile_no: '01888798798',
                        passport_date_of_birth: '1975-07-03T18:00:00.000Z',
                        passport_date_of_expire: '2031-11-01T00:00:00.000Z',
                        // airticket_route_or_sector: ['DAC', 'CXB', 'DAC'],
                        // taxes_commission: [
                        //   {
                        //     airline_commission: 18,
                        //     airline_taxes: 250,
                        //     airline_tax_type: 'YQ',
                        //   },
                        //   {
                        //     airline_commission: 4,
                        //     airline_tax_type: 'YR',
                        //     airline_taxes: 50,
                        //   },
                        // ],
                        // flight_details: [
                        //   {
                        //     fltdetails_from_airport_id: 358,
                        //     fltdetails_to_airport_id: 394,
                        //     fltdetails_airline_id: 109,
                        //     fltdetails_flight_no: 713,
                        //     fltdetails_fly_date: '2024-10-23',
                        //     fltdetails_departure_time: '14:38:41',
                        //     fltdetails_arrival_time: '14:38:43',
                        //   },
                        // ],
                    })),
                };
                invoices.push(invoice_part);
            }
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                for (const invoice of invoices) {
                    try {
                        const { invoicePayload, ticketsFormat, client_name } = yield (0, airticketutils_1.airTicketNonCommissionPayloadFormatter)(invoice);
                        const invoice_no = yield this.generateVoucher(req, 'ANC');
                        const invoiceModel = this.Model.agentDashboardModel(trx);
                        const invoiceId = yield invoiceModel.insertInvoicesInfo(Object.assign(Object.assign({}, invoicePayload), { invoice_org_agency: 154, invoice_created_by: 1666, invoice_no: invoice_no }));
                        const clientNameGet = yield invoiceModel.getClientName(Number(invoicePayload.invoice_client_id));
                        for (const ticket of ticketsFormat) {
                            const { airTicketDetails, flightDetails, passportDetails, clTransPayload, VTransPayload, taxes_commission, vendor_name, } = ticket;
                            const { airticket_id, airticket_is_deleted } = airTicketDetails, restAirTicket = __rest(airTicketDetails, ["airticket_id", "airticket_is_deleted"]);
                            const vendorNameGet = yield invoiceModel.getVendorName(Number(ticket.airTicketDetails.airticket_vendor_id));
                            const ac_sale_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket-Non Commission(Accounts Receivables)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'DEBIT',
                                description: `Ticket sale to ${clientNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_sale_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket-Non Commission(Sales)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'CREDIT',
                                description: `Ticket sale to ${clientNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Purchase)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'DEBIT',
                                description: `Purchase ticket from ${vendorNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket-Non Commission(Purchase)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'CREDIT',
                                description: `Purchase ticket from ${vendorNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const clTrans = yield invoiceModel.insertClientTrans(Object.assign(Object.assign({}, clTransPayload), { ctrxn_voucher: invoice_no, 
                                // ctrxn_voucher: `ClientTrans-${invoiceId}`,
                                ctrxn_created_date: invoicePayload.invoice_sales_date, ctrxn_ref_id: invoiceId }));
                            const vTrans = yield invoiceModel.insertVendorTrans(Object.assign(Object.assign({}, VTransPayload), { vtrxn_voucher: invoice_no, vtrxn_created_date: invoicePayload.invoice_sales_date, 
                                // vtrxn_voucher: `VendorTrans-${invoiceId}`,
                                vtrxn_ref_id: invoiceId }));
                            const airTicketItemPayload = Object.assign(Object.assign({}, restAirTicket), { airticket_cl_com_trans_id: clTrans.clComTransId, airticket_cl_trans_id: clTrans.clTransId, airticket_invoice_id: invoiceId, airticket_org_agency: 154, airticket_v_com_trans_id: vTrans.vendorComTransId, airticket_v_trans_id: vTrans.vendorTransId, airticket_ac_sale_vou1: ac_sale_vou1, airticket_ac_sale_vou2: ac_sale_vou2, airticket_ac_pur_vou1: ac_pur_vou1, airticket_ac_pur_vou2: ac_pur_vou2 });
                            yield model.insertAirTicketItem(airTicketItemPayload);
                        }
                        yield this.updateVoucher(req, 'ANC');
                        //content and history data must be added there
                    }
                    catch (error) {
                        console.error('Error processing invoice:', error);
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: invoices,
                };
            }));
        });
    }
    reissueTransfer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.ReissueModel();
            const { data } = yield model.singleEntryInvoicesReissue();
            const invoices = [];
            for (const itemData of data) {
                const ticketItems = yield model.singleEntryInvoicesAirTicketItemsReissue(itemData.invoice_id);
                const invoice_part = {
                    invoice_combclient_id: `client-${itemData.invoice_client_id}`,
                    invoice_org_agency: 154,
                    invoice_no: 'HelloWorld12354',
                    invoice_sales_man_id: itemData.invoice_sales_man_id,
                    invoice_sales_date: (0, common_helper_1.formatDate)(itemData.invoice_sales_date),
                    // invoice_due_date: formatDate(itemData.invoice_due_date),
                    invoice_note: itemData.invoice_note,
                    tickets: ticketItems.map((ticket) => ({
                        airticket_airline_id: ticket.airticket_airline_id,
                        previous_ticket_no: ticket.previous_ticket_no,
                        existing_airticket_id: ticket.existing_airticket_id,
                        existing_invoiceid: ticket.existing_invoiceid,
                        airticket_ticket_no: ticket.airticket_ticket_no,
                        airticket_penalties: ticket.airticket_penalties,
                        airticket_fare_difference: ticket.airticket_fare_difference,
                        airticket_tax_difference: ticket.airticket_tax_difference,
                        airticket_classes: ticket.airticket_classes,
                        airticket_pnr: ticket.airticket_pnr,
                        airticket_commission_percent: ticket.airticket_commission_percent,
                        airticket_route_or_sector: ticket.airticket_route_or_sector,
                        airticket_ait: ticket.airticket_ait,
                        airticket_journey_date: ticket.airticket_journey_date,
                        airticket_return_date: ticket.airticket_return_date,
                        airticket_extra_fee: ticket.airticket_extra_fee,
                        airticket_comvendor: ticket.airticket_comvendor,
                        vendor_name: ticket.vendor_name,
                        airticket_client_price: ticket.airticket_client_price,
                        airticket_purchase_price: ticket.airticket_purchase_price,
                        airticket_profit: ticket.airticket_profit,
                    })),
                };
                invoices.push(invoice_part);
            }
            // return {
            //   data: invoices,
            //   code: this.StatusCode.HTTP_OK,
            // };
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                for (const invoice of invoices) {
                    try {
                        const { invoicePayload, ticketsFormat, client_name } = yield (0, airticketutils_1.invoiceReissueFormatter)(invoice);
                        console.log(ticketsFormat);
                        const invoice_no = yield this.generateVoucher(req, 'ARI');
                        const invoiceModel = this.Model.agentDashboardModel(trx);
                        const invoiceId = yield invoiceModel.insertInvoicesInfo(Object.assign(Object.assign({}, invoicePayload), { invoice_org_agency: 154, invoice_created_by: 1666, invoice_no: invoice_no }));
                        const clientNameGet = yield invoiceModel.getClientName(Number(invoicePayload.invoice_client_id));
                        for (const ticket of ticketsFormat) {
                            const { airTicketDetails, clTransPayload, VTransPayload, vendor_name, } = ticket;
                            const { airticket_id, airticket_is_deleted, airticket_existing_airticket_id, airticket_existing_invoice, previous_ticket_no } = airTicketDetails, restAirTicket = __rest(airTicketDetails, ["airticket_id", "airticket_is_deleted", "airticket_existing_airticket_id", "airticket_existing_invoice", "previous_ticket_no"]);
                            console.log('lokkhoncherrry', airTicketDetails.previous_ticket_no);
                            const vendorNameGet = yield invoiceModel.getVendorName(Number(ticket.airTicketDetails.airticket_vendor_id));
                            // --------- SALES
                            const ac_sale_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'DEBIT',
                                description: `Ticket sale to ${clientNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_sale_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Sales)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'CREDIT',
                                description: `Ticket sale to ${clientNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Purchase)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'DEBIT',
                                description: `Purchase ticket from ${vendorNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'CREDIT',
                                description: `Purchase ticket from ${vendorNameGet} on account`,
                                payment_type: 'INVOICE',
                            });
                            const clTrans = yield invoiceModel.insertClientTrans(Object.assign(Object.assign({}, clTransPayload), { ctrxn_voucher: invoice_no, 
                                // ctrxn_voucher: `ClientTrans-${invoiceId}`,
                                ctrxn_created_date: invoicePayload.invoice_sales_date, ctrxn_ref_id: invoiceId }));
                            const vTrans = yield invoiceModel.insertVendorTrans(Object.assign(Object.assign({}, VTransPayload), { vtrxn_voucher: invoice_no, vtrxn_created_date: invoicePayload.invoice_sales_date, 
                                // vtrxn_voucher: `VendorTrans-${invoiceId}`,
                                vtrxn_ref_id: invoiceId }));
                            const superman = yield model.getTicketInfoByTicketNumber(airTicketDetails.airticket_ticket_no);
                            const checkInvoiceNoWiseInfo = yield model.getTicketInfoByNumber(airTicketDetails.previous_ticket_no);
                            console.log('checkInvoiceNoWiseInfo', checkInvoiceNoWiseInfo.airticket_id);
                            console.log('LokhnoCherry', checkInvoiceNoWiseInfo);
                            const airTicketItemPayload = Object.assign(Object.assign({}, restAirTicket), { airticket_existing_airticket_id: checkInvoiceNoWiseInfo.airticket_id, airticket_existing_invoice: checkInvoiceNoWiseInfo.airticket_invoice_id, airticket_cl_com_trans_id: clTrans.clComTransId, airticket_cl_trans_id: clTrans.clTransId, airticket_invoice_id: invoiceId, airticket_org_agency: 154, airticket_v_com_trans_id: vTrans.vendorComTransId, airticket_v_trans_id: vTrans.vendorTransId, airticket_ac_sale_vou1: ac_sale_vou1, airticket_ac_sale_vou2: ac_sale_vou2, airticket_ac_pur_vou1: ac_pur_vou1, airticket_ac_pur_vou2: ac_pur_vou2 });
                            yield invoiceModel.insertAirTicketReissueItem(airTicketItemPayload);
                            yield model.updateIsReissued(checkInvoiceNoWiseInfo.airticket_invoice_id, checkInvoiceNoWiseInfo.airticket_id);
                        }
                        yield this.updateVoucher(req, 'ARI');
                        //content and history data must be added there
                    }
                    catch (error) {
                        console.error('Error processing invoice:', error);
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: invoices,
                };
            }));
        });
    }
    receipt(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.receipt();
            const invoiceModel = this.Model.agentDashboardModel();
            const data = yield model.singleEntryInvoicesReceipt();
            const invoices = [];
            for (const itemData of data) {
                const ticketItems = yield model.singleReceiptItems(itemData.receipt_id);
                const masterReceipt = {
                    receipt_account_id: itemData.receipt_account_id,
                    receipt_discount: itemData.receipt_total_discount,
                    receipt_org_agency: 154,
                    comb_client: itemData.receipt_client_id,
                    client_name: 'Armaan Meow',
                    receipt_total: itemData.receipt_total_amount,
                    receipt_date: itemData.receipt_payment_date,
                    receipt_to: itemData.receipt_payment_to,
                    receipt_payment_type: null,
                    receipt_note: itemData.receipt_note,
                    // transaction_no: null,
                    // bank_name: 'Armaan Meow',
                    // cheque_number: 'Armaan Meow',
                    // cheque_date: 'Armaan Meow',
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
            // return {
            //   data: data,
            //   code: this.StatusCode.HTTP_OK,
            // };
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const receipt_no = yield this.generateVoucher(req, 'MR');
                for (const rec of invoices) {
                    try {
                        // --------- RECEIPT
                        let clTrans = {
                            clComTransId: null,
                            clTransId: null,
                        };
                        const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)('client' + `${rec.receipt_client_id}`);
                        let receipt_voucher1 = null;
                        let receipt_voucher2 = null;
                        let receipt_cheque_id = null;
                        if (rec.receipt_payment_type !== 'CHEQUE') {
                            const accHeadId = yield invoiceModel.getAccountName(rec.account_name);
                            const voucherDescription = `Money receipt of ${rec.receipt_total}/- from ${'armaan'} through  ${rec.receipt_payment_type}.`;
                            const receipt_voucher1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: accHeadId,
                                voucher_no: `${receipt_no}R`,
                                amount: rec.receipt_amount,
                                trans_type: 'DEBIT',
                                description: voucherDescription,
                                payment_type: 'RECEIPT',
                            });
                            const receipt_voucher2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Accounts Receivables'],
                                voucher_no: `${receipt_no}R`,
                                amount: rec.receipt_amount,
                                trans_type: 'CREDIT',
                                description: voucherDescription,
                                payment_type: 'RECEIPT',
                            });
                            clTrans = yield invoiceModel.insertClientTrans({
                                ctrxn_voucher: receipt_no,
                                client_id,
                                combined_id,
                                ctrxn_amount: rec.receipt_total,
                                ctrxn_created_at: rec.receipt_date,
                                ctrxn_note: rec.receipt_note,
                                ctrxn_particular_id: 31,
                                ctrxn_type: 'CREDIT',
                                ctrxn_pay_type: rec.receipt_payment_type,
                            });
                        }
                        else {
                            receipt_cheque_id = yield invoiceModel.insertCheque({
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
                        const receiptPayload = {
                            comb_client: rec.comb_client,
                            bank_name: rec.bank_name,
                            cheque_date: rec.cheque_date,
                            cheque_number: rec.cheque_number,
                            receipt_account_id: rec.cheque_number,
                            receipt_note: rec.receipt_note,
                            receipt_amount: rec.receipt_note,
                            receipt_client_id: client_id,
                            receipt_cl_trxn_id: clTrans === null || clTrans === void 0 ? void 0 : clTrans.clTransId,
                            receipt_combined_id: combined_id,
                            receipt_com_trxn_id: clTrans === null || clTrans === void 0 ? void 0 : clTrans.clComTransId,
                            receipt_created_by: 1666,
                            receipt_date: rec.receipt_note,
                            receipt_discount: rec.receipt_discount,
                            receipt_no,
                            receipt_org_agency: 154,
                            receipt_to: rec.receipt_payment_type,
                            receipt_payment_type: rec.receipt_payment_type,
                            receipt_status: +rec.receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS',
                            receipt_total: rec.receipt_total,
                            received_by: 1666,
                            transaction_no: null,
                            receipt_voucher1: receipt_voucher1,
                            receipt_voucher2: receipt_voucher2,
                            receipt_cheque_id,
                            last_balance: 0,
                        };
                        const receipt_id = yield invoiceModel.insertReceipt(receiptPayload);
                        if (rec.receipt_to === 'OVERALL') {
                            const total_due = yield invoiceModel.getInvoiceWiseDue(client_id, combined_id);
                            const { payment_total, inv_history } = (0, common_helper_1.getReceiptOverallPaymentInvoice)(total_due, rec.receipt_total, receipt_id, 1666, receipt_no);
                            yield invoiceModel.insertReceiptItems(payment_total);
                            // await invConn.insertInvoiceHistory(inv_history);
                        }
                        else {
                            const inv_history = [];
                            const receiptItems = invoices === null || invoices === void 0 ? void 0 : invoices.map((item) => {
                                const invHistory = {
                                    history_activity_type: 'INVOICE_PAYMENT_CREATED',
                                    history_created_by: 1666,
                                    history_invoice_id: item.invoice_id,
                                    history_invoice_payment_amount: item.total,
                                    invoicelog_content: `Specific receipt Amount:${item.amount}/-, Discount:${item.discount}/-, Total:${item.total}/- Voucher:${receipt_no}`,
                                };
                                inv_history.push(invHistory);
                                return Object.assign(Object.assign({}, item), { receipt_id });
                            });
                            yield invoiceModel.insertReceiptItems(receiptItems);
                            // await invConn.insertInvoiceHistory(inv_history);
                        }
                        yield this.updateVoucher(req, 'MR');
                        //content and history data must be added there
                    }
                    catch (error) {
                        console.error('Error processing invoice:', error);
                    }
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    data: '',
                };
            }));
        });
    }
}
exports.default = nonComService;
