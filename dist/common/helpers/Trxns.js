"use strict";
// import TrxnModels from '../../api/main/common/Trxn.models';
// import {
//   IAcTrxn,
//   IAcTrxnUpdate,
//   IClTrxn,
//   IClTrxnBody,
//   IClTrxnUpdate,
//   IComTrxnDb,
//   IUpdateAccTrxn,
//   IUpdateCTrxn,
//   IUpdateCombTrxn,
//   IUpdateVTrxn,
//   IVTrxn,
//   IVTrxnDb,
//   IVTrxnUpdate,
// } from '../interfaces/Trxn.interfaces';
// import { IDeletePreviousVendor } from '../interfaces/commonInterfaces';
// import { idType } from '../types/common.types';
// import { separateCombClientToId } from './common.helper';
// export class TransHelper {
//   protected conn: TrxnModels;
//   protected user_id: number;
//   protected agency_id: number;
//   constructor(conn: TrxnModels, userId: number, agencyId: number) {
//     this.conn = conn;
//     this.user_id = userId;
//     this.agency_id = agencyId;
//   }
//   // client
//   public insertClientTrans = async (body: IClTrxnBody) => {
//     const {
//       client_id,
//       combined_id,
//       ctrxn_amount,
//       ctrxn_created_at,
//       ctrxn_note,
//       ctrxn_particular_id,
//       ctrxn_pax,
//       ctrxn_pnr,
//       ctrxn_route,
//       ctrxn_type,
//       ctrxn_voucher,
//       ctrxn_airticket_no,
//       ctrxn_pay_type,
//       ctrxn_journey_date,
//       ctrxn_return_date,
//       ctrxn_ref_id,
//     } = body;
//     let clTransId = null;
//     let clComTransId = null;
//     if (client_id) {
//       const clTrxnBody: IClTrxn = {
//         ctrxn_amount,
//         ctrxn_cl_id: client_id,
//         ctrxn_created_at,
//         ctrxn_note,
//         ctrxn_particular_id,
//         ctrxn_pax,
//         ctrxn_pnr,
//         ctrxn_route,
//         ctrxn_type,
//         ctrxn_voucher,
//         ctrxn_airticket_no,
//         ctrxn_pay_type,
//         ctrxn_user_id: this.user_id,
//         ctrxn_agency_id: this.agency_id,
//         ctrxn_journey_date,
//         ctrxn_return_date,
//         ctrxn_ref_id,
//       };
//       clTransId = await this.conn.insertClTrxn(clTrxnBody);
//     } else if (combined_id) {
//       const comTrxnBody: IComTrxnDb = {
//         comtrxn_voucher_no: ctrxn_voucher,
//         comtrxn_airticket_no: ctrxn_airticket_no,
//         comtrxn_route: ctrxn_route as string,
//         comtrxn_pnr: ctrxn_pnr as string,
//         comtrxn_pax: ctrxn_pax as string,
//         comtrxn_type: ctrxn_type,
//         comtrxn_comb_id: combined_id as number,
//         comtrxn_particular_id: ctrxn_particular_id,
//         comtrxn_amount: ctrxn_amount,
//         comtrxn_note: ctrxn_note,
//         comtrxn_created_at: ctrxn_created_at,
//         comtrxn_user_id: this.user_id,
//         comtrxn_pay_type: ctrxn_pay_type,
//         comtrxn_journey_date: ctrxn_journey_date,
//         comtrxn_return_date: ctrxn_return_date,
//         comtrxn_ref_id: ctrxn_ref_id,
//         comtrxn_agency_id: this.agency_id,
//       };
//       clComTransId = await this.conn.insertComTrxn(comTrxnBody);
//     }
//     return { clTransId, clComTransId };
//   };
//   // INSERT ACCOUNT TRANS
//   public AccTrxnInsert = async (body: IAcTrxn) => {
//     const {
//       acctrxn_ac_id,
//       acctrxn_pay_type,
//       acctrxn_particular_id,
//       acctrxn_created_at,
//       acctrxn_type,
//       acctrxn_amount,
//       acctrxn_note,
//       acctrxn_created_by,
//       acctrxn_voucher,
//     } = body;
//     const accBody: IAcTrxn = {
//       acctrxn_ac_id: acctrxn_ac_id,
//       acctrxn_pay_type,
//       acctrxn_particular_id,
//       acctrxn_voucher,
//       acctrxn_type,
//       acctrxn_amount,
//       acctrxn_note,
//       acctrxn_created_at,
//       acctrxn_created_by,
//     };
//     const account_id = await this.conn.insertAccTrxn(accBody);
//     return account_id;
//   };
//   public AccTrxnUpdate = async (body: IAcTrxnUpdate) => {
//     const {
//       acctrxn_ac_id,
//       acctrxn_amount,
//       acctrxn_created_at,
//       acctrxn_note,
//       acctrxn_particular_id,
//       acctrxn_pay_type,
//       acctrxn_type,
//       trxn_id,
//     } = body;
//     const acTrxnBody: IUpdateAccTrxn = {
//       p_ac_id: acctrxn_ac_id,
//       p_amount: acctrxn_amount,
//       p_created_at: acctrxn_created_at,
//       p_note: acctrxn_note as string,
//       p_particular_id: acctrxn_particular_id,
//       p_pay_type: acctrxn_pay_type,
//       p_type: acctrxn_type,
//       p_trxn_id: trxn_id,
//     };
//     await this.conn.updateAccTrxn(acTrxnBody);
//     return trxn_id;
//   };
//   public deleteAccTrxn = async (trxn_id: idType) => {
//     await this.conn.deleteAccTrxn(trxn_id);
//   };
//   deleteClientTrans = async (trxn_id: idType) => {
//     if (trxn_id) await this.conn.deleteClientTrans(trxn_id as number);
//   };
//   deleteComTrxn = async (trxn_id: idType) => {
//     if (trxn_id) await this.conn.deleteComTrxn(trxn_id);
//   };
//   public updateClientTrans = async (body: IClTrxnUpdate) => {
//     const {
//       ctrxn_amount,
//       ctrxn_created_at,
//       ctrxn_note,
//       ctrxn_particular_id,
//       ctrxn_pax,
//       ctrxn_pnr,
//       ctrxn_airticket_no,
//       ctrxn_route,
//       ctrxn_type,
//       ctrxn_pay_type,
//       client_id,
//       combined_id,
//       transId,
//     } = body;
//     if (transId && client_id) {
//       const clTrxnBody: IUpdateCTrxn = {
//         p_trxn_id: transId,
//         p_client_id: client_id,
//         p_note: ctrxn_note,
//         p_amount: ctrxn_amount,
//         p_particular_id: ctrxn_particular_id,
//         p_pax: ctrxn_pax,
//         p_pnr: ctrxn_pnr as string,
//         p_created_at: ctrxn_created_at,
//         p_route: ctrxn_route,
//         p_type: ctrxn_type,
//         p_airticket_no: ctrxn_airticket_no as string,
//         p_pay_type: ctrxn_pay_type as string,
//       };
//       await this.conn.updateClTrxn(clTrxnBody);
//     } else if (transId && combined_id) {
//       const comTrxnBody: IUpdateCombTrxn = {
//         p_trxn_id: transId,
//         p_type: ctrxn_type,
//         p_comb_id: combined_id,
//         p_particular_id: ctrxn_particular_id,
//         p_amount: ctrxn_amount,
//         p_note: ctrxn_note,
//         p_create_at: ctrxn_created_at,
//         p_pax: ctrxn_pax as string,
//         p_airticket_no: ctrxn_airticket_no,
//         p_pnr: ctrxn_pnr,
//         p_route: ctrxn_route,
//       };
//       await this.conn.updateComTrxn(comTrxnBody);
//     }
//   };
//   // vendor
//   public insertVendorTrans = async (body: IVTrxn) => {
//     const {
//       com_vendor,
//       vtrxn_voucher,
//       vtrxn_pax,
//       vtrxn_airticket_no,
//       vtrxn_pnr,
//       vtrxn_route,
//       vtrxn_type,
//       vtrxn_amount,
//       vtrxn_particular_id,
//       vtrxn_note,
//       vtrxn_created_at,
//       vtrxn_pay_type,
//       vtrxn_ref_id,
//     } = body;
//     let vendorTransId = null;
//     let vendorComTransId = null;
//     const { vendor_id, combined_id } = separateCombClientToId(com_vendor);
//     if (vendor_id) {
//       const VTrxnBody: IVTrxnDb = {
//         vtrxn_voucher,
//         vtrxn_pax,
//         vtrxn_type,
//         vtrxn_amount,
//         vtrxn_particular_id,
//         vtrxn_note,
//         vtrxn_created_at,
//         vtrxn_v_id: vendor_id,
//         vtrxn_airticket_no,
//         vtrxn_pnr,
//         vtrxn_route,
//         vtrxn_pay_type,
//         vtrxn_ref_id,
//         vtrxn_agency_id: this.agency_id,
//         vtrxn_user_id: this.user_id,
//       };
//       vendorTransId = await this.conn.insertVTrxn(VTrxnBody);
//     } else if (combined_id) {
//       const comTrxnBody: IComTrxnDb = {
//         comtrxn_voucher_no: vtrxn_voucher,
//         comtrxn_type: vtrxn_type,
//         comtrxn_comb_id: combined_id as number,
//         comtrxn_particular_id: vtrxn_particular_id,
//         comtrxn_amount: vtrxn_amount,
//         comtrxn_note: vtrxn_note,
//         comtrxn_created_at: vtrxn_created_at,
//         comtrxn_user_id: this.user_id,
//         comtrxn_agency_id: this.agency_id,
//         comtrxn_pax: vtrxn_pax as string,
//         comtrxn_pnr: vtrxn_pnr as string,
//         comtrxn_route: vtrxn_route as string,
//         comtrxn_airticket_no: vtrxn_airticket_no,
//         comtrxn_ref_id: vtrxn_ref_id,
//       };
//       vendorComTransId = await this.conn.insertComTrxn(comTrxnBody);
//     }
//     return { vendorTransId, vendorComTransId };
//   };
//   public updateVendorTrans = async (body: IVTrxnUpdate) => {
//     const {
//       trxn_id,
//       vendor_id: vId,
//       combined_id: comId,
//       com_vendor,
//       vtrxn_pax,
//       vtrxn_type,
//       vtrxn_amount,
//       vtrxn_particular_id,
//       vtrxn_note,
//       vtrxn_created_at,
//       vtrxn_airticket_no,
//       vtrxn_pnr,
//       vtrxn_route,
//       vtrxn_pay_type,
//     } = body;
//     const { vendor_id, combined_id } = separateCombClientToId(
//       com_vendor as string
//     );
//     if (vendor_id || vId) {
//       const VTrxnBody: IUpdateVTrxn = {
//         p_trxn_id: trxn_id,
//         vtrxn_v_id: vendor_id || vId,
//         vtrxn_airticket_no,
//         vtrxn_pax,
//         vtrxn_pnr,
//         vtrxn_route,
//         vtrxn_type,
//         vtrxn_amount,
//         vtrxn_particular_id,
//         vtrxn_note,
//         vtrxn_user_id: this.user_id,
//         vtrxn_created_at,
//         vtrxn_pay_type: body.vtrxn_pay_type,
//       };
//       await this.conn.updateVTrxn(VTrxnBody);
//     } else if (combined_id || comId) {
//       const ComTrxnBody: IUpdateCombTrxn = {
//         p_trxn_id: trxn_id,
//         p_airticket_no: vtrxn_airticket_no,
//         p_route: vtrxn_route,
//         p_pnr: vtrxn_pnr,
//         p_pax: vtrxn_pax as string,
//         p_type: vtrxn_type,
//         p_comb_id: combined_id || comId,
//         p_particular_id: vtrxn_particular_id,
//         p_amount: vtrxn_amount,
//         p_note: vtrxn_note,
//         p_create_at: vtrxn_created_at,
//       };
//       await this.conn.updateComTrxn(ComTrxnBody);
//     }
//     return trxn_id;
//   };
//   public deleteVendorTrans = async (trxn_id: number) => {
//     if (trxn_id) await this.conn.deleteVendorTrans(trxn_id);
//   };
//   public deleteInvVTrxn = async (billing: IDeletePreviousVendor[]) => {
//     for (const prevItem of billing) {
//       const { combined_id, vendor_id, prevTrxnId } = prevItem;
//       if (vendor_id && prevTrxnId) {
//         await this.conn.deleteVendorTrans(prevTrxnId);
//       } else if (combined_id && prevTrxnId) {
//         await this.conn.deleteComTrxn(prevTrxnId);
//       }
//     }
//   };
// }
