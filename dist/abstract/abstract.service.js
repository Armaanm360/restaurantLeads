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
const database_1 = require("../app/database");
const rootModels_1 = __importDefault(require("../models/rootModels"));
const manageFile_1 = __importDefault(require("../utils/lib/manageFile"));
const responseMessage_1 = __importDefault(require("../utils/miscellaneous/responseMessage"));
const schema_1 = __importDefault(require("../utils/miscellaneous/schema"));
const statusCode_1 = __importDefault(require("../utils/miscellaneous/statusCode"));
const doubleEntry_helper_1 = require("../common/helpers/doubleEntry.helper");
const commonTypes_1 = require("../common/types/commonTypes");
class AbstractServices {
    constructor() {
        this.db = database_1.db;
        this.manageFile = new manageFile_1.default();
        this.ResMsg = responseMessage_1.default;
        this.StatusCode = statusCode_1.default;
        this.Model = new rootModels_1.default();
        this.schema = new schema_1.default();
        this.generateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.Model.agentDashboardModel();
            const voucher = yield conn.generateVoucher(type);
            return voucher;
        });
        this.superVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            const agency_id = 154; // অথবা req থেকে dynamic
            const [[[voucher]]] = yield this.db.raw(`CALL trabill_double_entry.sp_generate_voucher('${type}', ${agency_id})`);
            return voucher.voucher_number;
        });
        this.updateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.Model.agentDashboardModel();
            yield conn.updateVoucher(type);
        });
        this.trnType = commonTypes_1.transactionTypes;
        this.accHead = commonTypes_1.accountHead;
    }
    deHelper(req, trx) {
        return new doubleEntry_helper_1.DoubleEntryHelpers(req, trx);
    }
}
exports.default = AbstractServices;
