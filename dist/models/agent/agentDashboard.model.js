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
class AgentDashboardModel extends schema_1.default {
    constructor(db, db2) {
        super();
        //hello world
        this.insertAccVoucher = (payload) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('acc_voucher').insert(payload);
            return id;
        });
        this.getHeadByAccount = (accountId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_accounts')
                .withSchema(this.DOUBLE)
                .select('*');
        });
        this.getHeadByAccountNew = (accountId) => __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.db2('trabill_accounts')
                .withSchema(this.DOUBLE)
                .first('account_head_id')
                .where('account_id', accountId));
            return data === null || data === void 0 ? void 0 : data.account_head_id;
        });
        this.getAccountName = (accountName) => __awaiter(this, void 0, void 0, function* () {
            const acc = yield this.db2('trabill_accounts')
                .withSchema(this.DOUBLE)
                .select('account_head_id')
                .where('account_org_agency', 154)
                .andWhere('account_name', accountName)
                .first();
            return acc.account_head_id;
        });
        this.getAccountID = (accountName) => __awaiter(this, void 0, void 0, function* () {
            const acc = yield this.db2('trabill_accounts')
                .withSchema(this.DOUBLE)
                .select('account_id')
                .where('account_org_agency', 154)
                .andWhere('account_name', accountName)
                .first();
            return acc.account_id;
        });
        this.getAccountInfo = (accountId) => __awaiter(this, void 0, void 0, function* () {
            const pro = yield this.db('trabill_accounts')
                .withSchema(this.SINGLE)
                .select('account_name')
                .where('account_org_agency', 76)
                .andWhere('account_id', accountId)
                .first();
            return pro.account_name;
        });
        this.getClientInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const name = yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .select('client_name')
                .where('client_org_agency', 76)
                .andWhere('client_id', id)
                .first();
            return name.client_name;
        });
        this.insertReceipt = (payload) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('trabill_receipts')
                .withSchema(this.DOUBLE)
                .insert(payload);
            return id;
        });
        this.insertPayment = (payload) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('trabill_payments')
                .withSchema(this.DOUBLE)
                .insert(payload);
            return id;
        });
        this.getInvoiceWiseDue = (clientId, combinedId) => __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.db2('v_invoice_wise_receipt')
                .select('*')
                .where('invoice_org_agency', 154)
                .andWhere('due_amount', '>', '0')
                .modify((e) => {
                if (clientId)
                    e.where('invoice_client_id', clientId);
                if (combinedId)
                    e.where('invoice_combined_id', combinedId);
            }));
            return data;
        });
        this.getTicketWiseDue = (vendorId, combinedId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('v_ticket_billing_wise_due')
                .select('*')
                .where('airticket_org_agency', 154)
                .andWhere('due_amount', '>', '0')
                .modify((e) => {
                if (vendorId)
                    e.where('airticket_vendor_id', vendorId);
                if (combinedId)
                    e.where('airticket_vendor_combine_id', combinedId);
            });
            return data;
        });
        this.insertReceiptItems = (payload) => __awaiter(this, void 0, void 0, function* () {
            if (payload.length) {
                yield this.db2('trabill_receipt_items')
                    .withSchema(this.DOUBLE)
                    .insert(payload);
            }
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
                    vtrxn_user_id: 1666,
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
        this.getLastHeadCodeByParent = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.db2('acc_head')
                .withSchema(this.DOUBLE)
                .select('head_code')
                .where('head_parent_id', id)
                .orderBy('head_id', 'desc')
                .limit(1)
                .first());
            return data === null || data === void 0 ? void 0 : data.head_code;
        });
        this.insertAccount = (body) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_accounts')
                .withSchema(this.DOUBLE)
                .insert(body);
        });
        this.insertAccHead = (payload) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('acc_head')
                .withSchema(this.DOUBLE)
                .insert(payload);
            return id;
        });
        this.db = db;
        this.db2 = db2;
    }
    getSingleEntryClient(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await this.db('trabill_clients')
            //   .withSchema(this.SINGLE)
            //   .select('*')
            //   .where({ client_org_agency: agency_id })
            //   .andWhere('client_is_deleted', false);
            const clientInvoiceTotalsSubquery = this.db('trabill_invoices')
                .select('invoice_client_id', this.db.raw('SUM(invoice_net_total) as client_total'))
                .where('invoice_org_agency', agency_id)
                .whereNot('invoice_is_deleted', 1)
                .groupBy('invoice_client_id')
                .as('client_invoice_totals');
            // Create a subquery for client payments
            const clientPaymentsSubquery = this.db('trabill_invoice_client_payments')
                .select('invclientpayment_client_id', this.db.raw('SUM(invclientpayment_amount) as total_pay'))
                .whereNot('invclientpayment_is_deleted', 1)
                .groupBy('invclientpayment_client_id')
                .as('client_payments');
            // Last transaction balance subquery
            const lastTrxnBalanceSubquery = this.db('trxn.client_trxn as ct1')
                .select('ct1.ctrxn_cl_id', 'ct1.ctrxn_lbalance', 'ct1.ctrxn_created_at')
                .whereRaw('ct1.ctrxn_id = (SELECT MAX(ct2.ctrxn_id) FROM trxn.client_trxn as ct2 WHERE ct2.ctrxn_cl_id = ct1.ctrxn_cl_id AND ct2.ctrxn_is_delete = 0)')
                .andWhere('ct1.ctrxn_is_delete', 0)
                .as('last_balance');
            const query = this.db('trabill_clients')
                .select('trabill_clients.client_id', 'trabill_clients.client_org_agency', 'trabill_clients.client_category_id', 'trabill_clients.client_entry_id', 'trabill_clients.client_email as email', 'trabill_clients.client_type', 'trabill_clients.client_gender', 'trabill_client_categories.category_prefix', 'category_title', 'trabill_clients.client_name', 'trabill_clients.client_mobile as mobile', 'trabill_clients.client_contacted_person', 'last_balance.ctrxn_lbalance as client_last_balance', 'trabill_clients.client_credit_limit', this.db.raw(`
CASE
  WHEN COALESCE(trabill_clients.client_credit_limit, 0) = 0
    THEN 0
  WHEN COALESCE(last_balance.ctrxn_lbalance, 0) < 0
    THEN COALESCE(trabill_clients.client_credit_limit, 0) - ABS(COALESCE(last_balance.ctrxn_lbalance, 0))
  ELSE COALESCE(trabill_clients.client_credit_limit, 0) + COALESCE(last_balance.ctrxn_lbalance, 0)
END AS remaining_credit
`), this.db.raw('last_balance.ctrxn_created_at as ctrxn_created_date'), 'trabill_users.user_full_name as created_by', 'trabill_clients.client_source', 'trabill_employees.employee_full_name as contacted_person', 
            // Additional fields from original query that may be needed
            this.db.raw('COALESCE(client_invoice_totals.client_total, 0) as client_invoice_total'), this.db.raw('COALESCE(client_payments.total_pay, 0) as client_total_payment'), this.db.raw('COALESCE(client_invoice_totals.client_total, 0) - COALESCE(client_payments.total_pay, 0) as client_prev_due'))
                .leftJoin('trabill_users', { user_id: 'client_created_by' })
                .leftJoin(lastTrxnBalanceSubquery, {
                'last_balance.ctrxn_cl_id': 'trabill_clients.client_id',
            })
                .leftJoin(clientInvoiceTotalsSubquery, {
                'client_invoice_totals.invoice_client_id': 'trabill_clients.client_id',
            })
                .leftJoin(clientPaymentsSubquery, {
                'client_payments.invclientpayment_client_id': 'trabill_clients.client_id',
            })
                .leftJoin('trabill_client_categories', {
                category_id: 'client_category_id',
            })
                .leftJoin('trabill_employees', { employee_id: 'client_contacted_person' })
                .leftJoin('trabill_agency_organization_information as org', {
                'org.org_id': 'client_org_agency',
            })
                .where('client_is_deleted', 0)
                .where('client_org_agency', agency_id)
                .orderBy('trabill_clients.client_id', 'desc');
            // 🔍 Apply search and employee filter
            return yield query;
        });
    }
    getSingleEntryPassport(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_passport_details')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ passport_org_agency: agency_id })
                .andWhere('passport_is_deleted', false);
        });
    }
    getSingleEntryAirports() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airports')
                .withSchema(this.SINGLE)
                .select('*')
                .where('airline_is_deleted', 0);
        });
    }
    /* invoice userId  */
    getSingleUserInvoice(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_users')
                .withSchema(this.SINGLE)
                .where('user_id', userId)
                .select('user_username')
                .first();
        });
    }
    /* invoice userId  */
    getSingleEntryEmployeeCardId(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .select('te.employee_card_id')
                .where('client_id', clientId)
                .andWhere('client_org_agency', 76)
                .leftJoin('trabill_employees as te', 'te.employee_id', 'trabill_clients.client_contacted_person')
                .first();
        });
    }
    getDoubleEntryCarEmployeeId(card_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_employees')
                .withSchema('trabill_double_entry')
                .select('trabill_employees.employee_id')
                .where('trabill_employees.employee_card_id', card_id)
                .andWhere('employee_org_agency', 154)
                .first();
        });
    }
    getSingleEntryAirlines() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airlines')
                .withSchema(this.SINGLE)
                .select('*')
                .where('airline_is_deleted', 0);
        });
    }
    getReissuedInvoice(airticket_ticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db
                .withSchema('trabill_double_entry')
                .select('airticket_invoice_id', 'airticket_id', 'airticket_airline_id')
                .from('trabill_invoice_airticket_items')
                .where('airticket_ticket_no', airticket_ticket_no)
                .union(function () {
                this.select('airticket_invoice_id', 'airticket_id', 'airticket_airline_id')
                    .from('trabill_invoice_noncom_airticket_items')
                    .where('airticket_ticket_no', airticket_ticket_no);
            })
                .first();
            return yield query;
        });
    }
    getExistingDoubleEntryAirportIataCodes(airline_iata_code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_airports').withSchema(this.DOUBLE);
        });
    }
    getSingleEntryClientUserName(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .select('tu.user_username')
                .where('trabill_clients.client_id', clientId)
                .andWhere('client_org_agency', 76)
                .leftJoin('trabill_users as tu', 'tu.user_id', 'trabill_clients.client_created_by')
                .first();
        });
    }
    getDoubleEntryUserId(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_users')
                .withSchema('trabill_double_entry')
                .select('trabill_users.user_id')
                .where('trabill_users.user_username', username)
                .andWhere('user_agency_id', 154)
                .first();
        });
    }
    // Inside your agentDashboardModel
    // async getExistingDoubleEntryAirportIataCodes(): Promise<
    //   { airline_iata_code: string }[]
    // > {
    //   // Replace with your actual database query logic
    //   const query = 'SELECT airline_iata_code FROM double_entry_airports_table';
    //   const result = await this.db.query(query); // Assuming 'this.db' is your database connection
    //   return result.rows;
    // }
    getDoubleEntryPassport(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_passports')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ passport_org_agency: agency_id })
                .andWhere('passport_is_deleted', false);
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
            return yield this.db
                .with('vendor_balance', (qb) => {
                qb.select('vtrxn_v_id', this.db.raw(`
          SUM(
            CASE 
              WHEN vtrxn_type = 'DEBIT' THEN vtrxn_amount 
              ELSE -vtrxn_amount 
            END
          ) AS vendor_lbalance
        `))
                    .from('trxn.vendor_trxn')
                    .where('vtrxn_is_deleted', 0)
                    .andWhere('vtrxn_agency_id', agency_id)
                    .groupBy('vtrxn_v_id');
            })
                .select([
                'view_all_vendors.*',
                this.db.raw('COALESCE(vb.vendor_lbalance, 0) AS vendor_lbalance'),
            ])
                .from('view_all_vendors')
                .leftJoin('vendor_balance AS vb', 'vb.vtrxn_v_id', 'view_all_vendors.vendor_id')
                .where('vendor_org_agency', agency_id);
        });
    }
    getSingleEntryVendorInfo(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vendors = yield this.db('view_vendor_and_combined as se')
                .withSchema(this.SINGLE)
                .select('de.vendor_id', 'de.vendor_type', 'de.vendor_type', 'de.vendor_name')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_vendors as de 
       ON de.vendor_name = se.vendor_name`)
                .where('se.vendor_id', vendor_id)
                .first();
            return vendors;
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
    getSingleEntryUsers(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_users')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ user_agency_id: agency_id })
                .andWhere('user_is_deleted', false);
        });
    }
    // public async getSingleEntryEmployeeInfo(employee_id: Number) {
    //   return await this.db('trabill_employees')
    //     .withSchema(this.SINGLE)
    //     .select('employee_full_name')
    //     .where({ employee_id: employee_id })
    //     .andWhere('employee_is_deleted', false)
    //     .first();
    // }
    getSingleEntryEmployeeInfo(employee_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('trabill_employees as se')
                .withSchema(this.SINGLE)
                .select('de.employee_full_name', 'de.employee_card_id', 'de.employee_id')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_employees as de 
       ON de.employee_card_id = se.employee_card_id`)
                .where('se.employee_id', employee_id)
                .andWhere('se.employee_is_deleted', false)
                .first();
            if (!employee)
                return null;
            return {
                employee_full_name: employee.employee_full_name,
                employee_card_id: employee.employee_card_id,
                doubleEmployeeId: (_a = employee.double_employee_id) !== null && _a !== void 0 ? _a : null,
            };
        });
    }
    getSingleUserInfo(user_id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.db('trabill_users as se')
                .withSchema(this.SINGLE)
                .select('de.user_username', 'de.user_id')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_users as de 
       ON de.user_username = se.user_username`)
                .where('se.user_id', user_id)
                .first();
            if (!employee)
                return null;
            return {
                employee_full_name: employee.employee_full_name,
                employee_card_id: employee.employee_card_id,
                doubleEmployeeId: (_a = employee.double_employee_id) !== null && _a !== void 0 ? _a : null,
            };
        });
    }
    getSingleClientInfo(client_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.db('trabill_clients as sc')
                .withSchema(this.SINGLE)
                .select('dc.client_name', 'dc.client_code', 'dc.client_id')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_clients as dc 
       ON dc.client_code = sc.client_entry_id`)
                .where('sc.client_id', client_id)
                .first();
            if (!client)
                return null;
            return {
                clientConn: client.client_name,
                clientCode: client.client_entry_id,
                doubleClientId: client.client_id,
            };
        });
    }
    // public async getSingleClientInfo(client_id: number) {
    //   const client = await this.db
    //     .from({ sc: `${this.SINGLE}.trabill_clients` }) // single schema
    //     .leftJoin(
    //       { dc: `${this.DOUBLE}.trabill_clients` }, // double_entry schema
    //       'sc.employee_card_id',
    //       'dc.employee_card_id'
    //     )
    //     .select(
    //       'sc.client_name',
    //       'sc.client_entry_id',
    //       'dc.client_id as double_client_id'
    //     )
    //     .where('sc.client_id', client_id)
    //     .first();
    //   if (!client) return null;
    //   return {
    //     clientConn: client.client_name,
    //     clientCode: client.client_entry_id,
    //     doubleClientId: client.double_client_id,
    //   };
    // }
    getAirlineInfo(airline_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const airline = yield this.db('trabill_airlines')
                .withSchema(this.SINGLE)
                .select('airline_name', 'airline_code')
                .where({ airline_id: airline_id })
                .first();
            return airline === null || airline === void 0 ? void 0 : airline.airline_name;
        });
    }
    getAirlineInfoAndId(airline_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const airline = yield this.db('trabill_airlines as sa')
                .withSchema(this.SINGLE)
                .select('da.airline_id', 'da.airline_name', 'da.airline_code')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_airlines as da 
       ON da.airline_name = sa.airline_name 
       OR da.airline_code = sa.airline_code`)
                .where('sa.airline_id', airline_id)
                .first();
            if (!airline || !airline.airline_id) {
                const defaultAirline = yield this.db('trabill_airlines')
                    .withSchema(this.DOUBLE)
                    .select('airline_id', 'airline_name', 'airline_code')
                    .first();
                return {
                    airlineConn: (defaultAirline === null || defaultAirline === void 0 ? void 0 : defaultAirline.airline_name) || 'OTHERS',
                    doubleAirlineId: (defaultAirline === null || defaultAirline === void 0 ? void 0 : defaultAirline.airline_id) || null,
                };
            }
            return {
                airlineConn: airline.airline_name,
                doubleAirlineId: airline.airline_id,
            };
        });
    }
    getEmployeeInfoAndId(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleEmployee = yield this.db('trabill_employees')
                .withSchema(this.SINGLE)
                .select('employee_card_id', 'employee_full_name')
                .where('employee_id', employee_id)
                .first();
            if (!singleEmployee) {
                throw new Error('Employee not found in single schema');
            }
            const doubleEmployee = yield this.db('trabill_employees')
                .withSchema(this.DOUBLE)
                .select('employee_id', 'employee_full_name', 'employee_card_id')
                .where('employee_card_id', singleEmployee.employee_card_id)
                .andWhere('employee_org_agency', 154) // agency condition
                .first();
            if (!doubleEmployee) {
                const defaultEmployee = yield this.db('trabill_employees')
                    .withSchema(this.DOUBLE)
                    .select('employee_id', 'employee_full_name', 'employee_card_id')
                    .where('employee_org_agency', 154) // agency condition
                    .andWhere(function () {
                    this.where('employee_card_id', '!=', '').orWhereNotNull('employee_card_id');
                })
                    .first();
                return {
                    employeeConn: (defaultEmployee === null || defaultEmployee === void 0 ? void 0 : defaultEmployee.employee_full_name) || 'DEFAULT_EMPLOYEE',
                    doubleEmployeeId: (defaultEmployee === null || defaultEmployee === void 0 ? void 0 : defaultEmployee.employee_id) || null,
                    employeeCardId: (defaultEmployee === null || defaultEmployee === void 0 ? void 0 : defaultEmployee.employee_card_id) || null,
                };
            }
            return {
                employeeConn: doubleEmployee.employee_full_name,
                doubleEmployeeId: doubleEmployee.employee_id,
                employeeCardId: doubleEmployee.employee_card_id,
            };
        });
    }
    getVendorInfo(vendor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('first', vendor_id);
            const vendor = yield this.db('view_vendor_and_combined')
                .withSchema(this.SINGLE)
                .select('vendor_name', 'comb_vendor', 'vproduct_commission_rate')
                .where({ vendor_id: vendor_id }) // Ensure this column exists
                .first();
            if (!vendor)
                return null;
            // Format the return string as "VendorName [CommissionRate%]"
            return {
                vendor: `${vendor.vendor_name} [${vendor.vproduct_commission_rate}%]`,
                vendor_name: `${vendor.vendor_name}`,
            };
        });
    }
    getUserInfoAndId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleUser = yield this.db('trabill_users')
                .withSchema(this.SINGLE)
                .select('user_username', 'user_full_name')
                .where('user_id', user_id)
                .first();
            if (!singleUser) {
                throw new Error('User not found in single schema');
            }
            const doubleUser = yield this.db('trabill_users')
                .withSchema(this.DOUBLE)
                .select('user_id', 'user_full_name', 'user_username')
                .where('user_username', singleUser.user_username)
                .andWhere('user_agency_id', 154) // agency condition
                .first();
            if (!doubleUser) {
                const defaultUser = yield this.db('trabill_users')
                    .withSchema(this.DOUBLE)
                    .select('user_id', 'user_full_name', 'user_username')
                    .where('user_agency_id', 154) // agency condition
                    .andWhere(function () {
                    this.where('user_username', '!=', '').orWhereNotNull('user_username');
                })
                    .first();
                return {
                    userConn: (defaultUser === null || defaultUser === void 0 ? void 0 : defaultUser.user_first_name) || 'DEFAULT_USER',
                    doubleUserId: (defaultUser === null || defaultUser === void 0 ? void 0 : defaultUser.user_id) || null,
                    userUsername: (defaultUser === null || defaultUser === void 0 ? void 0 : defaultUser.user_username) || null,
                };
            }
            return {
                userConn: doubleUser.user_full_name,
                doubleUserId: doubleUser.user_id,
                userUsername: doubleUser.user_username,
            };
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
            return yield this.db2('trabill_vendors')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ vendor_org_agency: agency_id })
                .andWhere('vendor_is_deleted', false);
        });
    }
    getDoubleEntryUsers(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_users')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ user_agency_id: agency_id })
                .andWhere('user_is_deleted', false);
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
    columnSinglePassport() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_passport_details')
                .withSchema(this.SINGLE)
                .columnInfo();
        });
    }
    columnDoublePassport() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_passport_details')
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
    columnSingleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_users').withSchema(this.SINGLE).columnInfo();
        });
    }
    columnDoubleUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('trabill_users').withSchema(this.DOUBLE).columnInfo();
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
            const [client_id] = yield this.db2('trabill_clients')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
            return client_id; // return the inserted client_id
        });
    }
    insertDoubleEntryPassport(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_passports')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    insertDoubleEntryAirports(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.length)
                return;
            return yield this.db2('trabill_airports')
                .withSchema('trabill_double_entry')
                .insert(data);
        });
    }
    insertDoubleEntryAirlines(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data || !data.length)
                return;
            return yield this.db('trabill_airlines')
                .withSchema('trabill_double_entry')
                .insert(data);
        });
    }
    // inside your model
    insertDoubleEntryVendor(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const [vendor_id] = yield this.db2('trabill_vendors')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
            return vendor_id;
        });
    }
    insertDoubleEntryEmployee(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_employees')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    insertDoubleEntryUsers(transformedClient) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_users')
                .withSchema(this.DOUBLE)
                .insert(transformedClient);
        });
    }
    // invoice latest points
    // public async singleEntryInvoices() {
    //   return await this.db('trabill_invoices')
    //     .withSchema(this.SINGLE)
    //     .select('*')
    //     .where({
    //       invoice_org_agency: 76,
    //       invoice_category_id: 1,
    //       invoice_is_cancel: 0,
    //       invoice_is_deleted: 0,
    //       invoice_is_void: 0,
    //       invoice_is_refund: 0,
    //     });
    //   // .where({
    //   //   invoice_org_agency: 76,
    //   //   invoice_category_id: 1,
    //   //   invoice_is_cancel: 0,
    //   //   invoice_is_deleted: 0,
    //   //   // invoice_is_void: 1,
    //   //   invoice_is_refund: 1,
    //   // });
    //   // .where({
    //   //   invoice_org_agency: 76,
    //   //   invoice_category_id: 1,
    //   //   invoice_is_cancel: 0,
    //   //   invoice_is_deleted: 0,
    //   //   invoice_is_void: 1,
    //   //   invoice_is_refund: 1,
    //   // });
    //   // .where({
    //   //   invoice_org_agency: 76,
    //   //   invoice_category_id: 1,
    //   //   invoice_is_cancel: 0,
    //   //   invoice_is_deleted: 0,
    //   //   invoice_is_void: 1,
    //   // });
    // }
    // public async singleEntryInvoices() {
    //   return await this.db('trabill_invoices')
    //     .withSchema(this.SINGLE)
    //     .select('*')
    //     .where({
    //       invoice_org_agency: 76,
    //       invoice_category_id: 1,
    //       invoice_is_cancel: 0,
    //       invoice_is_deleted: 0,
    //     })
    //     .andWhere(function () {
    //       this.where({
    //         invoice_is_void: 0,
    //         invoice_is_refund: 0,
    //         invoice_is_reissued: 1,
    //       })
    //         .orWhere({
    //           invoice_is_void: 1,
    //           invoice_is_refund: 0,
    //           invoice_is_reissued: 1,
    //         })
    //         .orWhere({
    //           invoice_is_void: 0,
    //           invoice_is_refund: 1,
    //           invoice_is_reissued: 1,
    //         })
    //         .orWhere({
    //           invoice_is_void: 1,
    //           invoice_is_refund: 1,
    //           invoice_is_reissued: 1,
    //         });
    //     });
    // }
    singleEntryInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
                .withSchema(this.SINGLE)
                .select('*')
                .where({
                invoice_org_agency: 76,
                invoice_category_id: 1,
            })
                .andWhere('invoice_is_deleted', 0);
        });
    }
    // public async singleEntryInvoices() {
    //   const startDate = '2023-10-17 19:27:22';
    //   const endDate = '2024-12-31 23:59:59';
    //   return await this.db('trabill_invoices')
    //     .withSchema(this.SINGLE)
    //     .select('*')
    //     .where({
    //       invoice_org_agency: 76,
    //       invoice_category_id: 1,
    //       invoice_is_cancel: 0,
    //       invoice_is_deleted: 0,
    //       invoice_is_void: 0,
    //     })
    //     .whereBetween('invoice_create_date', [startDate, endDate])
    //     .orderBy('invoice_id', 'desc');
    // }
    // public async singleEntryInvoices() {
    //   // const startDate = '2025-06-01 00:00:00';
    //   // const endDate = '2025-12-31 23:59:59';
    //   return await this.db('trabill_invoices')
    //     .withSchema(this.SINGLE)
    //     .select('*')
    //     .where({
    //       invoice_org_agency: 76,
    //       invoice_category_id: 1,
    //       invoice_is_cancel: 0,
    //       invoice_is_deleted: 0,
    //       invoice_is_refund: 1,
    //       invoice_is_void: 0,
    //     });
    //   // .whereBetween('invoice_create_date', [startDate, endDate])
    //   // .orderBy('invoice_id', 'desc');
    // }
    // public async singleEntryInvoices() {
    //   // 🎯 Updated to cover April 1, 2025, to September 30, 2025
    //   const startDate = '2025-0-01 00:00:00';
    //   const endDate = '2025-08-31 23:59:59';
    //   return await this.db('trabill_invoices')
    //     .withSchema(this.SINGLE)
    //     .select('*')
    //     .where({
    //       invoice_org_agency: 76,
    //       invoice_category_id: 1,
    //       invoice_is_cancel: 0,
    //       invoice_is_deleted: 0,
    //       invoice_is_void: 0,
    //     })
    //     .whereBetween('invoice_create_date', [startDate, endDate]) // 📅 Filter applied here
    //     .orderBy('invoice_id', 'desc');
    // }
    singleEntryInvoicesReissueNew() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
                .withSchema(this.SINGLE)
                .select('*')
                .where({
                invoice_org_agency: 76,
                invoice_is_deleted: 0,
                invoice_is_reissued: 1,
                invoice_is_refund: 0,
                invoice_category_id: 1,
            })
                .andWhere('invoice_category_id', '!=', 3);
        });
    }
    singleFlight(airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items_flight_details')
                .withSchema(this.SINGLE)
                .select('*')
                .where('fltdetails_airticket_id', airticket_id)
                .andWhereNot('fltdetails_is_deleted', 1);
        });
    }
    singleFlightNonCom(airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_noncom_airticket_items_flight_details')
                .withSchema(this.SINGLE)
                .select('*')
                .where('fltdetails_airticket_id', airticket_id)
                .andWhereNot('fltdetails_is_deleted', 1);
        });
    }
    singleTax(airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_airline_commission')
                .withSchema(this.SINGLE)
                .select('*')
                .where('airline_airticket_id', airticket_id)
                .andWhereNot('is_deleted', 1);
        });
    }
    //  const pax_passport = await this.query()
    //       .select(
    //         'p_passport_id as passport_id',
    //         'p_passport_name as passport_name',
    //         'p_passport_type as passport_person_type',
    //         'p_mobile_no AS passport_mobile_no',
    //         'p_email AS passport_email'
    //       )
    //       .from('trabill_invoice_airticket_pax')
    //       .where('p_invoice_id', invoiceId)
    //       .andWhere('p_airticket_id', airticket_id)
    //       .andWhereNot('p_is_deleted', 1);
    singlePassport(invoiceId, airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_pax')
                .withSchema(this.SINGLE)
                .select('*')
                .where('p_invoice_id', invoiceId)
                .andWhere('p_airticket_id', airticket_id)
                .andWhereNot('p_is_deleted', 1)
                .first();
        });
    }
    getSingleAirport(airport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('trabill_airports')
                .withSchema(this.SINGLE)
                .select('*')
                .where('airline_id', airport_id)
                .first();
            return data.airline_airport;
        });
    }
    getAirportInfo(airport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // single-entry airport data নিচ্ছে
            const airport = yield this.db('trabill_airports as sa')
                .withSchema(this.SINGLE)
                .select('da.airline_id as double_airport_id', 'da.airline_airport as double_airport_name', 'da.airline_country_id as double_country_id', 'da.airline_iata_code as double_iata')
                .joinRaw(`LEFT JOIN ${this.DOUBLE}.trabill_airports as da
       ON da.airline_iata_code = sa.airline_iata_code
       OR da.airline_airport = sa.airline_airport`)
                .where('sa.airline_id', airport_id)
                .first();
            // fallback system (যদি match না মেলে)
            if (!airport || !airport.double_airport_id) {
                const defaultAirport = yield this.db('trabill_airports')
                    .withSchema(this.DOUBLE)
                    .select('airline_id as double_airport_id', 'airline_airport as double_airport_name', 'airline_country_id as double_country_id', 'airline_iata_code as double_iata')
                    .first();
                return {
                    airportConn: (defaultAirport === null || defaultAirport === void 0 ? void 0 : defaultAirport.double_airport_name) || 'UNKNOWN',
                    doubleAirportId: (defaultAirport === null || defaultAirport === void 0 ? void 0 : defaultAirport.double_airport_id) || null,
                    airportCountryId: (defaultAirport === null || defaultAirport === void 0 ? void 0 : defaultAirport.double_country_id) || null,
                    iataCode: (defaultAirport === null || defaultAirport === void 0 ? void 0 : defaultAirport.double_iata) || null,
                };
            }
            // match পাওয়া গেছে
            return {
                airportConn: airport.double_airport_name,
                doubleAirportId: airport.double_airport_id,
                airportCountryId: airport.double_country_id,
                iataCode: airport.double_iata,
            };
        });
    }
    singleEntryInvoicesRefund() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoices')
                .withSchema(this.SINGLE)
                .select('*')
                .where({
                invoice_org_agency: 76,
                invoice_category_id: 1,
                invoice_is_refund: 1,
                invoice_is_deleted: 0,
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
            const data = yield this.db('trabill_invoices')
                .withSchema(this.SINGLE)
                .select('*')
                .where({
                invoice_org_agency: 76,
                invoice_category_id: 1,
                invoice_is_reissued: 1,
                invoice_is_deleted: 0,
            });
            const total = yield this.db('trabill_invoices')
                .withSchema(this.SINGLE)
                .count('* as count')
                .where({
                invoice_org_agency: 76,
                invoice_category_id: 1,
                invoice_is_reissued: 1,
                invoice_is_deleted: 0,
            })
                .first()
                .then((result) => result.count);
            return {
                data,
                total,
            };
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
    singleEntryInvoicesAirTicketItemsProp(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items as tiai')
                .withSchema(this.SINGLE)
                .select([
                'tiai.*',
                'tiar.airoute_airticket_id',
                'tiar.airoute_invoice_id',
                this.db.raw('GROUP_CONCAT(tap.airline_iata_code SEPARATOR " - ") as airticket_routes'),
            ])
                .leftJoin({ tiar: 'trabill_invoice_airticket_routes' }, (join) => {
                join
                    .on('tiar.airoute_airticket_id', '=', 'tiai.airticket_id')
                    .andOnVal('tiar.airoute_is_deleted', '=', 0);
            })
                .leftJoin('trabill_airports as tap', 'tap.airline_id', 'tiar.airoute_route_sector_id')
                .where('tiai.airticket_org_agency', 76)
                .andWhere('tiai.airticket_invoice_id', invoice_id)
                .andWhere('tiai.airticket_is_deleted', 0)
                .groupBy([
                'tiar.airoute_invoice_id',
                'tiar.airoute_airticket_id',
                'tiai.airticket_id',
                'tiai.airticket_ticket_type',
                'tiai.airticket_sales_date',
            ]);
        });
    }
    singleEntryInvoicesAirTicketItemsV4(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items as tiai')
                .withSchema(this.SINGLE)
                .select([
                'tiai.*',
                'tiar.airoute_airticket_id',
                'tiar.airoute_invoice_id',
                this.db.raw('GROUP_CONCAT(tap.airline_iata_code SEPARATOR " - ") as airticket_routes'),
            ])
                .leftJoin('trabill_invoice_airticket_routes as tiar', 'tiar.airoute_airticket_id', 'tiai.airticket_id')
                .leftJoin('trabill_airports as tap', 'tap.airline_id', 'tiar.airoute_route_sector_id')
                .where('tiai.airticket_org_agency', 76)
                .andWhere('tiai.airticket_invoice_id', invoice_id)
                .andWhere('tiai.airticket_is_deleted', 0)
                .andWhere(function () {
                this.where('tiar.airoute_is_deleted', 0).orWhereNull('tiar.airoute_is_deleted');
            })
                .groupBy([
                'tiar.airoute_invoice_id',
                'tiar.airoute_airticket_id',
                'tiai.airticket_id',
                'tiai.airticket_ticket_type',
                'tiai.airticket_sales_date',
            ]);
        });
    }
    singleEntryInvoicesAirTicketItems(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items as tiai')
                .withSchema(this.SINGLE)
                .select([
                'tiai.*',
                'tiar.airoute_airticket_id',
                'tiar.airoute_invoice_id',
                this.db.raw('GROUP_CONCAT(tap.airline_iata_code SEPARATOR " - ") as airticket_routes'),
            ])
                .leftJoin('trabill_invoice_airticket_routes as tiar', 'tiar.airoute_airticket_id', 'tiai.airticket_id')
                .leftJoin('trabill_airports as tap', 'tap.airline_id', 'tiar.airoute_route_sector_id')
                .where('tiai.airticket_org_agency', 76)
                .andWhere('tiai.airticket_invoice_id', invoice_id)
                .andWhere('tiai.airticket_is_deleted', 0)
                // .andWhere('tiar.airoute_is_deleted', 0)
                .groupBy([
                'tiar.airoute_invoice_id',
                'tiar.airoute_airticket_id',
                'tiai.airticket_id',
                'tiai.airticket_ticket_type',
                'tiai.airticket_sales_date',
            ]);
        });
    }
    singleEntryInvoicesAirTicketItemsPro(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items as tiai')
                .withSchema(this.SINGLE)
                .select('*')
                .where('tiai.airticket_org_agency', 76)
                .andWhere('tiai.airticket_invoice_id', invoice_id)
                .andWhere('tiai.airticket_is_deleted', 0);
        });
    }
    singleEntryInvoicesAirTicketItemsWithReissued(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_airticket_items as tiai')
                .withSchema(this.SINGLE)
                .select([
                'tiai.*',
                'tiar.airoute_airticket_id',
                'tiar.airoute_invoice_id',
                this.db.raw('GROUP_CONCAT(tap.airline_iata_code SEPARATOR " - ") as airticket_routes'),
            ])
                .leftJoin('trabill_invoice_airticket_routes as tiar', 'tiar.airoute_airticket_id', 'tiai.airticket_id')
                .leftJoin('trabill_airports as tap', 'tap.airline_id', 'tiar.airoute_route_sector_id')
                .where('tiai.airticket_org_agency', 76)
                .andWhere('tiai.airticket_invoice_id', invoice_id)
                .andWhere('tiai.airticket_is_reissued', 1)
                .andWhere('tiar.airoute_is_deleted', '!=', 1)
                .groupBy([
                'tiar.airoute_invoice_id',
                'tiar.airoute_airticket_id',
                'tiai.airticket_id',
                'tiai.airticket_ticket_type',
                'tiai.airticket_sales_date',
            ]);
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
            const [airticket_id] = yield this.db2('trabill_invoice_airticket_items').insert(payload);
            return airticket_id;
        });
    }
    insertAirTicketReissueItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('trabill_invoice_reissue_airticket_items').insert(payload);
            return id;
        });
    }
    insertCheque(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('cheques').insert(data);
            return id;
        });
    }
    // public async refreshDatabase() {
    //   ami akhane jevabe kaaj kori
    //   await this.db2('table's name').where('organizations', 154).delete();
    //     await this.db2('table's name').insert(payload);
    //     tumi ki ai sequence use kore kaaj ta korte parbe ai function er vitore!
    //   // await this.db2('acc_voucher').where('org_id', 154).delete();
    //   // await this.db2('trabill_invoice_airticket_items')
    //   //   .where('airticket_org_agency', 154)
    //   //   .delete();
    //   // await this.db2('trabill_invoice_noncom_airticket_items')
    //   //   .where('airticket_org_agency', 154)
    //   //   .delete();
    //   // await this.db2('vendor_trxn').where('vtrxn_agency_id', 154).delete();
    //   // await this.db2('client_trxn').where('ctrxn_agency_id', 154).delete();
    //   // const ids = await this.db2('trabill_refunds')
    //   //   .where('org_agency', 154)
    //   //   .pluck('id');
    //   // // Loop through the IDs and delete the corresponding records
    //   // for (const id of ids) {
    //   //   await this.db2('trabill_refund_items').where('refund_id', id).delete();
    //   // }
    //   // await this.db2('trabill_refunds').where('org_agency', 154).delete();
    //   // // Delete records from trabill_invoices based on invoice_org_agency
    //   // return await this.db2('trabill_invoices')
    //   //   .where('invoice_org_agency', 154)
    //   //   .delete();
    //   /* specially for money reciept */
    //   await this.db2('acc_voucher')
    //     .where('org_id', 154)
    //     .andWhere('payment_type', 'RECEIPT')
    //     .delete();
    //   const ids = await this.db2('trabill_receipts')
    //     .where('receipt_org_agency', 154)
    //     .pluck('receipt_id');
    //   // Loop through the IDs and delete the corresponding records
    //   for (const id of ids) {
    //     await this.db2('trabill_receipt_items').where('receipt_id', id).delete();
    //   }
    //   await this.db2('trabill_receipts')
    //     .where('receipt_org_agency', 154)
    //     .delete();
    // }
    resetDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Receipt items and receipts
            const receiptIds = yield this.db2('trabill_receipts')
                .where('receipt_org_agency', 154)
                .pluck('receipt_id');
            // // Delete receipt items first
            for (const id of receiptIds) {
                yield this.db2('trabill_receipt_items').where('receipt_id', id).delete();
            }
            // // Then delete the receipts
            yield this.db2('trabill_receipts')
                .where('receipt_org_agency', 154)
                .delete();
            // await this.db2('airticket_void').where('org_id', 154).delete();
            // // 2. Refund items and refunds
            const refundIds = yield this.db2('trabill_refunds')
                .where('org_agency', 154)
                .pluck('id');
            // // Delete refund items first
            for (const id of refundIds) {
                yield this.db2('trabill_refund_items').where('refund_id', id).delete();
            }
            // // Then delete refunds
            yield this.db2('trabill_refunds').where('org_agency', 154).delete();
            // // 3. Payment items and payments
            // const paymentIds = await this.db2('trabill_payments')
            //   .where('agency_id', 154)
            //   .pluck('payment_id');
            // // Delete payment items first
            // for (const id of paymentIds) {
            //   await this.db2('trabill_payment_items').where('payment_id', id).delete();
            // }
            const invoiceIds = yield this.db2('trabill_invoices')
                .where('invoice_org_agency', 154)
                .pluck('invoice_id');
            yield this.db2('trabill_invoice_airticket_flights')
                .whereIn('fltdetails_invoice_id', invoiceIds)
                .delete();
            // Then delete payments
            yield this.db2('trabill_payments').where('agency_id', 154).delete();
            // 4. Delete other tables in the correct sequence
            yield this.db2('acc_voucher').where('org_id', 154).delete();
            yield this.db2('trabill_invoice_airticket_items')
                .where('airticket_org_agency', 154)
                .delete();
            yield this.db2('trabill_invoice_noncom_airticket_items')
                .where('airticket_org_agency', 154)
                .delete();
            yield this.db2('trabill_invoice_reissue_airticket_items')
                .where('airticket_org_agency', 154)
                .delete();
            yield this.db2('client_trxn').where('ctrxn_agency_id', 154).delete();
            yield this.db2('vendor_trxn').where('vtrxn_agency_id', 154).delete();
            yield this.db2('trabill_accounts')
                .where('account_org_agency', 154)
                .delete();
            yield this.db2('acc_head').where('head_agency_id', 154).delete();
            yield this.db2('trabill_invoices')
                .where('invoice_org_agency', 154)
                .delete();
            yield this.db2('trabill_clients').where('client_org_agency', 154).delete();
            yield this.db2('trabill_vendors').where('vendor_org_agency', 154).delete();
            // await this.db2('trabill_passports')
            //   .where('passport_org_agency', 154)
            //   .delete();
            // await this.db2('trabill_airports').delete();
            // await this.db2('trabill_airlines').delete();
            yield this.db2('trabill_employees')
                .where('employee_org_agency', 154)
                .delete();
            yield this.db2('trabill_users')
                .where('user_agency_id', 154)
                .whereNot('user_id', 1666)
                .delete();
            //void delete
            // Special case for money receipt as shown in your example
            // await this.db2('acc_voucher')
            //   .where('org_id', 154)
            //   .andWhere('payment_type', 'RECEIPT')
            //   .delete();
            return true; // Return something to indicate completion
        });
    }
    resetAirTicketVoid() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const voidRows = yield trx('airticket_void')
                    .where('org_id', 154)
                    .select('*');
                for (const row of voidRows) {
                    // Delete Client Transactions
                    const clientTransIDs = [
                        row.client_trans_id,
                        row.client_charge_trans_id,
                    ].filter(Boolean);
                    if (clientTransIDs.length > 0) {
                        yield trx('client_trxn').whereIn('ctrxn_id', clientTransIDs).delete();
                    }
                    // Delete Vendor Transactions
                    if (row.vendor_trans_id) {
                        yield trx('vendor_trxn')
                            .where('vtrxn_id', row.vendor_trans_id)
                            .delete();
                    }
                    // Delete Vouchers
                    const voucherIds = [
                        row.client_voucher1,
                        row.client_voucher2,
                        row.vendor_voucher1,
                        row.vendor_voucher2,
                        row.service_vou_1,
                        row.service_vou_2,
                    ].filter(Boolean);
                    if (voucherIds.length > 0) {
                        yield trx('acc_voucher').whereIn('id', voucherIds).delete();
                    }
                }
                // Finally delete from airticket_void table
                yield trx('airticket_void').where('org_id', 154).delete();
            }));
            return { message: '✅ All Void data reset successfully for org_id 154!' };
        });
    }
    resetReceipt() {
        return __awaiter(this, void 0, void 0, function* () {
            const orgId = 154;
            // Step 1: Get all receipts with required voucher & trxns
            const receipts = yield this.db2('trabill_receipts')
                .select('receipt_id', 'receipt_discount_voucher1', 'receipt_discount_voucher2', 'receipt_cl_trxn_id')
                .where('receipt_org_agency', orgId);
            // Step 2: Loop through receipts and delete linked vouchers & trxn
            for (const r of receipts) {
                const { receipt_id, receipt_discount_voucher1, receipt_discount_voucher2, receipt_cl_trxn_id, } = r;
                // Delete Discount Vouchers
                if (receipt_discount_voucher1) {
                    yield this.db2('acc_voucher')
                        .where('org_id', orgId)
                        .andWhere('id', receipt_discount_voucher1)
                        .delete();
                }
                if (receipt_discount_voucher2) {
                    yield this.db2('acc_voucher')
                        .where('org_id', orgId)
                        .andWhere('id', receipt_discount_voucher2)
                        .delete();
                }
                // Delete Client Ledger Transaction
                if (receipt_cl_trxn_id) {
                    yield this.db2('client_trxn')
                        .where('ctrxn_id', receipt_cl_trxn_id)
                        .delete();
                }
                // Delete receipt items
                yield this.db2('trabill_receipt_items')
                    .where('receipt_id', receipt_id)
                    .delete();
            }
            // Step 3: Finally, delete receipts
            yield this.db2('trabill_receipts')
                .where('receipt_org_agency', orgId)
                .delete();
            return {
                message: 'All receipt-related data deleted successfully from DB2',
            };
        });
    }
    deleteRefunds({ orgId, refundId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const refundIds = refundId
                ? [refundId]
                : (yield this.db2('trabill_refunds')
                    .select('id')
                    .where('org_agency', orgId)).map((r) => r.id);
            for (const rId of refundIds) {
                // Step 1: Fetch refund items
                const items = yield this.db2('trabill_refund_items').where('refund_id', rId);
                const voucherIds = [];
                const clientTxnIds = [];
                const vendorTxnIds = [];
                for (const item of items) {
                    voucherIds.push(item.sale_return_vou1, item.sale_return_vou2, item.purchase_return_vou1, item.purchase_return_vou2, item.penalty_vou_1, item.penalty_vou_2, item.extra_fee_vou_1, item.extra_fee_vou_2);
                    clientTxnIds.push(item.clTransId, item.cl_extra_fee_trans_id);
                    vendorTxnIds.push(item.vendorTransId, item.v_penalty_trans_id);
                    // ✅ Rule 1: Reset airticket_is_refund = 0 depending on invoice category
                    const invoiceData = yield this.db2('trabill_invoices')
                        .select('invoice_category_id')
                        .where('invoice_id', item.invoice_id)
                        .first();
                    if (invoiceData) {
                        if (invoiceData.invoice_category_id === 1) {
                            yield this.db2('trabill_invoice_airticket_items')
                                .where('airticket_id', item.airticket_id)
                                .update({ airticket_is_refund: 0 });
                        }
                        else if (invoiceData.invoice_category_id === 2) {
                            yield this.db2('trabill_invoice_noncom_airticket_items')
                                .where('airticket_id', item.airticket_id)
                                .update({ airticket_is_refund: 0 });
                        }
                    }
                }
                // Step 2: Delete all related vouchers
                if (voucherIds.length)
                    yield this.db2('acc_voucher')
                        .whereIn('id', voucherIds.filter(Boolean))
                        .delete();
                // Step 3: Delete client transactions
                if (clientTxnIds.length)
                    yield this.db2('client_trxn')
                        .whereIn('ctrxn_id', clientTxnIds.filter(Boolean))
                        .delete();
                // Step 4: Delete vendor transactions
                if (vendorTxnIds.length)
                    yield this.db2('vendor_trxn')
                        .whereIn('vtrxn_id', vendorTxnIds.filter(Boolean))
                        .delete();
                // Step 5: Delete refund items
                yield this.db2('trabill_refund_items').where('refund_id', rId).delete();
                // Step 6: Delete refund master
                yield this.db2('trabill_refunds').where('id', rId).delete();
            }
            return {
                message: refundId
                    ? `Refund #${refundId} and related data deleted successfully`
                    : `All refunds deleted successfully for org_id ${orgId}`,
            };
        });
    }
    resetNonDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceIds = yield this.db2('trabill_invoices')
                .where('invoice_org_agency', 154)
                .andWhere('invoice_category_id', 2)
                .pluck('invoice_id');
            yield this.db2('trabill_invoice_airticket_flights')
                .whereIn('fltdetails_invoice_id', invoiceIds)
                .delete();
            yield this.db2('trabill_invoice_noncom_airticket_items')
                .where('airticket_org_agency', 154)
                .delete();
            yield this.db2('trabill_invoices')
                .where('invoice_org_agency', 154)
                .andWhere('invoice_category_id', 2)
                .delete();
            return true; // Return something to indicate completion
        });
    }
    resetRefunds() {
        return __awaiter(this, void 0, void 0, function* () {
            // 2. Refund items and refunds
            const refundIds = yield this.db2('trabill_refunds')
                .where('org_agency', 154)
                .pluck('id');
            // Delete refund items first
            for (const id of refundIds) {
                yield this.db2('trabill_refund_items').where('refund_id', id).delete();
            }
            // Then delete refunds
            yield this.db2('trabill_refunds').where('org_agency', 154).delete();
            return true; // Return something to indicate completion
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
    getClientNameSingle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cli = yield this.db('trabill_clients')
                .withSchema(this.SINGLE)
                .select('client_name')
                .where('client_id', id)
                .first();
            return cli.client_name;
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
    getVendorInfoByNo(invoiceNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('view_all_airticket_details')
                .select('*')
                .where('airticket_ticket_no', invoiceNo)
                // .leftJoin(
                //   'trabill_vendors as tv',
                //   'tv.vendor_id',
                //   'view_all_airticket_details.airticket_vendor_id'
                // )
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
                .andWhere('ti.invoice_is_deleted', false);
            // .andWhere('atrefund_invoice_id', 69625);
        });
    }
    //get single entry refunds
    getAllRefundsByAll(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airticket_refunds')
                .withSchema(this.SINGLE)
                .select('*')
                .leftJoin('trabill_invoices as ti', 'ti.invoice_id', '=', 'trabill_airticket_refunds.atrefund_invoice_id')
                .where({ atrefund_org_agency: agency_id })
                .andWhere('atrefund_is_deleted', false);
        });
    }
    //get single entry refunds
    getSingleEntryRefundNonCom(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_airticket_refunds')
                .withSchema(this.SINGLE)
                .select('*')
                .leftJoin('trabill_invoices as ti', 'ti.invoice_id', '=', 'trabill_airticket_refunds.atrefund_invoice_id')
                .where({ atrefund_org_agency: agency_id })
                .andWhere('atrefund_is_deleted', false)
                .andWhere('ti.invoice_category_id', 2);
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
    getTicketInfoByTicketNumberDouble(ticketNo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('v_air_ticket_details')
                .withSchema(this.DOUBLE)
                .select('*')
                .where('airticket_org_agency', 154)
                .andWhere('airticket_ticket_no', ticketNo)
                .first();
        });
    }
    getTicketInfoByTicketNumber(airTicketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_combined_airticket_items')
                .withSchema(this.SINGLE)
                .select('airticket_id', 'airticket_ticket_no', 'airticket_purchase_price', 'airticket_sales_date', 'airticket_issue_date', 'airticket_client_id')
                .where('airticket_org_agency', 154)
                .andWhere('airticket_ticket_no', airTicketId)
                .first();
        });
    }
    getSingleEntryAirticketInfo(airticketNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_combined_airticket_items')
                .withSchema(this.SINGLE)
                .select('airticket_id', 'airticket_ticket_no', 'airticket_purchase_price', 'airticket_client_price', 'airticket_sales_date', 'airticket_issue_date', 'airticket_client_id')
                .where('airticket_org_agency', 76)
                .andWhere('airticket_ticket_no', airticketNumber)
                .first();
        });
    }
    getSingleEntryReissueAirticket(airticketNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_air_ticket_details')
                .withSchema(this.SINGLE)
                .select('airticket_id', 'airticket_ticket_no', 'airticket_purchase_price', 'airticket_client_price', 'airticket_sales_date', 'airticket_issue_date', 'airticket_client_id')
                .where('airticket_org_agency', 76)
                .andWhere('airticket_ticket_no', airticketNumber)
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
    getAllAirTicketBased(airticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_air_ticket_details')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ airticket_ticket_no: airticket_no })
                .first();
        });
    }
    getAllAirTicketBasedWithVoid(airticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('v_air_ticket_details')
                .withSchema(this.DOUBLE)
                .select('*')
                .where({ airticket_ticket_no: airticket_no })
                .first();
        });
    }
    //accounts
    getSingleEntryAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_accounts')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ account_org_agency: 76 })
                .andWhere('account_is_deleted', 0);
        });
    }
    //voids
    getAllVoidsTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('view_all_airticket_details')
                .withSchema(this.SINGLE)
                .select('*')
                .where({ airticket_org_agency: 76 })
                .andWhere({ airticket_is_void: 1 })
                .orderBy('airticket_id', 'desc');
        });
    }
    airTicketIdWiseInfo(airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('view_all_airticket_details')
                .withSchema(this.SINGLE)
                .select('airticket_vendor_id', 'airticket_client_id', 'airticket_ticket_no')
                .where('airticket_id', airticket_id)
                .first();
        });
    }
    airticketIdWiseInvoice(airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('view_all_airticket_details as vad')
                .withSchema(this.SINGLE)
                .select('vad.airticket_invoice_id', 'ti.invoice_void_charge')
                .leftJoin('trabill_invoices as ti', 'ti.invoice_id', 'vad.airticket_invoice_id')
                .where('vad.airticket_id', airticket_id)
                .first();
        });
    }
    getDoubleEntryAirTicket(airticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('v_air_tickets_info as vad')
                .withSchema(this.DOUBLE)
                .select('*')
                .where('airticket_ticket_no', airticket_no)
                .first();
        });
    }
    getDoubleEntryAirTicketPremium(airticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('airticket_overall_view_with_void as vad')
                .withSchema(this.DOUBLE)
                .select('*')
                .where('airticket_ticket_no', airticket_no)
                .first();
        });
    }
    getDoubleEntryAirTicketBussiness(airticket_no) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db2('airticket_overall_view_with_void as vad')
                .withSchema(this.DOUBLE)
                .select('*')
                .where('airticket_ticket_no', airticket_no)
                .first();
        });
    }
    airTicketVoid(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db2('airticket_void')
                .withSchema(this.DOUBLE)
                .insert(payload);
            return id;
        });
    }
    updateAirTicketItemStatus(airticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db2('trabill_invoice_airticket_items')
                .withSchema(this.DOUBLE)
                .update('airticket_is_void', 1)
                .where('airticket_id', airticketId);
        });
    }
}
exports.default = AgentDashboardModel;
