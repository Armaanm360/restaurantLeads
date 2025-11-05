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
exports.RefundService = void 0;
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const common_helper_1 = require("../helpers/common.helper");
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';
class RefundService extends abstract_service_1.default {
    constructor() {
        super();
    }
    refundTest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            // Function to get refunds with their associated items
            function getRefundsWithItems() {
                return __awaiter(this, void 0, void 0, function* () {
                    // Get the refunds
                    const refunds = yield model.getSingleEntryRefund(76);
                    // For each refund, fetch and attach its refund items and extra info
                    const refundsWithItems = yield Promise.all(refunds.map((refund) => __awaiter(this, void 0, void 0, function* () {
                        // Fetch refund items
                        const refundItems = yield model.getInvoiceWiseRefundAirticketOld(refund.atrefund_id);
                        // Fetch client info for this refund
                        const clientInfo = yield model.getSingleClientInfo(refund.atrefund_client_id);
                        // Attach double entry info to each refund item
                        const refundItemsWithDoubleEntry = yield Promise.all(refundItems.map((item) => __awaiter(this, void 0, void 0, function* () {
                            const doubleEntry = yield model.getAllAirTicketBased(item.airticket_ticket_no);
                            return Object.assign(Object.assign({}, item), { double_entry_ticket: (doubleEntry === null || doubleEntry === void 0 ? void 0 : doubleEntry.airticket_ticket_no) || null, double_entry_airticket_id: (doubleEntry === null || doubleEntry === void 0 ? void 0 : doubleEntry.airticket_id) || null, double_entry_invoice_id: (doubleEntry === null || doubleEntry === void 0 ? void 0 : doubleEntry.airticket_invoice_id) || null, double_vendor_id: (doubleEntry === null || doubleEntry === void 0 ? void 0 : doubleEntry.vendor_id) || null });
                        })));
                        // Return refund object with new fields
                        return Object.assign(Object.assign({}, refund), { refund_items: refundItemsWithDoubleEntry, client_info: clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.doubleClientId });
                    })));
                    return refundsWithItems;
                });
            }
            // Usage
            const refundsData = yield getRefundsWithItems();
            // return {
            //   data: refundsData,
            //   code: this.StatusCode.HTTP_ACCEPTED,
            // };
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const processingErrors = [];
                let successCount = 0;
                let errorCount = 0;
                for (const refunds of refundsData) {
                    try {
                        const conn = this.Model.agentDashboardModel();
                        console.log('Processing refund for:', refunds);
                        const clientInfo = yield model.getSingleClientInfo(refunds.atrefund_client_id);
                        let com_client = (clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.doubleClientId)
                            ? `client-${clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.doubleClientId}`
                            : `combined-${refunds.atrefund_combined_id}`;
                        const voucher_no = yield this.superVoucher(req, 'ARF');
                        const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_client);
                        let sales_price = 0;
                        let purchase_price = 0;
                        let total_penalties = 0;
                        let client_extra_fee = 0;
                        const refundItems = [];
                        const { refund_by, refund_date, refund_note, client_name, items } = req.body;
                        for (const item of refunds.refund_items) {
                            try {
                                const { vendor_name } = item, restItem = __rest(item, ["vendor_name"]);
                                const airTicketInfo = yield conn.getSingleEntryAirticketInfo(item.airticket_ticket_no);
                                sales_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0);
                                purchase_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0);
                                total_penalties += Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                                client_extra_fee += Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                                const client_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.penalties) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                                const vendor_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                                function getValidAmount(value) {
                                    const num = Number(value);
                                    return !isNaN(num) && isFinite(num) ? num : 0;
                                }
                                const sale_return_vou1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket((-) Sales Return)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price,
                                    trans_type: 'DEBIT',
                                    description: `Ticket return from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const sale_return_vou2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price),
                                    trans_type: 'CREDIT',
                                    description: `Ticket return from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const purchase_return_vou1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price),
                                    trans_type: 'DEBIT',
                                    description: `Ticket return to ${(item === null || item === void 0 ? void 0 : item.vendor_name) || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const purchase_return_vou2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Purchases Return)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price),
                                    trans_type: 'CREDIT',
                                    description: `Ticket return to ${(item === null || item === void 0 ? void 0 : item.vendor_name) || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const penalty_vou_1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Refund Penalties'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'DEBIT',
                                    description: `Refund Penalty from ${vendor_name || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const penalty_vou_2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'CREDIT',
                                    description: `Refund Penalty from ${vendor_name || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const extra_fee_vou_1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'DEBIT',
                                    description: `Refund Charge from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const extra_fee_vou_2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Refund Charge'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'CREDIT',
                                    description: `Refund Charge from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const clientTrans = {
                                    client_id,
                                    combined_id,
                                    ctrxn_amount: +(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price),
                                    ctrxn_created_at: refunds.atrefund_date,
                                    ctrxn_note: refund_note,
                                    ctrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                                    ctrxn_type: 'CREDIT',
                                    ctrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    ctrxn_journey_date: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_journey_date,
                                    ctrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    ctrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    ctrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    ctrxn_voucher: voucher_no,
                                };
                                const vendorTrans = {
                                    com_vendor: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.comb_vendor,
                                    vtrxn_amount: +airTicketInfo.airticket_purchase_price,
                                    vtrxn_created_at: refunds.atrefund_date,
                                    vtrxn_note: refund_note,
                                    vtrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                                    vtrxn_type: 'CREDIT',
                                    vtrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    vtrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    vtrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    vtrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    vtrxn_voucher: voucher_no,
                                };
                                const clientTransExtraFee = {
                                    client_id,
                                    combined_id,
                                    ctrxn_amount: item === null || item === void 0 ? void 0 : item.vrefund_charge_amount,
                                    ctrxn_created_at: refunds.atrefund_create_date,
                                    ctrxn_note: refund_note,
                                    ctrxn_particular_id: this.trnType['REFUND CHARGE'],
                                    ctrxn_type: 'DEBIT',
                                    ctrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    ctrxn_journey_date: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_journey_date,
                                    ctrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    ctrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    ctrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    ctrxn_voucher: voucher_no,
                                };
                                const vendorTransPenalty = {
                                    com_vendor: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.comb_vendor,
                                    vtrxn_amount: item === null || item === void 0 ? void 0 : item.vrefund_charge_amount,
                                    vtrxn_created_at: refunds.atrefund_create_date,
                                    vtrxn_note: refund_note,
                                    vtrxn_particular_id: this.trnType['REFUND PENALTIES'],
                                    vtrxn_type: 'CREDIT',
                                    vtrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    vtrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    vtrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    vtrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    vtrxn_voucher: voucher_no,
                                };
                                refundItems.push({
                                    refundItem: Object.assign(Object.assign({}, restItem), { client_refund: client_refund, vendor_refund: vendor_refund, sale_return_vou1,
                                        sale_return_vou2,
                                        purchase_return_vou1,
                                        purchase_return_vou2,
                                        penalty_vou_1,
                                        penalty_vou_2,
                                        extra_fee_vou_1,
                                        extra_fee_vou_2 }),
                                    clientTrans,
                                    vendorTrans,
                                    clientTransExtraFee,
                                    vendorTransPenalty,
                                });
                            }
                            catch (itemErr) {
                                console.error('Error processing refund item:', item, itemErr);
                            }
                        }
                        const userName = yield model.getUserInfoAndId(refunds.atrefund_created_by);
                        const refundPayload = {
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
                        const refund_id = yield conn.insertRefund(refundPayload);
                        // const refundsItems: any = [];
                        // Initialize with empty array
                        const refundsItems = [];
                        for (const item of refundItems) {
                            try {
                                console.log('Processing refund item:', JSON.stringify(item, null, 2));
                                const { clientTrans, vendorTrans, clientTransExtraFee, vendorTransPenalty, refundItem, } = item;
                                // Log each transaction object to check if they contain data
                                console.log('clientTrans:', clientTrans);
                                console.log('vendorTrans:', vendorTrans);
                                console.log('clientTransExtraFee:', clientTransExtraFee);
                                console.log('vendorTransPenalty:', vendorTransPenalty);
                                console.log('refundItem:', refundItem);
                                const clTrxId = yield conn.insertClientTrans(Object.assign(Object.assign({}, clientTrans), { ctrxn_ref_id: refund_id }));
                                console.log('Client transaction inserted:', clTrxId);
                                const vTrxId = yield conn.insertVendorTrans(Object.assign(Object.assign({}, vendorTrans), { vtrxn_ref_id: refund_id }));
                                console.log('Vendor transaction inserted:', vTrxId);
                                const clExTrxId = yield conn.insertClientTrans(Object.assign(Object.assign({}, clientTransExtraFee), { ctrxn_ref_id: refund_id }));
                                console.log('Client extra fee transaction inserted:', clExTrxId);
                                const vPenTrxId = yield conn.insertVendorTrans(Object.assign(Object.assign({}, vendorTransPenalty), { vtrxn_ref_id: refund_id }));
                                console.log('Vendor penalty transaction inserted:', vPenTrxId);
                                const getTicketWiseId = yield conn.getTicketInfoByTicketNumberDouble(refundItem.airticket_ticket_no);
                                console.log('Ticket info retrieved:', getTicketWiseId);
                                const refundItemData = {
                                    refund_id,
                                    client_refund: (Number(refundItem === null || refundItem === void 0 ? void 0 : refundItem.airticket_client_price) || 0) -
                                        (Number(refundItem === null || refundItem === void 0 ? void 0 : refundItem.vrefund_charge_amount) || 0),
                                    vendor_refund: (Number(refundItem === null || refundItem === void 0 ? void 0 : refundItem.airticket_purchase_price) || 0) -
                                        (Number(refundItem === null || refundItem === void 0 ? void 0 : refundItem.vrefund_charge_amount) || 0),
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
                                    v_penalty_trans_id: (vPenTrxId === null || vPenTrxId === void 0 ? void 0 : vPenTrxId.vendorTransId) != null
                                        ? Number(vPenTrxId.vendorTransId)
                                        : null,
                                    cl_extra_fee_trans_id: (clExTrxId === null || clExTrxId === void 0 ? void 0 : clExTrxId.clTransId) != null
                                        ? Number(clExTrxId.clTransId)
                                        : null,
                                    clTransId: (clTrxId === null || clTrxId === void 0 ? void 0 : clTrxId.clTransId) != null ? Number(clTrxId.clTransId) : null,
                                    clComTransId: (clTrxId === null || clTrxId === void 0 ? void 0 : clTrxId.clComTransId) != null
                                        ? Number(clTrxId.clComTransId)
                                        : null,
                                    vendorTransId: (vTrxId === null || vTrxId === void 0 ? void 0 : vTrxId.vendorTransId) != null
                                        ? Number(vTrxId.vendorTransId)
                                        : null,
                                    vendorComTransId: (vTrxId === null || vTrxId === void 0 ? void 0 : vTrxId.vendorComTransId) != null
                                        ? Number(vTrxId.vendorComTransId)
                                        : null,
                                };
                                console.log('Refund item data prepared:', refundItemData);
                                refundsItems.push(refundItemData);
                            }
                            catch (subErr) {
                                console.error('Error inserting refund sub-data:', subErr);
                                // Consider re-throwing or handling differently if you want to stop execution
                            }
                        }
                        console.log('Total refund items to insert:', refundsItems.length);
                        console.log('Refund items data:', refundsItems);
                        if (refundsItems.length === 0) {
                            console.warn('No refund items to insert - this might cause "query is empty" error');
                            // You might want to throw an error or handle this case differently
                        }
                        else {
                            yield conn.insertRefundItems(refundsItems);
                            console.log('Refund items inserted successfully');
                        }
                        yield this.updateVoucher(req, 'ARF');
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
                            invoice: refunds,
                            error: error instanceof Error ? error.message : String(error),
                            errorType: errorType,
                        });
                        console.error('Error processing refund:', refunds, error);
                    }
                }
                return {
                    success: errorCount === 0,
                    code: errorCount === 0
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
                        }, {}),
                    },
                };
            }));
        });
    }
    refundTestNon(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            // Function to get refunds with their associated items
            function getRefundsWithItems() {
                return __awaiter(this, void 0, void 0, function* () {
                    // Get the refunds
                    const refunds = yield model.getSingleEntryRefundNonCom(76);
                    // For each refund, fetch and attach its refund items
                    const refundsWithItems = yield Promise.all(refunds.map((refund) => __awaiter(this, void 0, void 0, function* () {
                        const refundItems = yield model.getInvoiceWiseRefundAirticketOld(refund.atrefund_id);
                        return Object.assign(Object.assign({}, refund), { refund_items: refundItems });
                    })));
                    return refundsWithItems;
                });
            }
            // Usage
            const refundsData = yield getRefundsWithItems();
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const processingErrors = [];
                let successCount = 0;
                let errorCount = 0;
                for (const refunds of refundsData) {
                    try {
                        const conn = this.Model.agentDashboardModel();
                        console.log('Processing refund for:', refunds);
                        let com_client = refunds.atrefund_client_id
                            ? `client-${refunds.atrefund_client_id}`
                            : `combined-${refunds.atrefund_combined_id}`;
                        const voucher_no = yield this.superVoucher(req, 'ARF');
                        const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_client);
                        let sales_price = 0;
                        let purchase_price = 0;
                        let total_penalties = 0;
                        let client_extra_fee = 0;
                        const refundItems = [];
                        const { refund_by, refund_date, refund_note, client_name, items } = req.body;
                        for (const item of refunds.refund_items) {
                            try {
                                const { vendor_name } = item, restItem = __rest(item, ["vendor_name"]);
                                const airTicketInfo = yield conn.getSingleEntryAirticketInfo(item.airticket_ticket_no);
                                console.log('Fetched AirTicket Info:', airTicketInfo);
                                sales_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0);
                                purchase_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0);
                                total_penalties += Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                                client_extra_fee += Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                                const client_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.penalties) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                                const vendor_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0) -
                                    Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                                function getValidAmount(value) {
                                    const num = Number(value);
                                    return !isNaN(num) && isFinite(num) ? num : 0;
                                }
                                const sale_return_vou1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket((-) Sales Return)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price,
                                    trans_type: 'DEBIT',
                                    description: `Ticket return from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const sale_return_vou2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price),
                                    trans_type: 'CREDIT',
                                    description: `Ticket return from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const purchase_return_vou1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price),
                                    trans_type: 'DEBIT',
                                    description: `Ticket return to ${(item === null || item === void 0 ? void 0 : item.vendor_name) || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const purchase_return_vou2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Purchases Return)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price),
                                    trans_type: 'CREDIT',
                                    description: `Ticket return to ${(item === null || item === void 0 ? void 0 : item.vendor_name) || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const penalty_vou_1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Refund Penalties'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'DEBIT',
                                    description: `Refund Penalty from ${vendor_name || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const penalty_vou_2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'CREDIT',
                                    description: `Refund Penalty from ${vendor_name || 'Unknown Vendor'}`,
                                    payment_type: 'REFUND',
                                });
                                const extra_fee_vou_1 = yield model.insertAccVoucherDb({
                                    serial_no: 1,
                                    acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'DEBIT',
                                    description: `Refund Charge from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const extra_fee_vou_2 = yield model.insertAccVoucherDb({
                                    serial_no: 2,
                                    acc_head_id: this.accHead['Refund Charge'],
                                    voucher_no: voucher_no + 'AIR',
                                    amount: getValidAmount(item === null || item === void 0 ? void 0 : item.vrefund_charge_amount),
                                    trans_type: 'CREDIT',
                                    description: `Refund Charge from ${client_name || 'Unknown Client'}`,
                                    payment_type: 'REFUND',
                                });
                                const clientTrans = {
                                    client_id,
                                    combined_id,
                                    ctrxn_amount: +(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price),
                                    ctrxn_created_at: refunds.atrefund_date,
                                    ctrxn_note: refund_note,
                                    ctrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                                    ctrxn_type: 'CREDIT',
                                    ctrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    ctrxn_journey_date: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_journey_date,
                                    ctrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    ctrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    ctrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    ctrxn_voucher: voucher_no,
                                };
                                const vendorTrans = {
                                    com_vendor: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.comb_vendor,
                                    vtrxn_amount: +airTicketInfo.airticket_purchase_price,
                                    vtrxn_created_at: refunds.atrefund_date,
                                    vtrxn_note: refund_note,
                                    vtrxn_particular_id: this.trnType['REFUND-AIR TICKET'],
                                    vtrxn_type: 'CREDIT',
                                    vtrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    vtrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    vtrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    vtrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    vtrxn_voucher: voucher_no,
                                };
                                const clientTransExtraFee = {
                                    client_id,
                                    combined_id,
                                    ctrxn_amount: item === null || item === void 0 ? void 0 : item.vrefund_charge_amount,
                                    ctrxn_created_at: refunds.atrefund_create_date,
                                    ctrxn_note: refund_note,
                                    ctrxn_particular_id: this.trnType['REFUND CHARGE'],
                                    ctrxn_type: 'DEBIT',
                                    ctrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    ctrxn_journey_date: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_journey_date,
                                    ctrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    ctrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    ctrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    ctrxn_voucher: voucher_no,
                                };
                                const vendorTransPenalty = {
                                    com_vendor: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.comb_vendor,
                                    vtrxn_amount: item === null || item === void 0 ? void 0 : item.vrefund_charge_amount,
                                    vtrxn_created_at: refunds.atrefund_create_date,
                                    vtrxn_note: refund_note,
                                    vtrxn_particular_id: this.trnType['REFUND PENALTIES'],
                                    vtrxn_type: 'CREDIT',
                                    vtrxn_airticket_no: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_ticket_no,
                                    vtrxn_pax: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pax_name,
                                    vtrxn_pnr: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_pnr,
                                    vtrxn_route: airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_route_or_sector,
                                    vtrxn_voucher: voucher_no,
                                };
                                refundItems.push({
                                    refundItem: Object.assign(Object.assign({}, restItem), { client_refund,
                                        vendor_refund,
                                        sale_return_vou1,
                                        sale_return_vou2,
                                        purchase_return_vou1,
                                        purchase_return_vou2,
                                        penalty_vou_1,
                                        penalty_vou_2,
                                        extra_fee_vou_1,
                                        extra_fee_vou_2 }),
                                    clientTrans,
                                    vendorTrans,
                                    clientTransExtraFee,
                                    vendorTransPenalty,
                                });
                            }
                            catch (itemErr) {
                                console.error('Error processing refund item:', item, itemErr);
                            }
                        }
                        const refundPayload = {
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
                        const refund_id = yield conn.insertRefund(refundPayload);
                        const refundsItems = [];
                        for (const item of refundItems) {
                            try {
                                const { clientTrans, vendorTrans, clientTransExtraFee, vendorTransPenalty, refundItem, } = item;
                                const clTrxId = yield conn.insertClientTrans(Object.assign(Object.assign({}, clientTrans), { ctrxn_ref_id: refund_id }));
                                const vTrxId = yield conn.insertVendorTrans(Object.assign(Object.assign({}, vendorTrans), { vtrxn_ref_id: refund_id }));
                                const clExTrxId = yield conn.insertClientTrans(Object.assign(Object.assign({}, clientTransExtraFee), { ctrxn_ref_id: refund_id }));
                                const vPenTrxId = yield conn.insertVendorTrans(Object.assign(Object.assign({}, vendorTransPenalty), { vtrxn_ref_id: refund_id }));
                                const getTicketWiseId = yield conn.getTicketInfoByTicketNumberDouble(refundItem.airticket_ticket_no);
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
                                    v_penalty_trans_id: (vPenTrxId === null || vPenTrxId === void 0 ? void 0 : vPenTrxId.vendorTransId) != null
                                        ? Number(vPenTrxId.vendorTransId)
                                        : null,
                                    cl_extra_fee_trans_id: (clExTrxId === null || clExTrxId === void 0 ? void 0 : clExTrxId.clTransId) != null
                                        ? Number(clExTrxId.clTransId)
                                        : null,
                                    clTransId: (clTrxId === null || clTrxId === void 0 ? void 0 : clTrxId.clTransId) != null ? Number(clTrxId.clTransId) : null,
                                    clComTransId: (clTrxId === null || clTrxId === void 0 ? void 0 : clTrxId.clComTransId) != null
                                        ? Number(clTrxId.clComTransId)
                                        : null,
                                    vendorTransId: (vTrxId === null || vTrxId === void 0 ? void 0 : vTrxId.vendorTransId) != null
                                        ? Number(vTrxId.vendorTransId)
                                        : null,
                                    vendorComTransId: (vTrxId === null || vTrxId === void 0 ? void 0 : vTrxId.vendorComTransId) != null
                                        ? Number(vTrxId.vendorComTransId)
                                        : null,
                                });
                            }
                            catch (subErr) {
                                console.error('Error inserting refund sub-data:', subErr);
                            }
                        }
                        yield conn.insertRefundItems(refundsItems);
                        yield this.updateVoucher(req, 'ARF');
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
                            invoice: refunds,
                            error: error instanceof Error ? error.message : String(error),
                            errorType: errorType,
                        });
                        console.error('Error processing refund:', refunds, error);
                    }
                }
                return {
                    success: errorCount === 0,
                    code: errorCount === 0
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
                        }, {}),
                    },
                };
            }));
        });
    }
}
exports.RefundService = RefundService;
