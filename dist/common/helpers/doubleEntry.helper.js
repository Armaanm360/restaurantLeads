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
exports.DoubleEntryHelpers = void 0;
// import db from '../../app/db';
const commonTypes_1 = require("../types/commonTypes");
class DoubleEntryHelpers {
    constructor(req, trx) {
        this.insertAccVoucher = (serial_no, acc_head_id, voucher_no, amount, trans_type, description, payment_type, payment_method, bank_name) => __awaiter(this, void 0, void 0, function* () {
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
            // return await this.conn.insertAccVoucher(payload);
        });
        this.req = req;
        // Initialize the connection directly without using the Models class
        // this.conn = new AgentDashboardModel(req, trx);
    }
}
exports.DoubleEntryHelpers = DoubleEntryHelpers;
