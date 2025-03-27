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
class CommonService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //add inquiry
    moveClients(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            const getSingleEntryClient = yield model.getSingleEntryClient(76);
            const getDoubleEntryClient = yield model.getDoubleEntryClient(154);
            const columnSingleInfo = yield model.columnSingle();
            const columnDoubleInfo = yield model.columnDouble();
            const columnSingle = Object.keys(columnSingleInfo);
            const columnDouble = Object.keys(columnDoubleInfo);
            const commonColumns = columnSingle.filter((column) => columnDouble.includes(column));
            const newColumn = 'client_code';
            commonColumns.push(newColumn);
            console.log({ commonColumns });
            for (const client of getSingleEntryClient) {
                const transformedClient = {};
                for (const column of commonColumns) {
                    transformedClient[column] = client[column];
                    if (column === 'client_org_agency') {
                        transformedClient[column] = 154;
                    }
                    if (column === 'client_code') {
                        transformedClient['client_code'] = client['client_entry_id'];
                    }
                    if (column === 'client_created_by') {
                        transformedClient[column] = 126;
                    }
                }
                yield model.insertDoubleEntry(transformedClient);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                // single: getSingleEntryClient,
                // double: getDoubleEntryClient,
            };
        });
    }
    moveVendors(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            const getSingleEntryVendor = yield model.getSingleEntryVendor(76);
            const getDoubleEntryClient = yield model.getDoubleEntryVendor(154);
            const columnSingleInfo = yield model.columnSingleVendor();
            const columnDoubleInfo = yield model.columnDoubleVendor();
            const columnSingle = Object.keys(columnSingleInfo);
            const columnDouble = Object.keys(columnDoubleInfo);
            const commonColumns = columnSingle.filter((column) => columnDouble.includes(column));
            console.log(commonColumns);
            // const newColumn = 'client_code';
            // commonColumns.push(newColumn);
            // console.log({ commonColumns });
            for (const client of getSingleEntryVendor) {
                const transformedClient = {};
                for (const column of commonColumns) {
                    transformedClient[column] = client[column];
                    if (column === 'vendor_org_agency') {
                        transformedClient[column] = 154;
                    }
                    // if (column === 'client_code') {
                    //   transformedClient['client_code'] = client['client_entry_id'];
                    // }
                    if (column === 'vendor_created_by') {
                        transformedClient[column] = 126;
                    }
                    if (column === 'vendor_updated_by') {
                        transformedClient[column] = null;
                    }
                }
                yield model.insertDoubleEntryVendor(transformedClient);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                // single: getSingleEntryClient,
                // double: getDoubleEntryClient,
            };
        });
    }
    moveEmployees(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            const getSingleEntryVendor = yield model.getSingleEntryEmployee(76);
            const getDoubleEntryClient = yield model.getDoubleEntryEmployee(154);
            const columnSingleInfo = yield model.columnSingleEmployee();
            const columnDoubleInfo = yield model.columnDoubleEmployee();
            const columnSingle = Object.keys(columnSingleInfo);
            const columnDouble = Object.keys(columnDoubleInfo);
            const commonColumns = columnSingle.filter((column) => columnDouble.includes(column));
            console.log(commonColumns);
            // const newColumn = 'client_code';
            // commonColumns.push(newColumn);
            // console.log({ commonColumns });
            for (const client of getSingleEntryVendor) {
                const transformedClient = {};
                for (const column of commonColumns) {
                    transformedClient[column] = client[column];
                    if (column === 'employee_org_agency') {
                        transformedClient[column] = 154;
                    }
                    // if (column === 'client_code') {
                    //   transformedClient['client_code'] = client['client_entry_id'];
                    // }
                    if (column === 'employee_created_by') {
                        transformedClient[column] = 126;
                    }
                    if (column === 'employee_updated_by') {
                        transformedClient[column] = null;
                    }
                    if (column === 'employee_designation_id') {
                        transformedClient[column] = null;
                    }
                    if (column === 'employee_department_id') {
                        transformedClient[column] = null;
                    }
                }
                yield model.insertDoubleEntryEmployee(transformedClient);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                // single: getSingleEntryClient,
                // double: getDoubleEntryClient,
            };
        });
    }
    moveAccounts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            const getSingleAccounts = yield model.getSingleEntryAccounts();
            const accHeads = {
                CASH: {
                    head_parent_id: 3,
                    head_code: '1001.002',
                    head_group_code: '1000',
                },
                BANK: {
                    head_parent_id: 5,
                    head_code: '1001.003',
                    head_group_code: '1000',
                },
                CHEQUE: { head_parent_id: 5, head_code: '', head_group_code: '' },
                MOBILE_BANKING: {
                    head_parent_id: 6,
                    head_code: '1001.004',
                    head_group_code: '1000',
                },
            };
            for (const account of getSingleAccounts) {
                // Determine account type
                const accountType = account.account_acctype_id === 1
                    ? 'CASH'
                    : account.account_acctype_id === 2
                        ? 'BANK'
                        : account.account_acctype_id === 3
                            ? 'MOBILE_BANKING'
                            : 'UNKNOWN';
                // Prepare account body
                const accountBody = {
                    account_type: accountType,
                    account_name: account.account_name,
                    account_opening_balance_type: 'SALES',
                    account_number: account.account_number,
                    account_bank_name: account.account_bank_name,
                    account_branch_name: account.account_branch_name,
                    account_routing_no: account.account_routing_no,
                    account_created_by: 1666,
                    account_org_agency: 154,
                };
                // Get account head mapping
                const accountHeadType = account.account_acctype_id === 1
                    ? 'CASH'
                    : account.account_acctype_id === 2
                        ? 'BANK'
                        : account.account_acctype_id === 3
                            ? 'MOBILE_BANKING'
                            : '';
                const { head_code, head_group_code, head_parent_id } = accHeads[accountHeadType];
                // Prepare head payload
                const headPayload = {
                    head_name: account.account_name,
                    head_parent_id,
                    head_code: '',
                    head_agency_id: 154,
                    head_created_by: 1666,
                    head_group_code,
                };
                // Generate head code
                const lastHead = yield model.getLastHeadCodeByParent(head_parent_id);
                headPayload.head_code = lastHead
                    ? (0, common_helper_1.generateNextGroupCode)(lastHead)
                    : `${head_code}.001`;
                // Insert head and get ID
                account.account_head_id = yield model.insertAccHead(headPayload);
                // Insert account
                const accountPayload = Object.assign(Object.assign({}, accountBody), { account_org_agency: 154 });
                const [account_id] = yield model.insertAccount(accountPayload);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    // Function to format the date
    invoices(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            // const items = await model.singleEntryInvoicesAirTicketItems();
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // const invoice_part = {
                //   invoice_combclient_id: `client-${data.invoice_client_id}`, // Use backticks for template literals
                //   // client_name: 'Kashi Bencho',
                //   // invoice_customer_name: 'Kashi Bencho',
                //   invoice_org_agency: 76,
                //   invoice_no: 'HelloWorld12354',
                //   invoice_sales_man_id: data.invoice_sales_man_id,
                //   invoice_sales_date: formatDate(data.invoice_sales_date), // Format the date
                //   invoice_sub_total: data.invoice_sub_total,
                //   invoice_agent_id: null,
                //   invoice_agent_commission: 0,
                //   invoice_show_passport_details: 0,
                //   invoice_show_prev_due: data.invoice_client_previous_due,
                //   invoice_show_unit: 1,
                //   invoice_show_discount: 1,
                //   invoice_note: data.invoice_note,
                //   tickets: [
                //     {
                //       // airticket_id: items[0].airticket_id,
                //       // airticket_invoice_id: items[0].airticket_invoice_id,
                //       airticket_org_agency: 154,
                //       airticket_ticket_type: items[0].airticket_ticket_type,
                //       airticket_classes: items[0].airticket_classes,
                //       airticket_ticket_no: items[0].airticket_ticket_no,
                //       airticket_emd_remarks: items[0].airticket_emd_remarks,
                //       airticket_gross_fare: items[0].airticket_gross_fare,
                //       airticket_base_fare: items[0].airticket_base_fare,
                //       airticket_comvendor: items[0]?.airticket_vendor_id
                //         ? `vendor-${items[0].airticket_vendor_id}`
                //         : items[0]?.airticket_vendor_combine_id
                //         ? `combine-${items[0].airticket_vendor_combine_id}`
                //         : items[0]?.airticket_comvendor,
                //       vendor_name: 'Shamim Al Mamon',
                //       airticket_airline_id: items[0].airticket_airline_id,
                //       airticket_commission_percent: items[0].airticket_commission_percent,
                //       airticket_discount_total: items[0].airticket_discount_total,
                //       airticket_extra_fee: items[0].airticket_extra_fee,
                //       airticket_pnr: items[0].airticket_pnr,
                //       airticket_bd_charge: items[0].airticket_bd_charge,
                //       airticket_es_charge: items[0].airticket_es_charge,
                //       airticket_ut_charge: items[0].airticket_ut_charge,
                //       airticket_xt_charge: items[0].airticket_xt_charge,
                //       airticket_e5_charge: items[0].airticket_e5_charge,
                //       airticket_g4_charge: items[0].airticket_g4_charge,
                //       airticket_ow_charge: items[0].airticket_ow_charge,
                //       airticket_p7_charge: items[0].airticket_p7_charge,
                //       airticket_p8_charge: items[0].airticket_p8_charge,
                //       airticket_pz_charge: items[0].airticket_pz_charge,
                //       airticket_qa_charge: items[0].airticket_qa_charge,
                //       airticket_r9_charge: items[0].airticket_r9_charge,
                //       airticket_gds_id: 1,
                //       airticket_segment: 0,
                //       airticket_journey_date: items[0].airticket_journey_date,
                //       airticket_return_date: items[0].airticket_return_date,
                //       passport_id: items[0].airticket_passport_id,
                //       passport_no: 'P0292292922',
                //       passport_name: 'MOHAMMAD SHAMIM AL MAMON',
                //       passport_person_type: 'Adult',
                //       passport_email: 'nazmul.m360ict@gmail.com',
                //       passport_mobile_no: '01888798798',
                //       passport_date_of_birth: '1975-07-03T18:00:00.000Z',
                //       passport_date_of_expire: '2031-11-01T00:00:00.000Z',
                //       airticket_route_or_sector: ['DAC', 'CXB', 'DAC'],
                //       taxes_commission: [
                //         {
                //           airline_commission: 18,
                //           airline_taxes: 250,
                //           airline_tax_type: 'YQ',
                //         },
                //         {
                //           airline_commission: 4,
                //           airline_tax_type: 'YR',
                //           airline_taxes: 50,
                //         },
                //       ],
                //       flight_details: [
                //         {
                //           fltdetails_from_airport_id: 358,
                //           fltdetails_to_airport_id: 394,
                //           fltdetails_airline_id: 109,
                //           fltdetails_flight_no: 713,
                //           fltdetails_fly_date: '2024-10-23',
                //           fltdetails_departure_time: '14:38:41',
                //           fltdetails_arrival_time: '14:38:43',
                //         },
                //       ],
                //     },
                //   ],
                // };
                const data = yield model.singleEntryInvoices();
                const invoices = [];
                for (const itemData of data) {
                    const ticketItems = yield model.singleEntryInvoicesAirTicketItems(itemData.invoice_id);
                    const invoice_part = {
                        invoice_combclient_id: `client-${itemData.invoice_client_id}`,
                        invoice_org_agency: 76,
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
                            airticket_ticket_type: ticket.airticket_ticket_type || null,
                            airticket_classes: ticket.airticket_classes,
                            airticket_ticket_no: ticket.airticket_ticket_no,
                            airticket_emd_remarks: ticket.airticket_emd_remarks,
                            airticket_gross_fare: ticket.airticket_gross_fare,
                            airticket_base_fare: ticket.airticket_base_fare,
                            airticket_comvendor: (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_id)
                                ? `vendor-${ticket.airticket_vendor_id}`
                                : (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_combine_id)
                                    ? `combine-${ticket.airticket_vendor_combine_id}`
                                    : ticket === null || ticket === void 0 ? void 0 : ticket.airticket_comvendor,
                            // vendor_name: 'Shamim Al Mamon',
                            airticket_airline_id: ticket.airticket_airline_id,
                            airticket_commission_percent: ticket.airticket_commission_percent,
                            airticket_discount_total: ticket.airticket_discount_total,
                            airticket_extra_fee: ticket.airticket_extra_fee,
                            airticket_pnr: ticket.airticket_pnr,
                            airticket_bd_charge: ticket.airticket_bd_charge,
                            airticket_es_charge: ticket.airticket_es_charge,
                            airticket_ut_charge: ticket.airticket_ut_charge,
                            airticket_xt_charge: ticket.airticket_xt_charge,
                            airticket_e5_charge: ticket.airticket_e5_charge,
                            airticket_g4_charge: ticket.airticket_g4_charge,
                            airticket_ow_charge: ticket.airticket_ow_charge,
                            airticket_p7_charge: ticket.airticket_p7_charge,
                            airticket_p8_charge: ticket.airticket_p8_charge,
                            airticket_pz_charge: ticket.airticket_pz_charge,
                            airticket_qa_charge: ticket.airticket_qa_charge,
                            airticket_r9_charge: ticket.airticket_r9_charge,
                            airticket_gds_id: 1,
                            airticket_segment: 0,
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
                            airticket_route_or_sector: ['DAC', 'CXB', 'DAC'],
                            taxes_commission: [
                                {
                                    airline_commission: 18,
                                    airline_taxes: 250,
                                    airline_tax_type: 'YQ',
                                },
                                {
                                    airline_commission: 4,
                                    airline_tax_type: 'YR',
                                    airline_taxes: 50,
                                },
                            ],
                            flight_details: [
                                {
                                    fltdetails_from_airport_id: 358,
                                    fltdetails_to_airport_id: 394,
                                    fltdetails_airline_id: 109,
                                    fltdetails_flight_no: 713,
                                    fltdetails_fly_date: '2024-10-23',
                                    fltdetails_departure_time: '14:38:41',
                                    fltdetails_arrival_time: '14:38:43',
                                },
                            ],
                        })),
                    };
                    invoices.push(invoice_part);
                }
                for (const invoice of invoices) {
                    try {
                        const { invoicePayload, ticketsFormat, client_name } = yield (0, airticketutils_1.airTicketPayloadFormatter)(invoice, '');
                        const invoiceModel = this.Model.agentDashboardModel(trx);
                        const invoiceId = yield invoiceModel.insertInvoicesInfo(invoicePayload);
                        for (const ticket of ticketsFormat) {
                            const { airTicketDetails, flightDetails, passportDetails, clTransPayload, VTransPayload, taxes_commission, vendor_name, } = ticket;
                            const { airticket_id, airticket_is_deleted } = airTicketDetails, restAirTicket = __rest(airTicketDetails, ["airticket_id", "airticket_is_deleted"]);
                            const ac_sale_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'DEBIT',
                                description: `Ticket sale to ${client_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_sale_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Sales)'],
                                voucher_no: `Sales-${invoiceId}`,
                                amount: restAirTicket.airticket_client_price,
                                trans_type: 'CREDIT',
                                description: `Ticket sale to ${client_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou1 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 1,
                                acc_head_id: this.accHead['Air Ticket(Purchase)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'DEBIT',
                                description: `Purchase ticket from ${vendor_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const ac_pur_vou2 = yield invoiceModel.insertAccVoucherDb({
                                serial_no: 2,
                                acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
                                voucher_no: `Purchase-${invoiceId}`,
                                amount: restAirTicket.airticket_purchase_price,
                                trans_type: 'CREDIT',
                                description: `Purchase ticket from ${vendor_name} on account`,
                                payment_type: 'INVOICE',
                            });
                            const clTrans = yield invoiceModel.insertClientTrans(Object.assign(Object.assign({}, clTransPayload), { ctrxn_voucher: `ClientTrans-${invoiceId}`, ctrxn_created_date: invoicePayload.invoice_sales_date, ctrxn_ref_id: invoiceId }));
                            const vTrans = yield invoiceModel.insertVendorTrans(Object.assign(Object.assign({}, VTransPayload), { vtrxn_voucher: `VendorTrans-${invoiceId}`, vtrxn_ref_id: invoiceId }));
                            const airTicketItemPayload = Object.assign(Object.assign({}, restAirTicket), { airticket_cl_com_trans_id: clTrans.clComTransId, airticket_cl_trans_id: clTrans.clTransId, airticket_invoice_id: invoiceId, airticket_org_agency: 154, airticket_v_com_trans_id: vTrans.vendorComTransId, airticket_v_trans_id: vTrans.vendorTransId, airticket_ac_sale_vou1: ac_sale_vou1, airticket_ac_sale_vou2: ac_sale_vou2, airticket_ac_pur_vou1: ac_pur_vou1, airticket_ac_pur_vou2: ac_pur_vou2 });
                            const airTicketId = yield invoiceModel.insertAirTicketItem(airTicketItemPayload);
                            if (passportDetails && (passportDetails === null || passportDetails === void 0 ? void 0 : passportDetails.p_passport_no)) {
                                yield invoiceModel.insertAirTicketPax(Object.assign(Object.assign({}, passportDetails), { p_airticket_id: airTicketId, p_invoice_id: invoiceId }));
                            }
                            if (flightDetails && flightDetails[0].fltdetails_from_airport_id) {
                                const flightsDetails = flightDetails === null || flightDetails === void 0 ? void 0 : flightDetails.map((item) => {
                                    return Object.assign(Object.assign({}, item), { fltdetails_airticket_id: airTicketId, fltdetails_invoice_id: invoiceId });
                                });
                                yield invoiceModel.insertAirTicketFlights(flightsDetails);
                            }
                            if (taxes_commission && ((_a = taxes_commission[0]) === null || _a === void 0 ? void 0 : _a.airline_tax_type)) {
                                const taxesCommission = taxes_commission === null || taxes_commission === void 0 ? void 0 : taxes_commission.map((item) => {
                                    return Object.assign(Object.assign({}, item), { airline_airticket_id: airTicketId, airline_invoice_id: invoiceId });
                                });
                                yield invoiceModel.insertAirTicketCommission(taxesCommission);
                            }
                        }
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
    testInvoices(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel();
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
                        airticket_emd_remarks: ticket.airticket_emd_remarks,
                        airticket_gross_fare: ticket.airticket_gross_fare,
                        airticket_base_fare: ticket.airticket_base_fare,
                        airticket_comvendor: (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_id)
                            ? `vendor-${ticket.airticket_vendor_id}`
                            : (ticket === null || ticket === void 0 ? void 0 : ticket.airticket_vendor_combine_id)
                                ? `combine-${ticket.airticket_vendor_combine_id}`
                                : ticket === null || ticket === void 0 ? void 0 : ticket.airticket_comvendor,
                        vendor_name: 'Shamim Al Mamon',
                        airticket_airline_id: ticket.airticket_airline_id,
                        airticket_commission_percent: ticket.airticket_commission_percent,
                        airticket_discount_total: ticket.airticket_discount_total,
                        airticket_extra_fee: ticket.airticket_extra_fee,
                        airticket_pnr: ticket.airticket_pnr,
                        airticket_bd_charge: ticket.airticket_bd_charge,
                        airticket_es_charge: ticket.airticket_es_charge,
                        airticket_ut_charge: ticket.airticket_ut_charge,
                        airticket_xt_charge: ticket.airticket_xt_charge,
                        airticket_e5_charge: ticket.airticket_e5_charge,
                        airticket_g4_charge: ticket.airticket_g4_charge,
                        airticket_ow_charge: ticket.airticket_ow_charge,
                        airticket_p7_charge: ticket.airticket_p7_charge,
                        airticket_p8_charge: ticket.airticket_p8_charge,
                        airticket_pz_charge: ticket.airticket_pz_charge,
                        airticket_qa_charge: ticket.airticket_qa_charge,
                        airticket_r9_charge: ticket.airticket_r9_charge,
                        airticket_gds_id: 1,
                        airticket_segment: 0,
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
                        const { invoicePayload, ticketsFormat, client_name } = yield (0, airticketutils_1.airTicketPayloadFormatter)(invoice, '');
                        const invoice_no = yield this.generateVoucher(req, 'AIT');
                        const invoiceModel = this.Model.agentDashboardModel(trx);
                        const invoiceId = yield invoiceModel.insertInvoicesInfo(Object.assign(Object.assign({}, invoicePayload), { invoice_org_agency: 154, invoice_created_by: 1666, invoice_no: invoice_no }));
                        const clientNameGet = yield invoiceModel.getClientName(Number(invoicePayload.invoice_client_id));
                        for (const ticket of ticketsFormat) {
                            const { airTicketDetails, flightDetails, passportDetails, clTransPayload, VTransPayload, taxes_commission, vendor_name, } = ticket;
                            const { airticket_id, airticket_is_deleted } = airTicketDetails, restAirTicket = __rest(airTicketDetails, ["airticket_id", "airticket_is_deleted"]);
                            const vendorNameGet = yield invoiceModel.getVendorName(Number(ticket.airTicketDetails.airticket_vendor_id));
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
                            const airTicketItemPayload = Object.assign(Object.assign({}, restAirTicket), { airticket_cl_com_trans_id: clTrans.clComTransId, airticket_cl_trans_id: clTrans.clTransId, airticket_invoice_id: invoiceId, airticket_org_agency: 154, airticket_v_com_trans_id: vTrans.vendorComTransId, airticket_v_trans_id: vTrans.vendorTransId, airticket_ac_sale_vou1: ac_sale_vou1, airticket_ac_sale_vou2: ac_sale_vou2, airticket_ac_pur_vou1: ac_pur_vou1, airticket_ac_pur_vou2: ac_pur_vou2 });
                            yield invoiceModel.insertAirTicketItem(airTicketItemPayload);
                        }
                        yield this.updateVoucher(req, 'AIT');
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
    refundTest(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel(); // Get the property model
            // Function to get refunds with their associated items
            function getRefundsWithItems() {
                return __awaiter(this, void 0, void 0, function* () {
                    // Get the refunds
                    const refunds = yield model.getSingleEntryRefund(76);
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
                for (const refunds of refundsData) {
                    const conn = this.Model.agentDashboardModel();
                    console.log('refunds thats called', refunds);
                    let com_client = '';
                    if (refunds.atrefund_client_id) {
                        com_client = 'client' + '-' + refunds.atrefund_client_id;
                    }
                    else {
                        com_client = 'combined' + '-' + refunds.atrefund_combined_id;
                    }
                    const voucher_no = yield this.generateVoucher(req, 'ARF');
                    const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_client);
                    let sales_price = 0;
                    let purchase_price = 0;
                    let total_penalties = 0;
                    let client_extra_fee = 0;
                    const refundItems = [];
                    const { refund_by, refund_date, refund_note, client_name, items } = req.body;
                    for (const item of refunds.refund_items) {
                        const { vendor_name } = item, restItem = __rest(item, ["vendor_name"]);
                        console.log('item thats called', item);
                        const airTicketInfo = yield conn.getTicketInfoByTicketNumber(item.airticket_ticket_no);
                        sales_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0);
                        purchase_price += Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0);
                        total_penalties += Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                        client_extra_fee += Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                        const client_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price) || 0) -
                            Number((item === null || item === void 0 ? void 0 : item.penalties) || 0) -
                            Number((item === null || item === void 0 ? void 0 : item.client_extra_fee) || 0);
                        const vendor_refund = Number((airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_purchase_price) || 0) -
                            Number((item === null || item === void 0 ? void 0 : item.penalties) || 0);
                        //acc voucher start
                        /////SALE
                        // SALE RETURN VOUCHERS
                        // Add this helper function at the beginning of your file
                        function getValidAmount(value) {
                            // Convert to number and check if it's valid
                            const num = Number(value);
                            return !isNaN(num) && isFinite(num) ? num : 0;
                        }
                        // Update all your voucher insertions
                        // SALE RETURN VOUCHERS
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
                        // PURCHASE RETURN VOUCHERS
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
                        // PENALTY VOUCHERS
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
                        // EXTRA FEES VOUCHERS
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
                        //acc voucher end
                        // VENDOR AND CLIENT TRANSACTION
                        const clientTrans = {
                            client_id,
                            combined_id,
                            ctrxn_amount: +(airTicketInfo === null || airTicketInfo === void 0 ? void 0 : airTicketInfo.airticket_client_price),
                            ctrxn_created_at: refund_date,
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
                            vtrxn_created_at: refund_date,
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
                            ctrxn_created_at: refund_date,
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
                            vtrxn_created_at: refund_date,
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
                    console.log('sikanadar', refunds);
                    const refundPayload = {
                        com_client: refunds.atrefund_client_id
                            ? `client-${refunds.atrefund_client_id}`
                            : `combined-${refunds.atrefund_combined_id}`,
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
                    // REFUND ITEMS
                    const refundsItems = [];
                    for (const item of refundItems) {
                        const { clientTrans, vendorTrans, clientTransExtraFee, vendorTransPenalty, refundItem, } = item;
                        const clientTransPayload = Object.assign(Object.assign({}, clientTrans), { ctrxn_ref_id: refund_id });
                        const clTrxId = yield conn.insertClientTrans(clientTransPayload);
                        console.log('theClientTrans', { clTrxId });
                        const vendorTransPayload = Object.assign(Object.assign({}, vendorTrans), { vtrxn_ref_id: refund_id });
                        const vTrxId = yield conn.insertVendorTrans(vendorTransPayload);
                        console.log('theVendorTrans', { vTrxId });
                        const clientTransExtraPayload = Object.assign(Object.assign({}, clientTransExtraFee), { ctrxn_ref_id: refund_id });
                        const clExTrxId = yield conn.insertClientTrans(clientTransExtraPayload);
                        console.log('theClientclExTrxIdTrans', { clExTrxId });
                        const vendorTransPenaltyPayload = Object.assign(Object.assign({}, vendorTransPenalty), { vtrxn_ref_id: refund_id });
                        const vPenTrxId = yield conn.insertVendorTrans(vendorTransPenaltyPayload);
                        console.log('vendorTransPenaltyPayload', { vPenTrxId });
                        console.log('tututut', refundItem);
                        // refundsItems.push({
                        //   refund_id,
                        //   ...refundItem,
                        //   ...clTrxId,
                        //   ...clExTrxId,
                        //   ...vPenTrxId,
                        //   ...vTrxId,
                        // });
                        refundsItems.push({
                            refund_id,
                            airticket_id: refundItem.vrefund_airticket_id,
                            penalties: refundItem.vrefund_charge_amount,
                            invoice_id: refunds.atrefund_invoice_id,
                            sale_return_vou1: isNaN(Number(refundItem.sale_return_vou1))
                                ? null
                                : Number(refundItem.sale_return_vou1),
                            sale_return_vou2: isNaN(Number(refundItem.sale_return_vou2))
                                ? null
                                : Number(refundItem.sale_return_vou2),
                            purchase_return_vou1: isNaN(Number(refundItem.purchase_return_vou1))
                                ? null
                                : Number(refundItem.purchase_return_vou1),
                            purchase_return_vou2: isNaN(Number(refundItem.purchase_return_vou2))
                                ? null
                                : Number(refundItem.purchase_return_vou2),
                            penalty_vou_1: isNaN(Number(refundItem.penalty_vou_1))
                                ? null
                                : Number(refundItem.penalty_vou_1),
                            penalty_vou_2: isNaN(Number(refundItem.penalty_vou_2))
                                ? null
                                : Number(refundItem.penalty_vou_2),
                            extra_fee_vou_1: isNaN(Number(refundItem.extra_fee_vou_1))
                                ? null
                                : Number(refundItem.extra_fee_vou_1),
                            extra_fee_vou_2: isNaN(Number(refundItem.extra_fee_vou_2))
                                ? null
                                : Number(refundItem.extra_fee_vou_2),
                            v_penalty_trans_id: isNaN(Number(vPenTrxId.vendorTransId))
                                ? null
                                : Number(vPenTrxId.vendorTransId),
                            cl_extra_fee_trans_id: isNaN(Number(clExTrxId.clTransId))
                                ? null
                                : Number(clExTrxId.clTransId),
                            clTransId: isNaN(Number(clTrxId.clTransId))
                                ? null
                                : Number(clTrxId.clTransId),
                            clComTransId: isNaN(Number(clTrxId.clComTransId))
                                ? null
                                : Number(clTrxId.clComTransId),
                            vendorTransId: isNaN(Number(vTrxId.vendorTransId))
                                ? null
                                : Number(vTrxId.vendorTransId),
                            vendorComTransId: isNaN(Number(vTrxId.vendorComTransId))
                                ? null
                                : Number(vTrxId.vendorComTransId),
                        });
                        console.log('Properly System To Downgrade It', refundItems);
                    }
                    yield conn.insertRefundItems(refundsItems);
                    yield this.updateVoucher(req, 'ARF');
                }
                return {
                    success: true,
                    message: 'REFUND-AIR TICKET',
                    code: this.StatusCode.HTTP_OK,
                };
            }));
        });
    }
    // public async refundsTest(req: Request) {}
    refreshDatabase(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.agentDashboardModel();
            yield model.refreshDatabase();
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: '',
            };
        });
    }
}
exports.default = CommonService;
