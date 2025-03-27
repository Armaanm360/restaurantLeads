"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReceiptOverallPaymentInvoice = exports.generateNextGroupCode = exports.formatDate = exports.toNum = exports.separateCombClientToId = void 0;
const customEror_1 = __importDefault(require("../../utils/lib/customEror"));
const separateCombClientToId = (comb_client) => {
    console.log('comb_client', comb_client);
    if (!comb_client ||
        ['all', 'undefined'].includes(comb_client.toLowerCase())) {
        return { client_id: null, combined_id: null, vendor_id: null };
    }
    if (!comb_client) {
        // throw new CustomError(
        //   'Please provide valid client or vendor id',
        //   400,
        //   'Invalid client or vendor'
        // );
    }
    const clientCom = comb_client.split('-');
    const client_type = clientCom[0];
    if (!['client', 'combined', 'vendor'].includes(client_type)) {
        throw new customEror_1.default('Client type must be client, combined or vendor', 400
        // 'Invalid type'
        );
    }
    let client_id = null;
    let combined_id = null;
    let vendor_id = null;
    if (client_type === 'client') {
        client_id = Number(clientCom[1]);
    }
    else if (client_type === 'combined') {
        combined_id = Number(clientCom[1]);
    }
    else if (client_type === 'vendor') {
        vendor_id = Number(clientCom[1]);
    }
    return { client_id, combined_id, vendor_id };
};
exports.separateCombClientToId = separateCombClientToId;
const toNum = (strNum) => strNum ? Number(strNum === null || strNum === void 0 ? void 0 : strNum.replace(/,/g, '')) : 0;
exports.toNum = toNum;
const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
exports.formatDate = formatDate;
const generateNextGroupCode = (lastCode, sumNum, isParent) => {
    let parts = lastCode === null || lastCode === void 0 ? void 0 : lastCode.split('.');
    if (parts.length === 1 && !isParent) {
        parts.push('000');
    }
    let lastPart = parseInt(parts.pop(), 10) + 1 + (sumNum || 0);
    parts.push(lastPart.toString().padStart(3, '0'));
    return parts.join('.');
};
exports.generateNextGroupCode = generateNextGroupCode;
const getReceiptOverallPaymentInvoice = (total_due, receipt_total, receipt_id, user, voucher) => {
    let total_payment = receipt_total;
    const payment_total = [];
    const inv_history = [];
    for (let i = 0; i < total_due.length; i++) {
        // If total_payment is 0, break the loop
        if (total_payment === 0) {
            break;
        }
        const dueInvoice = total_due[i];
        const dueAmount = parseFloat(dueInvoice.due_amount);
        // Calculate the payment amount for this invoice
        let paymentAmount = Math.min(dueAmount, total_payment);
        // Add payment to payment_total array
        payment_total.push({
            invoice_id: dueInvoice.invoice_id,
            amount: paymentAmount,
            discount: 0,
            total: paymentAmount,
            receipt_id,
            remark: 'FROM OVERALL',
        });
        // invoice history
        const invHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_created_by: user,
            history_invoice_id: dueInvoice.invoice_id,
            history_invoice_payment_amount: paymentAmount,
            invoicelog_content: `Money receipt from overall - ${voucher}`,
        };
        inv_history.push(invHistory);
        // Deduct the payment from total_payment
        total_payment -= paymentAmount;
        // If total payment reaches zero, break the loop
        if (total_payment === 0) {
            break;
        }
    }
    return { payment_total, inv_history };
};
exports.getReceiptOverallPaymentInvoice = getReceiptOverallPaymentInvoice;
