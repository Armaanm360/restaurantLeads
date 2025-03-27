import AgentDashboardModel from '../../models/agent/agentDashboard.model';
import { numRound } from '../types/commonTypes';
import { separateCombClientToId } from './common.helper';
import {
  IAirTicketBody,
  IClTrxnBody,
  invCategory,
  IVTrxn,
} from './commonTypes';

// INVOICE AIR TICKET
export const airTicketPayloadFormatter = async (
  body: IAirTicketBody,
  conn: AgentDashboardModel,
  invoice_id?: number
) => {
  const {
    invoice_agent_commission,
    invoice_combclient_id,
    invoice_sales_date,
    invoice_sales_man_id,
    invoice_customer_name,
    invoice_show_discount,
    invoice_show_passport_details,
    invoice_show_prev_due,
    invoice_show_unit,
    invoice_note,
    invoice_agent_id,
    invoice_due_date,
    client_name,
    tickets,
    invoice_no,
  } = body;

  const { client_id, combined_id } = separateCombClientToId(
    invoice_combclient_id
  );

  let invoice_sub_total = 0;
  let invoice_discount = 0;
  let invoice_service_charge = 0;
  let invoice_net_total = 0;
  let invoice_purchase_total = 0;

  const ticketsFormat = [];

  for (const item of tickets) {
    console.log(
      'Hello World From Ticket Utils',
      item.airticket_ticket_no,
      invoice_id
    );
    // const isExist = await conn.checkTicket(
    //   item.airticket_ticket_no,
    //   invoice_id
    // );

    // if (isExist.length) {
    //   //   throw new CustomError(
    //   //     `The ticket number "${item.airticket_ticket_no}" already exists in the system. Please verify and try again.`,
    //   //     400,
    //   //     'Duplicate Ticket Number'
    //   //   );
    // }

    const {
      combined_id: airticket_vendor_combine_id,
      vendor_id: airticket_vendor_id,
    } = separateCombClientToId(item.airticket_comvendor);

    const tkt_commission =
      item.airticket_base_fare * (item.airticket_commission_percent / 100);

    const taxesCommission = item.taxes_commission?.reduce(
      (acc, curr) => acc + Number(curr.airline_commission),
      0
    );

    let totalCountryTax =
      numRound(item.airticket_bd_charge) +
      numRound(item.airticket_ut_charge) +
      numRound(item.airticket_e5_charge);

    const countryTaxAit = totalCountryTax * 0.003;
    const airticket_ait = item.airticket_gross_fare * 0.003 + countryTaxAit;

    const airticket_net_commission =
      numRound(tkt_commission) - airticket_ait + (taxesCommission || 0);

    const airticket_purchase_price =
      numRound(item?.airticket_gross_fare) - numRound(airticket_net_commission);

    const airticket_client_price =
      numRound(item.airticket_extra_fee) + // Extra fee
      numRound(item?.airticket_vat) + // VAT
      (item.airticket_gross_fare - numRound(item.airticket_discount_total)); // Gross fare minus discount

    // ----
    invoice_sub_total += numRound(item.airticket_gross_fare);
    invoice_discount += numRound(item?.airticket_discount_total);
    invoice_service_charge += numRound(item?.airticket_extra_fee);
    invoice_net_total += airticket_client_price;
    invoice_purchase_total += numRound(airticket_purchase_price);

    const airTicketDetails = {
      airticket_id: item.airticket_id,
      airticket_is_deleted: item.airticket_is_deleted,
      airticket_client_id: client_id,
      airticket_combined_id: combined_id,
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
      airticket_commission_amount: numRound(tkt_commission),
      airticket_ait,
      airticket_total_taxes_commission: taxesCommission || 0,
      airticket_discount_total: item.airticket_discount_total,
      airticket_net_commission,
      airticket_tax: item.airticket_gross_fare - item.airticket_base_fare,
      airticket_extra_fee: item.airticket_extra_fee,
      airticket_client_price,
      airticket_purchase_price: numRound(airticket_purchase_price),
      airticket_profit: numRound(airticket_net_commission),
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
      airticket_route_or_sector: item.airticket_route_or_sector?.join(','),
      airticket_vat: item?.airticket_vat,
    };

    const clTransPayload: IClTrxnBody = {
      ctrxn_amount: airticket_client_price,
      client_id: airTicketDetails?.airticket_client_id,
      combined_id: airTicketDetails?.airticket_combined_id,
      ctrxn_created_at: invoice_sales_date,
      ctrxn_note: item?.airticket_remarks || invoice_note,
      ctrxn_particular_id: 1,
      ctrxn_type: 'DEBIT',
      ctrxn_airticket_no: airTicketDetails?.airticket_ticket_no,
      ctrxn_journey_date: airTicketDetails?.airticket_journey_date,
      ctrxn_pax: airTicketDetails?.airticket_pax_name,
      ctrxn_pnr: airTicketDetails?.airticket_pnr,
      ctrxn_return_date: airTicketDetails?.airticket_return_date,
      ctrxn_route: airTicketDetails?.airticket_route_or_sector,
    };

    const VTransPayload: IVTrxn = {
      com_vendor: item.airticket_comvendor,
      vtrxn_amount: airticket_purchase_price,
      vtrxn_created_at: invoice_sales_date,
      vtrxn_note: item?.airticket_remarks || invoice_note,
      vtrxn_particular_id: 1,
      // vtrxn_type: airTicketDetails?.airticket_vendor_combine_id
      //   ? 'CREDIT'
      //   : 'DEBIT',
      vtrxn_type: 'CREDIT',
      vtrxn_pnr: airTicketDetails?.airticket_pnr,
      vtrxn_route: airTicketDetails?.airticket_route_or_sector,
      vtrxn_pax: airTicketDetails?.airticket_pax_name,
      vtrxn_airticket_no: airTicketDetails?.airticket_ticket_no,
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
      flightDetails: item?.flight_details,
      clTransPayload,
      VTransPayload,
      comVendor: item.airticket_comvendor,
      taxes_commission: item.taxes_commission,
      vendor_name: item.vendor_name,
    };

    ticketsFormat.push(ticketData);
  }

  const invoicePayload = {
    invoice_category_id: invCategory['Air Ticket'],
    invoice_client_id: client_id,
    invoice_combined_id: combined_id,
    invoice_sub_total,
    invoice_discount,
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
