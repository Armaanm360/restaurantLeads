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
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceReissueFormatter = exports.airTicketNonCommissionPayloadFormatter = exports.airTicketPayloadFormatter = void 0;
const common_helper_1 = require("../helpers/common.helper");
const commonTypes_1 = require("../helpers/commonTypes");
const commonTypes_2 = require("./commonTypes");
const airTicketPayloadFormatter = (body, //IAirTicketBody
conn, invoice_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { invoice_agent_commission, invoice_combclient_id, invoice_sales_date, invoice_sales_man_id, invoice_customer_name, invoice_show_discount, invoice_show_passport_details, invoice_show_prev_due, invoice_show_unit, invoice_note, invoice_agent_id, invoice_due_date, client_name, tickets, invoice_no, } = body;
    const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
    let invoice_sub_total = 0;
    let invoice_discount = 0;
    let invoice_service_charge = 0;
    let invoice_net_total = 0;
    let invoice_purchase_total = 0;
    const ticketsFormat = [];
    for (const item of tickets) {
        // const isExist = await conn.checkTicket(
        //   item.airticket_ticket_no,
        //   invoice_id
        // );
        // if (isExist.length) {
        //   throw new CustomError(
        //     `The ticket number "${item.airticket_ticket_no}" already exists in the system. Please verify and try again.`,
        //     400
        //     // 'Duplicate Ticket Number'
        //   );
        // }
        const { combined_id: airticket_vendor_combine_id, vendor_id: airticket_vendor_id, } = (0, common_helper_1.separateCombClientToId)(item.airticket_comvendor);
        const tkt_commission = item.airticket_base_fare * (item.airticket_commission_percent / 100);
        const taxesCommission = (_a = item.taxes_commission) === null || _a === void 0 ? void 0 : _a.reduce((acc, curr) => acc + Number(curr.airline_commission), 0);
        let totalCountryTax = (0, commonTypes_2.numRound)(item.airticket_bd_charge) +
            (0, commonTypes_2.numRound)(item.airticket_ut_charge) +
            (0, commonTypes_2.numRound)(item.airticket_e5_charge);
        const countryTaxAit = totalCountryTax * 0.003;
        const airticket_ait = item.airticket_gross_fare * 0.003 + countryTaxAit;
        const airticket_net_commission = (0, commonTypes_2.numRound)(tkt_commission) - airticket_ait + (taxesCommission || 0);
        const airticket_purchase_price = (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_gross_fare) - (0, commonTypes_2.numRound)(airticket_net_commission);
        const airticket_client_price = (0, commonTypes_2.numRound)(item.airticket_extra_fee) + // Extra fee
            (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_vat) + // VAT
            (item.airticket_gross_fare - (0, commonTypes_2.numRound)(item.airticket_discount_total)); // Gross fare minus discount
        // ----
        invoice_sub_total += (0, commonTypes_2.numRound)(item.airticket_gross_fare);
        invoice_discount += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_discount_total);
        invoice_service_charge += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_extra_fee);
        invoice_net_total += airticket_client_price;
        invoice_purchase_total += (0, commonTypes_2.numRound)(airticket_purchase_price);
        const airTicketDetails = {
            airticket_id: item.airticket_id,
            airticket_is_deleted: item.airticket_is_deleted,
            airticket_client_id: item.airticket_client_id,
            airticket_combined_id: item.airticket_combined_id,
            airticket_vendor_id,
            airticket_vendor_combine_id,
            airticket_remarks: item.airticket_remarks,
            airticket_airline_id: item.airticket_airline_id,
            airticket_ticket_no: item.airticket_ticket_no,
            airticket_pnr: item.airticket_pnr,
            airticket_classes: item.airticket_classes,
            airticket_gross_fare: item.airticket_gross_fare,
            airticket_base_fare: item.airticket_base_fare,
            airticket_commission_percent: item.airticket_commission_percent,
            airticket_commission_amount: (0, commonTypes_2.numRound)(tkt_commission),
            airticket_ait,
            airticket_total_taxes_commission: taxesCommission || 0,
            airticket_discount_total: item.airticket_discount_total,
            airticket_net_commission,
            airticket_tax: item.airticket_gross_fare - item.airticket_base_fare,
            airticket_extra_fee: item.airticket_extra_fee,
            airticket_client_price,
            airticket_purchase_price: (0, commonTypes_2.numRound)(airticket_purchase_price),
            airticket_profit: (0, commonTypes_2.numRound)(airticket_net_commission),
            airticket_pax_name: item.passport_name,
            airticket_gds: item.airticket_gds,
            airticket_segment: item.airticket_segment,
            airticket_bd_charge: item.airticket_bd_charge,
            airticket_xt_charge: item.airticket_xt_charge,
            airticket_ut_charge: item.airticket_ut_charge,
            airticket_es_charge: item.airticket_es_charge,
            airticket_ow_charge: item.airticket_ow_charge,
            airticket_pz_charge: item.airticket_pz_charge,
            airticket_qa_charge: item.airticket_qa_charge,
            airticket_g4_charge: item.airticket_g4_charge,
            airticket_e5_charge: item.airticket_e5_charge,
            airticket_p7_charge: item.airticket_p7_charge,
            airticket_p8_charge: item.airticket_p8_charge,
            airticket_r9_charge: item.airticket_r9_charge,
            airticket_sales_date: invoice_sales_date,
            airticket_ticket_type: item.airticket_ticket_type,
            airticket_journey_date: item.airticket_journey_date,
            airticket_return_date: item.airticket_return_date,
            airticket_route_or_sector: (_b = item.airticket_route_or_sector) === null || _b === void 0 ? void 0 : _b.join(','),
            airticket_vat: item === null || item === void 0 ? void 0 : item.airticket_vat,
        };
        const clTransPayload = {
            ctrxn_amount: airticket_client_price,
            client_id: client_id,
            combined_id: combined_id,
            ctrxn_created_at: invoice_sales_date,
            ctrxn_note: (item === null || item === void 0 ? void 0 : item.airticket_remarks) || invoice_note,
            ctrxn_particular_id: 1,
            ctrxn_type: 'DEBIT',
            ctrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
            ctrxn_journey_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_journey_date,
            ctrxn_pax: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pax_name,
            ctrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            ctrxn_return_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_return_date,
            ctrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
        };
        const VTransPayload = {
            com_vendor: item.airticket_comvendor,
            vtrxn_amount: airticket_purchase_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: (item === null || item === void 0 ? void 0 : item.airticket_remarks) || invoice_note,
            vtrxn_particular_id: 1,
            // vtrxn_type: airTicketDetails?.airticket_vendor_combine_id
            //   ? 'CREDIT'
            //   : 'DEBIT',
            vtrxn_type: 'CREDIT',
            vtrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            vtrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
            vtrxn_pax: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pax_name,
            vtrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
        };
        const passportDetails = {
            p_passport_id: item.passport_id,
            p_passport_name: item.passport_name,
            p_passport_type: item.passport_person_type,
            p_email: item.passport_email,
            p_mobile_no: item.passport_mobile_no,
            p_passport_no: item.passport_no,
        };
        const ticketData = {
            airTicketDetails,
            passportDetails,
            flightDetails: item === null || item === void 0 ? void 0 : item.flight_details,
            clTransPayload,
            VTransPayload,
            comVendor: item.airticket_comvendor,
            taxes_commission: item.taxes_commission,
            vendor_name: item.vendor_name,
        };
        ticketsFormat.push(ticketData);
    }
    const invoicePayload = {
        invoice_category_id: commonTypes_1.invCategory['Air Ticket'],
        invoice_client_id: client_id,
        invoice_combined_id: combined_id,
        invoice_sub_total,
        invoice_discount,
        invoice_no: 'HElloow0famc',
        invoice_service_charge,
        invoice_net_total,
        invoice_purchase_total,
        invoice_total_profit: invoice_net_total - invoice_purchase_total,
        invoice_note,
        invoice_sales_date,
        invoice_sales_man_id,
        invoice_customer_name,
        invoice_agent_commission,
        invoice_agent_id,
        invoice_due_date,
        invoice_show_discount,
        invoice_show_passport_details,
        invoice_show_prev_due: 0,
        invoice_show_unit,
    };
    return {
        invoicePayload,
        ticketsFormat,
        comClient: invoice_combclient_id,
        client_name,
        invoice_no,
    };
});
exports.airTicketPayloadFormatter = airTicketPayloadFormatter;
const airTicketNonCommissionPayloadFormatter = (body) => {
    const { invoice_agent_commission, invoice_combclient_id, invoice_sales_date, invoice_sales_man_id, invoice_customer_name, invoice_show_discount, invoice_show_passport_details, invoice_show_prev_due, invoice_show_unit, invoice_note, invoice_due_date, client_name, invoice_agent_id, tickets, invoice_no, } = body;
    const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
    let invoice_sub_total = 0;
    let invoice_discount = 0;
    let invoice_service_charge = 0;
    let invoice_vat = 0;
    let invoice_net_total = 0;
    let invoice_purchase_total = 0;
    const ticketsFormat = tickets.map((item) => {
        var _a;
        const { combined_id: airticket_vendor_combine_id, vendor_id: airticket_vendor_id, } = (0, common_helper_1.separateCombClientToId)(item.airticket_comvendor);
        invoice_sub_total += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_gross_fare);
        invoice_discount += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_discount_total);
        invoice_service_charge += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_extra_fee);
        invoice_vat += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_vat);
        invoice_net_total += (0, commonTypes_2.numRound)(item === null || item === void 0 ? void 0 : item.airticket_client_price);
        invoice_purchase_total += (0, commonTypes_2.numRound)(item.airticket_purchase_price);
        const airTicketDetails = {
            airticket_id: item.airticket_id,
            airticket_is_deleted: item.airticket_is_deleted,
            airticket_client_id: client_id,
            airticket_combined_id: combined_id,
            airticket_vat: item.airticket_vat,
            airticket_vendor_id,
            airticket_vendor_combine_id,
            airticket_airline_id: item.airticket_airline_id,
            airticket_ticket_no: item.airticket_ticket_no,
            airticket_pnr: item.airticket_pnr,
            airticket_classes: item.airticket_classes,
            airticket_gross_fare: item.airticket_gross_fare,
            airticket_discount_total: item.airticket_discount_total,
            airticket_extra_fee: item.airticket_extra_fee,
            airticket_client_price: item.airticket_client_price,
            airticket_purchase_price: item.airticket_purchase_price,
            airticket_profit: (0, commonTypes_2.numRound)(Number(item.airticket_client_price)) -
                (0, commonTypes_2.numRound)(Number(item.airticket_purchase_price)),
            airticket_sales_date: invoice_sales_date,
            airticket_issue_date: item.airticket_issue_date,
            airticket_ticket_type: item.airticket_ticket_type,
            airticket_journey_date: item.airticket_journey_date,
            airticket_return_date: item.airticket_return_date,
            airticket_route_or_sector: (_a = item.airticket_route_or_sector) === null || _a === void 0 ? void 0 : _a.join(','),
            airticket_pax_name: item.passport_name,
        };
        const clTransPayload = {
            ctrxn_amount: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_client_price,
            client_id: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_client_id,
            combined_id: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_combined_id,
            ctrxn_created_at: invoice_sales_date,
            ctrxn_note: invoice_note,
            ctrxn_particular_id: commonTypes_2.transactionTypes['INVOICE-AIR TICKET NON COM'],
            ctrxn_type: 'DEBIT',
            ctrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
            ctrxn_journey_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_journey_date,
            ctrxn_pax: client_name,
            ctrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            ctrxn_return_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_return_date,
            ctrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
        };
        const VTransPayload = {
            com_vendor: item.airticket_comvendor,
            vtrxn_amount: Number(item.airticket_purchase_price),
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: invoice_note,
            vtrxn_particular_id: commonTypes_2.transactionTypes['INVOICE-AIR TICKET NON COM'],
            vtrxn_type: (airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_vendor_combine_id)
                ? 'CREDIT'
                : 'DEBIT',
            vtrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            vtrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
            vtrxn_pax: item === null || item === void 0 ? void 0 : item.vendor_name,
            vtrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
        };
        const passportDetails = {
            p_passport_id: item.passport_id,
            p_passport_name: item.passport_name,
            p_passport_type: item.passport_person_type,
            p_email: item.passport_email,
            p_mobile_no: item.passport_mobile_no,
            p_passport_no: item.passport_no,
        };
        return {
            airTicketDetails,
            passportDetails,
            flightDetails: item === null || item === void 0 ? void 0 : item.flight_details,
            clTransPayload,
            VTransPayload,
            comVendor: item.airticket_comvendor,
            vendor_name: item.vendor_name,
        };
    });
    const invoicePayload = {
        invoice_category_id: commonTypes_1.invCategory['Air Ticket-Non Commission'],
        invoice_client_id: client_id,
        invoice_combined_id: combined_id,
        invoice_sub_total,
        invoice_discount,
        invoice_service_charge,
        invoice_vat,
        invoice_agent_id,
        invoice_net_total,
        invoice_purchase_total,
        invoice_note,
        invoice_sales_date,
        invoice_sales_man_id,
        invoice_total_profit: invoice_sub_total - invoice_purchase_total,
        invoice_customer_name,
        invoice_agent_commission,
        invoice_due_date,
        invoice_show_discount,
        invoice_show_passport_details,
        invoice_show_prev_due,
        invoice_show_unit,
    };
    return {
        invoicePayload,
        ticketsFormat,
        comClient: invoice_combclient_id,
        client_name,
        invoice_no,
    };
};
exports.airTicketNonCommissionPayloadFormatter = airTicketNonCommissionPayloadFormatter;
const invoiceReissueFormatter = (body) => {
    const { invoice_agent_commission, invoice_combclient_id, invoice_sales_date, invoice_sales_man_id, invoice_note, client_name, invoice_agent_id, invoice_due_date, invoice_no, tickets, } = body;
    const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
    let invoice_sub_total = 0;
    let invoice_purchase_total = 0;
    let invoice_total_profit = 0;
    const ticketsFormat = tickets.map((item) => {
        var _a;
        const { combined_id: airticket_vendor_combine_id, vendor_id: airticket_vendor_id, } = (0, common_helper_1.separateCombClientToId)(item.airticket_comvendor);
        const tkt_commission = item.airticket_fare_difference *
            (item.airticket_commission_percent / 100);
        // ----
        invoice_sub_total += Number(item.airticket_client_price);
        invoice_purchase_total += (0, commonTypes_2.numRound)(item.airticket_purchase_price);
        invoice_total_profit += (0, commonTypes_2.numRound)(item.airticket_profit);
        const airTicketDetails = {
            airticket_id: item.airticket_id,
            airticket_is_deleted: item.isDeleted,
            airticket_existing_invoice: item.existing_invoiceid,
            airticket_existing_airticket_id: item.existing_airticket_id,
            airticket_client_id: client_id,
            airticket_combined_id: combined_id,
            airticket_vendor_id,
            airticket_vendor_combine_id,
            airticket_airline_id: item.airticket_airline_id,
            airticket_ticket_no: item.airticket_ticket_no,
            airticket_pnr: item.airticket_pnr,
            previous_ticket_no: item.previous_ticket_no,
            airticket_classes: item.airticket_classes,
            airticket_penalties: item.airticket_penalties,
            airticket_fare_difference: item.airticket_fare_difference,
            airticket_ait: item.airticket_ait,
            airticket_tax_difference: item.airticket_tax_difference,
            airticket_commission_percent: item.airticket_commission_percent,
            airticket_commission_amount: (0, commonTypes_2.numRound)(tkt_commission),
            airticket_extra_fee: item.airticket_extra_fee,
            airticket_client_price: item.airticket_client_price,
            airticket_purchase_price: (0, commonTypes_2.numRound)(item.airticket_purchase_price),
            airticket_profit: (0, commonTypes_2.numRound)(item.airticket_profit),
            airticket_pax_name: item.passport_name,
            airticket_sales_date: invoice_sales_date,
            airticket_journey_date: item.airticket_journey_date,
            airticket_return_date: item.airticket_return_date,
            airticket_route_or_sector: (_a = item.airticket_route_or_sector) === null || _a === void 0 ? void 0 : _a.join(','),
        };
        const clTransPayload = {
            ctrxn_amount: Number(item.airticket_client_price),
            client_id: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_client_id,
            combined_id: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_combined_id,
            ctrxn_created_at: invoice_sales_date,
            ctrxn_note: invoice_note,
            ctrxn_particular_id: 3,
            ctrxn_type: 'DEBIT',
            ctrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
            ctrxn_journey_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_journey_date,
            ctrxn_pax: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pax_name,
            ctrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            ctrxn_return_date: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_return_date,
            ctrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
        };
        const VTransPayload = {
            com_vendor: item.airticket_comvendor,
            vtrxn_amount: Number(item.airticket_purchase_price),
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: invoice_note,
            vtrxn_particular_id: 3,
            vtrxn_type: (airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_vendor_combine_id)
                ? 'CREDIT'
                : 'DEBIT',
            vtrxn_pnr: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pnr,
            vtrxn_route: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_route_or_sector,
            vtrxn_pax: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_pax_name,
            vtrxn_airticket_no: airTicketDetails === null || airTicketDetails === void 0 ? void 0 : airTicketDetails.airticket_ticket_no,
        };
        return {
            airTicketDetails,
            clTransPayload,
            VTransPayload,
            comVendor: item.airticket_comvendor,
            vendor_name: item.vendor_name,
        };
    });
    const invoicePayload = {
        invoice_category_id: commonTypes_1.invCategory['Air Ticket-Reissue'],
        invoice_client_id: client_id,
        invoice_combined_id: combined_id,
        invoice_sub_total,
        invoice_net_total: invoice_sub_total,
        invoice_note,
        invoice_sales_date,
        invoice_sales_man_id,
        invoice_total_profit,
        invoice_purchase_total,
        invoice_agent_commission,
        invoice_agent_id,
        invoice_due_date,
    };
    return {
        invoicePayload,
        ticketsFormat,
        comClient: invoice_combclient_id,
        client_name,
        invoice_no,
    };
};
exports.invoiceReissueFormatter = invoiceReissueFormatter;
