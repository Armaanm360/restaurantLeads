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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonTypes_1 = require("../../common/types/commonTypes");
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
const common_helper_1 = require("../../common/helpers/common.helper");
const config_1 = __importDefault(require("../../config/config"));
class NonComModel extends schema_1.default {
    constructor(db, db2) {
        super();
        //hello world
        this.insertAccVoucher = (payload) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('acc_voucher').insert(payload);
            return id;
        });
        this.insertAccVoucherDb = (body) => __awaiter(this, void 0, void 0, function* () {
            const { serial_no, acc_head_id, voucher_no, amount, trans_type, description, payment_type, payment_method, bank_name, } = body;
            const payload = {
                acc_head_id,
                created_by: 127,
                credit: trans_type === 'CREDIT' ? amount : 0,
                debit: trans_type === 'DEBIT' ? amount : 0,
                description,
                org_id: 154,
                payment_method,
                payment_type,
                serial_no,
                voucher_date: commonTypes_1.CTimestamp,
                voucher_no,
                bank_name,
            };
            return yield this.insertAccVoucher(payload);
        });
        // IClTrxnBody
        this.insertClientTrans = (body) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id, ctrxn_amount, ctrxn_created_at, ctrxn_note, ctrxn_particular_id, ctrxn_pax, ctrxn_pnr, ctrxn_route, ctrxn_type, ctrxn_voucher, ctrxn_airticket_no, ctrxn_pay_type, ctrxn_journey_date, ctrxn_return_date, ctrxn_ref_id, } = body;
            // console.log('where the problem is actually happening!', body);
            let clTransId = null;
            let clComTransId = null;
            if (client_id) {
                console.log('client_id', client_id);
                const clTrxnBody = {
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
                clTransId = yield this.insertClTrxn(clTrxnBody);
            }
            else if (combined_id) {
                const comTrxnBody = {
                    comtrxn_voucher_no: ctrxn_voucher,
                    comtrxn_airticket_no: ctrxn_airticket_no,
                    comtrxn_route: ctrxn_route,
                    comtrxn_pnr: ctrxn_pnr,
                    comtrxn_pax: ctrxn_pax,
                    comtrxn_type: ctrxn_type,
                    comtrxn_comb_id: combined_id,
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
                clComTransId = yield this.insertComTrxn(comTrxnBody);
            }
            return { clTransId, clComTransId };
        });
        this.insertVendorTrans = (body) => __awaiter(this, void 0, void 0, function* () {
            const { com_vendor, vtrxn_voucher, vtrxn_pax, vtrxn_airticket_no, vtrxn_pnr, vtrxn_route, vtrxn_type, vtrxn_amount, vtrxn_particular_id, vtrxn_note, vtrxn_created_at, vtrxn_pay_type, vtrxn_ref_id, } = body;
            let vendorTransId = null;
            let vendorComTransId = null;
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_vendor);
            if (vendor_id) {
                const VTrxnBody = {
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
                vendorTransId = yield this.insertVTrxn(VTrxnBody);
            }
            else if (combined_id) {
                const comTrxnBody = {
                    comtrxn_voucher_no: vtrxn_voucher,
                    comtrxn_type: vtrxn_type,
                    comtrxn_comb_id: combined_id,
                    comtrxn_particular_id: vtrxn_particular_id,
                    comtrxn_amount: vtrxn_amount,
                    comtrxn_note: vtrxn_note,
                    comtrxn_created_at: vtrxn_created_at,
                    comtrxn_user_id: 127,
                    comtrxn_agency_id: 154,
                    comtrxn_pax: vtrxn_pax,
                    comtrxn_pnr: vtrxn_pnr,
                    comtrxn_route: vtrxn_route,
                    comtrxn_airticket_no: vtrxn_airticket_no,
                    comtrxn_ref_id: vtrxn_ref_id,
                };
                vendorComTransId = yield this.insertComTrxn(comTrxnBody);
            }
            return { vendorTransId, vendorComTransId };
        });
        this.generateVoucher = (voucher_type) => __awaiter(this, void 0, void 0, function* () {
            const [[[voucher]]] = yield this.db.raw(`call ${config_1.default.DB_NAME2}.get_voucher_num('${voucher_type}', ${154})`);
            return voucher.voucher_number;
        });
        this.updateVoucher = (voucher_type) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`call ${config_1.default.DB_NAME2}.updateVoucherNumber('${voucher_type}', 154)`);
        });
        this.db = db;
        this.db2 = db2;
    }
    getSingleEntryClient(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ client_org_agency: agency_id })
                .andWhere('client_is_deleted', false);
        });
    }
    insertClTrxn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2(`client_trxn`).insert(payload);
            return id;
        });
    }
    // IComTrxnDb
    insertComTrxn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('comb_trxn').insert(payload);
            return id;
        });
    }
    insertVTrxn(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('vendor_trxn').insert(payload);
            return id;
        });
    }
    getSingleEntryVendor(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_vendors')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ vendor_org_agency: agency_id })
                .andWhere('vendor_is_deleted', false);
        });
    }
    getSingleEntryEmployee(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_employees')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ employee_org_agency: agency_id })
                .andWhere('employee_is_deleted', false);
        });
    }
    getDoubleEntryClient(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_clients')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ client_org_agency: agency_id })
                .andWhere('client_is_deleted', false);
        });
    }
    getDoubleEntryVendor(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_vendors')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ vendor_org_agency: agency_id })
                .andWhere('vendor_is_deleted', false);
        });
    }
    getDoubleEntryEmployee(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_vendors')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ vendor_org_agency: agency_id })
                .andWhere('vendor_is_deleted', false);
        });
    }
    columnSingle() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .columnInfo();
        });
    }
    columnDouble() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_clients')
                .withSchema(this.DOUBLE)
                .columnInfo();
        });
    }
    columnSingleVendor() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_vendors')
                .withSchema(this.SINGLE)
                .columnInfo();
        });
    }
    columnSingleEmployee() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_employees')
                .withSchema(this.SINGLE)
                .columnInfo();
        });
    }
    columnDoubleVendor() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_vendors')
                .withSchema(this.DOUBLE)
                .columnInfo();
        });
    }
    columnDoubleEmployee() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_employees')
                .withSchema(this.DOUBLE)
                .columnInfo();
        });
    }
    insertDoubleEntry(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_clients')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    insertDoubleEntryVendor(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_vendors')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    insertDoubleEntryEmployee(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_employees')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    // invoice latest points
    singleEntryInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesRefund() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
                .withSchema('trabill_iata_single_entry_2025')
                .select('*')
                .where({
                invoice_org_agency: 76,
                invoice_category_id: 1,
                invoice_is_refund: 1,
            });
        });
    }
    singleEntryInvoicesRefundCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesReissue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesVoid() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesCanceled() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesReissueRefund() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
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
        });
    }
    singleEntryInvoicesAirTicketItems(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_noncom_airticket_items')
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
        });
    }
    singleEntryInvoicesAirTicketItemsRefund(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items')
                .withSchema(this.SINGLE)
                .select('*')
                .where('airticket_org_agency', 76)
                .andWhere('airticket_invoice_id', invoice_id)
                .andWhere('airticket_ticket_type', 'NEW TKT')
                .andWhere('airticket_is_reissued', 0)
                .andWhere('airticket_is_refund', 0)
                .andWhere('airticket_is_void', 0)
                .andWhere('airticket_is_deleted', 0);
        });
    }
    //insert invoice
    insertInvoicesInfo(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [invoice_id] = yield this.db2('trabill_invoices').insert(payload);
            return invoice_id;
        });
    }
    insertAirTicketItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [airticket_id] = yield this.db2('trabill_invoice_noncom_airticket_items').insert(payload);
            return airticket_id;
        });
    }
    refreshDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('acc_voucher').where('org_id', 154).delete();
            yield this.db2('trabill_invoice_airticket_items')
                .where('airticket_org_agency', 154)
                .delete();
            yield this.db2('vendor_trxn').where('vtrxn_agency_id', 154).delete();
            yield this.db2('client_trxn').where('ctrxn_agency_id', 154).delete();
            const ids = yield this.db2('trabill_refunds')
                .where('org_agency', 154)
                .pluck('id');
            // Loop through the IDs and delete the corresponding records
            for (const id of ids) {
                yield this.db2('trabill_refund_items').where('refund_id', id).delete();
            }
            yield this.db2('trabill_refunds').where('org_agency', 154).delete();
            // Delete records from trabill_invoices based on invoice_org_agency
            return yield this.db2('trabill_invoices')
                .where('invoice_org_agency', 154)
                .delete();
        });
    }
    getClientName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_clients')
                .select('client_name')
                .where('client_id', id)
                .first();
        });
    }
    getVendorName(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_vendors')
                .select('vendor_name')
                .where('vendor_id', id)
                .first();
        });
    }
    insertAirTicketPax(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_invoice_airticket_pax').insert(payload);
        });
    }
    insertAirTicketFlights(flight_details) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_invoice_airticket_flights').insert(flight_details);
        });
    }
    insertAirTicketCommission(taxes_commission) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('airticket_taxes_commissions').insert(taxes_commission);
        });
    }
    //get single entry refunds
    getSingleEntryRefund(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airticket_refunds')
                .withSchema(this.SINGLE)
                .select('*')
                .leftJoin('trabill_invoices as ti', 'ti.invoice_id', '=', 'trabill_airticket_refunds.atrefund_invoice_id')
                .where({ atrefund_org_agency: agency_id })
                .andWhere('atrefund_is_deleted', false)
                .andWhere('ti.invoice_category_id', 1);
        });
    }
    getSingleEntryRefundAirItems(refundId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airticket_client_refunds')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ crefund_refund_id: refundId });
        });
    }
    //get single entry refund invoice_wise
    getInvoiceWiseRefundAirticket(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ airticket_invoice_id: invoice_id })
                .andWhere('airticket_is_deleted', 0)
                .andWhere('airticket_is_refund', 1);
        });
    }
    getTicketInfo(invoiceId, airTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_air_tickets_info')
                .withSchema(this.SINGLE)
                .select('airticket_id', 'airticket_invoice_id', 'airticket_client_id', 'airticket_combined_id', 'airticket_vendor_id', 'airticket_vendor_combine_id', 'airticket_airline_id', 'airticket_ticket_no', 'airticket_pnr', 'airticket_classes', 'airticket_route_or_sector', 'airticket_client_price', 'airticket_purchase_price', 'airticket_pax_name', 'airticket_journey_date', 'airticket_return_date', 'comb_vendor', 'vendor_name', 'comb_client', 'client_name')
                .leftJoin('v_all_clients', function () {
                this.on('v_all_clients.client_id', '=', 'airticket_client_id').orOn('v_all_clients.combined_id', '=', 'airticket_combined_id');
            })
                .leftJoin('v_all_vendors', function () {
                this.on('v_all_vendors.vendor_id', '=', 'airticket_vendor_id').orOn('v_all_vendors.combined_id', '=', 'airticket_vendor_combine_id');
            })
                .where('airticket_org_agency', 154)
                .andWhere('airticket_id', airTicketId)
                .andWhere('airticket_invoice_id', invoiceId)
                .first();
        });
    }
    getTicketInfoByTicketNumber(airTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_invoice_airticket_items')
                .withSchema(this.DOUBLE)
                .select('airticket_id', 'airticket_invoice_id', 'airticket_client_id', 'airticket_combined_id', 'airticket_vendor_id', 'airticket_vendor_combine_id', 'airticket_airline_id', 'airticket_ticket_no', 'airticket_pnr', 'airticket_classes', 'airticket_route_or_sector', 'airticket_client_price', 'airticket_purchase_price', 'airticket_pax_name', 'airticket_journey_date', 'airticket_return_date', 'comb_vendor', 'vendor_name', 'comb_client', 'client_name')
                .leftJoin('v_all_clients', function () {
                this.on('v_all_clients.client_id', '=', 'airticket_client_id').orOn('v_all_clients.combined_id', '=', 'airticket_combined_id');
            })
                .leftJoin('v_all_vendors', function () {
                this.on('v_all_vendors.vendor_id', '=', 'airticket_vendor_id').orOn('v_all_vendors.combined_id', '=', 'airticket_vendor_combine_id');
            })
                .where('airticket_org_agency', 154)
                .andWhere('airticket_ticket_no', airTicketId)
                .first();
        });
    }
    getTicketInfoByNumber(airticketNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_invoice_airticket_items')
                .withSchema(this.DOUBLE)
                .select('*')
                .where('airticket_org_agency', 154)
                .andWhere('airticket_ticket_no', airticketNo)
                .first();
        });
    }
    insertRefund(refundItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('trabill_refunds').insert(refundItem);
            return id;
        });
    }
    insertRefundItems(refundItem) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_refund_items').insert(refundItem);
        });
    }
    getInvoiceWiseRefundAirticketOld(vrefund_refund_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_ait_refund_desc')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ vrefund_refund_id: vrefund_refund_id });
        });
    }
}
exports.default = NonComModel;
